"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformTools = exports.Writable = exports.Readable = exports.ReadStream = exports.EventEmitter = void 0;
const tslib_1 = require("tslib");
const formatter_1 = require("@sqltools/formatter");
const ansis_1 = tslib_1.__importDefault(require("ansis"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const sql_highlight_1 = require("sql-highlight");
var events_1 = require("events");
Object.defineProperty(exports, "EventEmitter", { enumerable: true, get: function () { return events_1.EventEmitter; } });
var fs_2 = require("fs");
Object.defineProperty(exports, "ReadStream", { enumerable: true, get: function () { return fs_2.ReadStream; } });
var stream_1 = require("stream");
Object.defineProperty(exports, "Readable", { enumerable: true, get: function () { return stream_1.Readable; } });
Object.defineProperty(exports, "Writable", { enumerable: true, get: function () { return stream_1.Writable; } });
/**
 * Platform-specific tools.
 */
class PlatformTools {
    /**
     * Type of the currently running platform.
     */
    static { this.type = "node"; }
    /**
     * @returns the platform-specific global variable
     */
    static getGlobalVariable() {
        if (typeof globalThis !== "undefined") {
            return globalThis;
        }
        return global;
    }
    /**
     * Loads ("require"-s) given file or package.
     * This operation is only supported on the NodeJS platform
     *
     * @param name name of the module to be imported
     * @returns the module
     */
    static load(name) {
        const KNOWN_MODULES = [
            // AWS Aurora Data API (PostgreSQL/MySQL)
            "typeorm-aurora-data-api-driver",
            // better-sqlite3
            "better-sqlite3",
            // Expo
            "expo-sqlite",
            // Google Cloud Spanner
            "@google-cloud/spanner",
            // Microsoft SQL Server
            "mssql",
            // MongoDB
            "mongodb",
            // MySQL / MariaDB
            "mysql2",
            // Oracle
            "oracledb",
            // PostgreSQL
            "pg",
            "pg-native",
            "pg-query-stream",
            // React Native
            "react-native-sqlite-storage",
            // SAP HANA
            "@sap/hana-client",
            "@sap/hana-client/extension/Stream",
            // sql.js
            "sql.js",
            // redis
            "redis",
            "ioredis",
        ];
        if (!KNOWN_MODULES.includes(name)) {
            throw new TypeError(`Invalid Package for PlatformTools.load: ${name}`);
        }
        // if name is not absolute or relative, then try to load package from the node_modules of the directory we are currently in
        // this is useful when we are using typeorm package globally installed and it accesses drivers
        // that are not installed globally
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            return require(name);
        }
        catch {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            return require(path_1.default.resolve(process.cwd() + "/node_modules/" + name));
        }
    }
    /**
     * Returns a SHA-1 hex digest for internal IDs/aliases (not for cryptographic security)
     *
     * @param input string to encode
     * @returns the SHA-1 digest of the input string
     */
    static sha1(input) {
        const hashFunction = crypto_1.default.createHash("sha1");
        hashFunction.update(input, "utf8");
        return hashFunction.digest("hex");
    }
    /**
     * Normalizes given path. Does "path.normalize" and replaces backslashes with forward slashes on Windows.
     *
     * @param pathStr
     */
    static pathNormalize(pathStr) {
        let normalizedPath = path_1.default.normalize(pathStr);
        if (process.platform === "win32")
            normalizedPath = normalizedPath.replaceAll("\\", "/");
        return normalizedPath;
    }
    /**
     * Gets file extension. Does "path.extname".
     *
     * @param pathStr
     */
    static pathExtname(pathStr) {
        return path_1.default.extname(pathStr);
    }
    /**
     * Resolved given path. Does "path.resolve".
     *
     * @param paths
     */
    static pathResolve(...paths) {
        return path_1.default.resolve(...paths);
    }
    /**
     * Synchronously checks if file exist. Does "fs.existsSync".
     *
     * @param pathStr
     */
    static fileExist(pathStr) {
        return fs_1.default.existsSync(pathStr);
    }
    static readFileSync(filename) {
        return fs_1.default.readFileSync(filename);
    }
    static appendFileSync(filename, data) {
        fs_1.default.appendFileSync(filename, data);
    }
    static async writeFile(path, data) {
        return fs_1.default.promises.writeFile(path, data);
    }
    /**
     * Highlights sql string to be printed in the console.
     *
     * @param sql
     */
    static highlightSql(sql) {
        return (0, sql_highlight_1.highlight)(sql, {
            colors: {
                keyword: ansis_1.default.blueBright.open,
                function: ansis_1.default.magentaBright.open,
                number: ansis_1.default.green.open,
                string: ansis_1.default.white.open,
                identifier: ansis_1.default.white.open,
                special: ansis_1.default.white.open,
                bracket: ansis_1.default.white.open,
                comment: ansis_1.default.gray.open,
                clear: ansis_1.default.reset.open,
            },
        });
    }
    /**
     * Pretty-print sql string to be print in the console.
     *
     * @param sql
     * @param dataSourceType
     */
    static formatSql(sql, dataSourceType) {
        const databaseLanguageMap = {
            oracle: "pl/sql",
        };
        const databaseLanguage = dataSourceType
            ? (databaseLanguageMap[dataSourceType] ?? "sql")
            : "sql";
        return (0, formatter_1.format)(sql, {
            language: databaseLanguage,
            indent: "    ",
        });
    }
    /**
     * Logging functions needed by AdvancedConsoleLogger
     *
     * @param prefix
     * @param info
     */
    static logInfo(prefix, info) {
        console.log(ansis_1.default.gray.underline(prefix), info);
    }
    static logError(prefix, error) {
        console.log(ansis_1.default.underline.red(prefix), error);
    }
    static logWarn(prefix, warning) {
        console.log(ansis_1.default.underline.yellow(prefix), warning);
    }
    static log(message) {
        console.log(ansis_1.default.underline(message));
    }
    static info(info) {
        return ansis_1.default.gray(info);
    }
    static error(error) {
        return ansis_1.default.red(error);
    }
    static warn(message) {
        return ansis_1.default.yellow(message);
    }
    static logCmdErr(prefix, err) {
        console.log(ansis_1.default.black.bgRed(prefix));
        if (err)
            console.error(err);
    }
}
exports.PlatformTools = PlatformTools;
//# sourceMappingURL=PlatformTools.js.map