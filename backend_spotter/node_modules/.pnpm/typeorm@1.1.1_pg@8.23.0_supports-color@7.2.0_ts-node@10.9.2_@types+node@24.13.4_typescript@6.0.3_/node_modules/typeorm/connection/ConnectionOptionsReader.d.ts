import type { DataSourceOptions } from "../data-source/DataSourceOptions";
/**
 * Reads connection options from the ormconfig.
 */
export declare class ConnectionOptionsReader {
    protected options?: {
        /**
         * Directory from where the `ormconfig` file should be read.
         * Default: `process.cwd()`.
         */
        root?: string;
        /**
         * Filename of the ormconfig configuration. By default its equal to "ormconfig".
         */
        configName?: string;
    } | undefined;
    constructor(options?: {
        /**
         * Directory from where the `ormconfig` file should be read.
         * Default: `process.cwd()`.
         */
        root?: string;
        /**
         * Filename of the ormconfig configuration. By default its equal to "ormconfig".
         */
        configName?: string;
    } | undefined);
    /**
     * Returns all connection options read from the ormconfig.
     */
    get(): Promise<DataSourceOptions[]>;
    /**
     * Loads all connection options from a configuration file.
     *
     * todo: get in count NODE_ENV somehow
     */
    protected load(): Promise<DataSourceOptions[] | undefined>;
    /**
     * Normalize connection options.
     *
     * @param connectionOptions
     */
    protected normalizeConnectionOptions(connectionOptions: DataSourceOptions | DataSourceOptions[]): DataSourceOptions[];
    /**
     * Gets directory where configuration file should be located and configuration file name.
     */
    protected get baseFilePath(): string;
    /**
     * Gets directory where configuration file should be located.
     */
    protected get baseDirectory(): string;
    /**
     * Gets configuration file name.
     */
    protected get baseConfigName(): string;
}
