import { type DatabaseType } from "../driver/types/DatabaseType";
export { EventEmitter } from "events";
export { ReadStream } from "fs";
export { Readable, Writable } from "stream";
/**
 * Platform-specific tools.
 */
export declare class PlatformTools {
    /**
     * Type of the currently running platform.
     */
    static type: "browser" | "node";
    /**
     * @returns the platform-specific global variable
     */
    static getGlobalVariable(): any;
    /**
     * Loads ("require"-s) given file or package.
     * This operation is only supported on the NodeJS platform
     *
     * @param name name of the module to be imported
     * @returns the module
     */
    static load(name: string): any;
    /**
     * Returns a SHA-1 hex digest for internal IDs/aliases (not for cryptographic security)
     *
     * @param input string to encode
     * @returns the SHA-1 digest of the input string
     */
    static sha1(input: string): string;
    /**
     * Normalizes given path. Does "path.normalize" and replaces backslashes with forward slashes on Windows.
     *
     * @param pathStr
     */
    static pathNormalize(pathStr: string): string;
    /**
     * Gets file extension. Does "path.extname".
     *
     * @param pathStr
     */
    static pathExtname(pathStr: string): string;
    /**
     * Resolved given path. Does "path.resolve".
     *
     * @param paths
     */
    static pathResolve(...paths: string[]): string;
    /**
     * Synchronously checks if file exist. Does "fs.existsSync".
     *
     * @param pathStr
     */
    static fileExist(pathStr: string): boolean;
    static readFileSync(filename: string): Uint8Array;
    static appendFileSync(filename: string, data: any): void;
    static writeFile(path: string, data: any): Promise<void>;
    /**
     * Highlights sql string to be printed in the console.
     *
     * @param sql
     */
    static highlightSql(sql: string): string;
    /**
     * Pretty-print sql string to be print in the console.
     *
     * @param sql
     * @param dataSourceType
     */
    static formatSql(sql: string, dataSourceType?: DatabaseType): string;
    /**
     * Logging functions needed by AdvancedConsoleLogger
     *
     * @param prefix
     * @param info
     */
    static logInfo(prefix: string, info: any): void;
    static logError(prefix: string, error: any): void;
    static logWarn(prefix: string, warning: any): void;
    static log(message: string): void;
    static info(info: any): string;
    static error(error: any): string;
    static warn(message: string): string;
    static logCmdErr(prefix: string, err?: any): void;
}
