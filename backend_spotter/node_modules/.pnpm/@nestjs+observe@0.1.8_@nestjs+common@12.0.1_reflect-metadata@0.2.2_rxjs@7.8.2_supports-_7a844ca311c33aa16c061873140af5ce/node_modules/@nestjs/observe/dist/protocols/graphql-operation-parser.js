/**
 * Reads the operation out of a GraphQL document, without parsing it.
 *
 * The request-lifecycle hooks hand this module a query *string*, and
 * everything the module labels a trace with - the operation id, and the
 * `GraphQLResolveInfo`-shaped `info` the `graphql` options are called with -
 * is derived from it here.
 *
 * `graphql`'s own `parse` is deliberately not used. It is an optional peer, it
 * builds a full AST, and the server is about to do exactly that anyway: this
 * runs on every operation, so it stops at the first field of the first
 * operation definition and never looks at the rest of the document.
 */
/** Operation keywords, mapped to the root type each one resolves against. */
const ROOT_TYPE_BY_KEYWORD = {
    query: "Query",
    mutation: "Mutation",
    subscription: "Subscription",
};
/**
 * Parsed results are cached: a client sends the same handful of documents over
 * and over, and re-scanning each one per request is pure waste. Bounded because
 * the key is attacker-supplied - a client sending unique documents must not be
 * able to grow this without limit.
 */
const CACHE_LIMIT = 512;
const cache = new Map();
/**
 * Builds the `GraphQLResolveInfo`-shaped object the `graphql` options receive.
 *
 * It is genuinely synthetic - there is no single field being resolved when the
 * whole operation is the unit of measurement - but it carries the same values
 * a root field's real info would, which is the shape `ignore` and
 * `setAttributes` are written against.
 */
export function toResolveInfoLike(operation) {
    return {
        fieldName: operation.fieldName,
        parentType: { name: operation.rootTypeName },
        operation: {
            operation: operation.rootTypeName.toLowerCase(),
            name: operation.operationName
                ? { value: operation.operationName }
                : undefined,
        },
    };
}
/**
 * Finds the first operation definition in a document and its first root field.
 *
 * Returns `undefined` for anything it cannot label with confidence - a document
 * whose first selection is a fragment spread, or one that does not parse as far
 * as a selection set. Callers fall back to the operation name, and failing that
 * leave the operation uninstrumented.
 */
export function parseGraphQLOperation(document) {
    if (!document) {
        return undefined;
    }
    if (cache.has(document)) {
        return cache.get(document);
    }
    const parsed = scan(document);
    if (cache.size >= CACHE_LIMIT) {
        // Oldest entry out. Map iterates in insertion order, so this is the least
        // recently *added* document rather than the least recently used one - close
        // enough for a cache whose job is to absorb a client's fixed set of queries.
        cache.delete(cache.keys().next().value);
    }
    cache.set(document, parsed);
    return parsed;
}
/** Test seam: the cache is process-wide and would leak between cases. */
export function clearGraphQLOperationCache() {
    cache.clear();
}
function scan(document) {
    const source = stripIgnoredTokens(document);
    const words = [];
    let index = 0;
    while (index < source.length) {
        const char = source[index];
        if (isNameStart(char)) {
            const start = index;
            while (index < source.length && isNameChar(source[index])) {
                index += 1;
            }
            words.push(source.slice(start, index));
            continue;
        }
        // A directive's name is not part of the definition's header - `query @live`
        // must not read `live` as the operation name.
        if (char === "@") {
            index += 1;
            while (index < source.length && isNameChar(source[index])) {
                index += 1;
            }
            continue;
        }
        // Variable definitions, with default values that may themselves contain
        // braces: `query Q($filter: F = { paid: true })`.
        if (char === "(") {
            index = skipBalanced(source, index, "(", ")");
            continue;
        }
        if (char === "{") {
            if (words[0] === "fragment") {
                // A fragment may precede the operation it is used by. Skip its body and
                // keep looking for a definition that is one.
                index = skipBalanced(source, index, "{", "}");
                words.length = 0;
                continue;
            }
            return toOperation(words, readFirstFieldName(source, index + 1), source);
        }
        index += 1;
    }
    return undefined;
}
function toOperation(words, fieldName, source) {
    if (!fieldName) {
        return undefined;
    }
    // Shorthand - `{ orders { id } }` - has no keyword at all and is a query.
    const keyword = words[0] ? words[0].toLowerCase() : "query";
    const rootTypeName = ROOT_TYPE_BY_KEYWORD[keyword];
    if (!rootTypeName) {
        return undefined;
    }
    return {
        rootTypeName,
        fieldName,
        operationName: words[0] ? words[1] : undefined,
        // Whitespace is collapsed only here, at the end: `source` positions have to
        // stay valid while the scan is still reading from it.
        sanitizedDocument: source.replace(/\s+/g, " ").trim(),
    };
}
/**
 * Reads the first field selected inside a selection set, seeing through an
 * alias: `latest: orders` is a selection of `orders`, and that is the name a
 * resolver's info would have reported.
 */
function readFirstFieldName(source, from) {
    let index = from;
    while (index < source.length) {
        const char = source[index];
        if (isNameStart(char)) {
            const start = index;
            while (index < source.length && isNameChar(source[index])) {
                index += 1;
            }
            const name = source.slice(start, index);
            let lookahead = index;
            while (lookahead < source.length && isIgnored(source[lookahead])) {
                lookahead += 1;
            }
            if (source[lookahead] === ":") {
                // An alias: the selected field is the next name. Iteration, not
                // recursion - the document is caller-supplied, and a long enough run
                // of colons must cost a loop pass each, never a stack frame each.
                index = lookahead + 1;
                continue;
            }
            return name;
        }
        // A fragment spread or inline fragment first: the field is defined
        // elsewhere in the document, and chasing it is not worth an AST.
        if (char === "." || char === "}") {
            return undefined;
        }
        index += 1;
    }
    return undefined;
}
/**
 * Blanks out comments and strings, so neither can be mistaken for a name or a
 * brace. Offsets are not preserved - nothing downstream maps back to the
 * original text.
 */
function stripIgnoredTokens(document) {
    let out = "";
    let index = 0;
    while (index < document.length) {
        const char = document[index];
        if (char === "#") {
            while (index < document.length && document[index] !== "\n") {
                index += 1;
            }
            continue;
        }
        if (char === '"') {
            if (document.startsWith('"""', index)) {
                const end = document.indexOf('"""', index + 3);
                index = end === -1 ? document.length : end + 3;
            }
            else {
                index += 1;
                while (index < document.length && document[index] !== '"') {
                    index += document[index] === "\\" ? 2 : 1;
                }
                index += 1;
            }
            // Left as a token that is neither a name nor a brace, so a default value
            // of `""` still reads as a value rather than as nothing at all.
            out += "_";
            continue;
        }
        out += char;
        index += 1;
    }
    return out;
}
function skipBalanced(source, from, open, close) {
    let depth = 0;
    let index = from;
    while (index < source.length) {
        const char = source[index];
        if (char === open) {
            depth += 1;
        }
        else if (char === close) {
            depth -= 1;
            if (depth === 0) {
                return index + 1;
            }
        }
        index += 1;
    }
    return source.length;
}
function isNameStart(char) {
    return /[_A-Za-z]/.test(char);
}
function isNameChar(char) {
    return /[_0-9A-Za-z]/.test(char);
}
function isIgnored(char) {
    return char === " " || char === "\t" || char === "\n" || char === "\r";
}
