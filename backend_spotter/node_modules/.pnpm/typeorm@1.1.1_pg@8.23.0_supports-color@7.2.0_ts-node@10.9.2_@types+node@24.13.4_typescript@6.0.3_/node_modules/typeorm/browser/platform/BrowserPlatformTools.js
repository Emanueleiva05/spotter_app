"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Writable = exports.Readable = exports.EventEmitter = exports.PlatformTools = void 0;
const RandomGenerator_1 = require("../util/RandomGenerator");
/**
 * Browser's implementation of the platform-specific tools.
 *
 * This file gonna replace PlatformTools for browser environment.
 * For node.js environment this class is not getting packaged.
 * Don't use methods of this class in the code, use PlatformTools methods instead.
 */
class PlatformTools {
    /**
     * Type of the currently running platform.
     */
    static { this.type = "browser"; }
    /**
     * Gets global variable where global stuff can be stored.
     */
    static getGlobalVariable() {
        if (typeof window !== "undefined") {
            return window;
        }
        if (typeof globalThis !== "undefined") {
            return globalThis;
        }
        // NativeScript uses global, not window
        return global;
    }
    /**
     * Loads ("require"-s) given file or package.
     * This operation only supports on node platform
     */
    static load(name) {
        const KNOWN_MODULES = [
            // Expo
            "expo-sqlite",
            // React Native
            "react-native-sqlite-storage",
            // sql.js
            "sql.js",
            // redis
            "redis",
            "ioredis",
        ];
        if (!KNOWN_MODULES.includes(name)) {
            throw new TypeError(`Invalid Package for PlatformTools.load: ${name}`);
        }
        return require(name);
    }
    /**
     * @param input string to encode
     * @returns the SHA-1 digest of the input string
     */
    static sha1(input) {
        return RandomGenerator_1.RandomGenerator.sha1(input);
    }
    /**
     * Normalizes given path. Does "path.normalize".
     */
    static pathNormalize(pathStr) {
        if (this.type === "browser")
            throw new Error(`This option/function is not supported in the browser environment. Failed operation: path.normalize("${pathStr}").`);
        return "";
    }
    /**
     * Gets file extension. Does "path.extname".
     */
    static pathExtname(pathStr) {
        if (this.type === "browser")
            throw new Error(`This option/function is not supported in the browser environment. Failed operation: path.extname("${pathStr}").`);
        return "";
    }
    /**
     * Resolved given path. Does "path.resolve".
     */
    static pathResolve(...paths) {
        if (this.type === "browser")
            throw new Error(`This option/function is not supported in the browser environment. Failed operation: path.resolve("${paths.join('", "')}").`);
        return "";
    }
    /**
     * Synchronously checks if file exist. Does "fs.existsSync".
     */
    static fileExist(pathStr) {
        if (this.type === "browser")
            throw new Error(`This option/function is not supported in the browser environment. Failed operation: fs.existsSync("${pathStr}").`);
        return false;
    }
    static readFileSync(filename) {
        if (this.type === "browser")
            throw new Error(`This option/function is not supported in the browser environment. Failed operation: fs.readFileSync("${filename}").`);
        return null;
    }
    static appendFileSync(filename, data) {
        if (this.type === "browser")
            throw new Error(`This option/function is not supported in the browser environment. Failed operation: fs.appendFileSync("${filename}").`);
    }
    static writeFile(path, data) {
        if (this.type === "browser")
            throw new Error(`This option/function is not supported in the browser environment. Failed operation: fs.writeFile("${path}").`);
        return Promise.reject(null);
    }
    /**
     * Highlights sql string to be printed in the console.
     */
    static highlightSql(sql) {
        return sql;
    }
    /**
     * Logging functions needed by AdvancedConsoleLogger (but here without ANSI colors)
     */
    static logInfo(prefix, info) {
        console.info(prefix + " ", info);
    }
    static logError(prefix, error) {
        console.error(prefix + " ", error);
    }
    static logWarn(prefix, warning) {
        console.warn(prefix + " ", warning);
    }
    static log(message) {
        console.log(message);
    }
    static warn(message) {
        return message;
    }
}
exports.PlatformTools = PlatformTools;
/**
 * These classes are needed for stream operations or
 * in the mongodb driver. Both aren't supported in the browser.
 */
class EventEmitter {
}
exports.EventEmitter = EventEmitter;
class Readable {
}
exports.Readable = Readable;
class Writable {
}
exports.Writable = Writable;
//# sourceMappingURL=BrowserPlatformTools.js.map