import type { Driver } from "./Driver";
/**
 * Common driver utility functions.
 */
export declare class DriverUtils {
    /**
     * Returns true if given driver is SQLite-based driver.
     *
     * @param driver
     */
    static isSQLiteFamily(driver: Driver): boolean;
    /**
     * Returns true if given driver is MySQL-based driver.
     *
     * @param driver
     */
    static isMySQLFamily(driver: Driver): boolean;
    static isReleaseVersionOrGreater(driver: Driver, version: string): boolean;
    static isPostgresFamily(driver: Driver): boolean;
    /**
     * Normalizes and builds a new driver options.
     * Extracts settings from connection url and sets to a new options object.
     *
     * @param options
     * @param buildOptions
     * @param buildOptions.useSid
     */
    static buildDriverOptions(options: any, buildOptions?: {
        useSid: boolean;
    }): any;
    /**
     * buildDriverOptions for MongodDB only to support replica set
     *
     * @param options
     * @param buildOptions
     * @param buildOptions.useSid
     */
    static buildMongoDBDriverOptions(options: any, buildOptions?: {
        useSid: boolean;
    }): any;
    /**
     * Joins and shortens alias if needed.
     *
     * If the alias length is greater than the limit allowed by the current
     * driver, replaces it with a shortend string, if the shortend string
     * is still too long, it will then hash the alias.
     *
     * @param driver Current `Driver`.
     * @param driver.maxAliasLength
     * @param buildOptions Optional settings.
     * @param alias Alias parts.
     * @returns An alias that is no longer than the divers max alias length.
     */
    static buildAlias({ maxAliasLength }: Driver, buildOptions: {
        shorten?: boolean;
        joiner?: string;
    } | undefined, ...alias: string[]): string;
    /**
     * Extracts connection data from the connection url.
     *
     * @param url
     */
    private static parseConnectionUrl;
    /**
     * Extracts connection data from the connection url for MongoDB to support replica set.
     *
     * @param url
     */
    private static parseMongoDBConnectionUrl;
    private static parseCredentials;
}
