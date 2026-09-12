import { readFileSync } from "fs";
import { resolve, sep } from "path";
import { resolveOriginalPosition } from "./source-map-resolver.util.js";
const DEFAULT_LINES_OF_CONTEXT = 5;
/**
 * Frames worth reading source for. Everything below the app - dependencies and
 * the Node internals - is noise on a stack view and would balloon the payload.
 */
const IGNORED_FRAME_PATTERNS = [
    /[\\/]node_modules[\\/]/,
    /^node:/,
    /^internal[\\/]/,
    /^\s*$/,
];
/**
 * Cap on distinct files held in memory. Source files do not change while the
 * process runs, so entries never need invalidating; this only bounds a pathological
 * process that throws from thousands of distinct files.
 */
const MAX_CACHED_FILES = 200;
const MAX_LINES_OF_CONTEXT = 50;
const MAX_FRAMES = 20;
/**
 * Files already read, including ones that failed (cached as null) so a bundled or
 * deleted file is not retried on every single throw.
 */
const sourceCache = new Map();
/**
 * V8 stack frame lines, both shapes:
 *   at fn (/abs/path/file.ts:42:31)
 *   at /abs/path/file.ts:42:31
 */
const FRAME_PATTERN = /^\s*at\s+(?:.*?\s+\()?(.+?):(\d+):(\d+)\)?\s*$/;
function isIgnored(file) {
    return IGNORED_FRAME_PATTERNS.some((pattern) => pattern.test(file));
}
/**
 * Extensions a stack frame can legitimately point at. An allowlist rather than
 * a denylist, because the set of files that must never be read (`.env`, key
 * material, arbitrary system files) is open-ended and the set of files V8 can
 * actually be executing is not.
 */
const READABLE_EXTENSIONS = /\.(?:js|cjs|mjs|jsx|ts|cts|mts|tsx)$/;
/**
 * Whether a frame's path is one this module is willing to read and ship.
 *
 * A stack string is not a trusted input: `Error#stack` is message plus frames,
 * the message routinely interpolates user data, and a multi-line value there
 * puts attacker-chosen text on its own line where it parses exactly like a
 * frame. An unrestricted reader would turn that into "log a crafted string,
 * receive any file on the host in the telemetry store". So only files under
 * the application's own root, with an extension the runtime can execute, are
 * eligible - which is also precisely the set of files worth rendering.
 */
function isReadableSourcePath(file) {
    if (!READABLE_EXTENSIONS.test(file)) {
        return false;
    }
    const root = resolve(process.cwd());
    const resolved = resolve(file);
    return resolved === root || resolved.startsWith(root + sep);
}
function parseFrames(stack) {
    const frames = [];
    for (const raw of stack.split("\n")) {
        const match = FRAME_PATTERN.exec(raw);
        if (!match) {
            continue;
        }
        const [, file, line, column] = match;
        if (isIgnored(file)) {
            continue;
        }
        // Only absolute paths can be read back off disk. Anything else (an eval
        // frame, a bundled virtual path) has no file to open.
        if (!file.startsWith("/") && !/^[a-zA-Z]:[\\/]/.test(file)) {
            continue;
        }
        if (!isReadableSourcePath(file)) {
            continue;
        }
        frames.push({ file, line: Number(line), column: Number(column) });
    }
    return frames;
}
function readSource(file) {
    if (sourceCache.has(file)) {
        return sourceCache.get(file);
    }
    let lines = null;
    try {
        lines = readFileSync(file, "utf8").split("\n");
    }
    catch {
        // Unreadable for any reason - bundled away, permissions, deleted since
        // build. Cached as a miss so it is not retried on the next throw.
        lines = null;
    }
    if (sourceCache.size >= MAX_CACHED_FILES) {
        const oldest = sourceCache.keys().next().value;
        if (oldest !== undefined) {
            sourceCache.delete(oldest);
        }
    }
    sourceCache.set(file, lines);
    return lines;
}
/**
 * Reads source around each in-app frame of a stack trace.
 *
 * Only the machine running the code can read its own files, so this has to happen
 * agent-side at throw time - the position in a frame is already exact (the app
 * runs with source-map support, so frames resolve to TypeScript), but the file
 * contents are not something the server can recover.
 *
 * Deliberately bounded: in-app frames only, a handful of lines either side, and a
 * cap on how many frames are attached, because whatever this returns is shipped to
 * the server and stored in the telemetry database.
 *
 * Never throws - source context is a nicety and must not be able to break the
 * request that was already failing.
 */
export function collectCodeFrames(stack, options = {}) {
    if (!stack) {
        return undefined;
    }
    const linesOfContext = options.linesOfContext ?? DEFAULT_LINES_OF_CONTEXT;
    if (linesOfContext < 0) {
        throw new Error("linesOfContext must be non-negative");
    }
    if (options.maxFrames !== undefined && options.maxFrames < 0) {
        throw new Error("maxFrames must be non-negative");
    }
    if (options.sourceMaps !== undefined &&
        typeof options.sourceMaps !== "boolean") {
        throw new Error("sourceMaps must be a boolean");
    }
    if (linesOfContext > MAX_LINES_OF_CONTEXT) {
        throw new Error(`linesOfContext must not exceed ${MAX_LINES_OF_CONTEXT}`);
    }
    if (options.maxFrames !== undefined && options.maxFrames > MAX_FRAMES) {
        throw new Error(`maxFrames must not exceed ${MAX_FRAMES}`);
    }
    const maxFrames = options.maxFrames ?? 5;
    try {
        const frames = parseFrames(stack).slice(0, maxFrames);
        const codeFrames = [];
        for (const frame of frames) {
            let file = frame.file;
            let line = frame.line;
            let source = null;
            if (options.sourceMaps) {
                const original = resolveOriginalPosition(frame.file, frame.line, frame.column);
                if (original) {
                    // Re-apply the in-app filter to the mapped path: a frame in
                    // dist/main.js can map back into node_modules, and that is still noise.
                    if (isIgnored(original.file)) {
                        continue;
                    }
                    file = original.file;
                    line = original.line;
                    // Prefer the map's embedded copy - it is the source this build was
                    // compiled from, and it works when the source tree is not deployed.
                    source = original.content ?? null;
                }
            }
            source ??= readSource(file);
            if (!source) {
                continue;
            }
            if (line > source.length) {
                // Position does not fit the file - stale build against changed source.
                continue;
            }
            // Frame lines are 1-based; array indices are 0-based.
            const firstLine = Math.max(1, line - linesOfContext);
            const lastLine = Math.min(source.length, line + linesOfContext);
            codeFrames.push({
                file,
                line,
                firstLine,
                lines: source.slice(firstLine - 1, lastLine),
            });
        }
        return codeFrames.length ? codeFrames : undefined;
    }
    catch {
        return undefined;
    }
}
