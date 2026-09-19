"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionOptionsReader = void 0;
const error_1 = require("../error");
const PlatformTools_1 = require("../platform/PlatformTools");
const ImportUtils_1 = require("../util/ImportUtils");
const PathUtils_1 = require("../util/PathUtils");
/**
 * Reads connection options from the ormconfig.
 */
class ConnectionOptionsReader {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(options) {
        this.options = options;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Returns all connection options read from the ormconfig.
     */
    async get() {
        const options = await this.load();
        if (!options)
            throw new error_1.TypeORMError(`No connection options were found in any orm configuration files.`);
        return options;
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Loads all connection options from a configuration file.
     *
     * todo: get in count NODE_ENV somehow
     */
    async load() {
        let connectionOptions = undefined;
        const fileFormats = ["js", "mjs", "cjs", "ts", "mts", "cts", "json"];
        // Detect if baseFilePath contains file extension
        const possibleExtension = PlatformTools_1.PlatformTools.pathExtname(this.baseFilePath);
        const fileExtension = fileFormats.find((extension) => `.${extension}` === possibleExtension);
        // try to find any of following configuration formats
        const foundFileFormat = fileExtension ??
            fileFormats.find((format) => {
                return PlatformTools_1.PlatformTools.fileExist(this.baseFilePath + "." + format);
            });
        // Determine config file name
        const configFile = fileExtension
            ? this.baseFilePath
            : this.baseFilePath + "." + foundFileFormat;
        // try to find connection options from any of available sources of configuration
        if (foundFileFormat === "js" ||
            foundFileFormat === "mjs" ||
            foundFileFormat === "cjs" ||
            foundFileFormat === "ts" ||
            foundFileFormat === "mts" ||
            foundFileFormat === "cts") {
            try {
                const [importOrRequireResult, moduleSystem] = await (0, ImportUtils_1.importOrRequireFile)(configFile);
                const configModule = await importOrRequireResult;
                if (moduleSystem === "esm" ||
                    (configModule &&
                        "__esModule" in configModule &&
                        "default" in configModule)) {
                    connectionOptions = configModule.default;
                }
                else {
                    connectionOptions = configModule;
                }
            }
            catch (err) {
                PlatformTools_1.PlatformTools.logWarn(`Warning: Could not load ormconfig file at ${configFile}`, err instanceof Error ? err.message : String(err));
            }
        }
        else if (foundFileFormat === "json") {
            try {
                connectionOptions = require(configFile);
            }
            catch (err) {
                PlatformTools_1.PlatformTools.logWarn(`Warning: Could not load ormconfig file at ${configFile}`, err instanceof Error ? err.message : String(err));
            }
        }
        // normalize and return connection options
        if (connectionOptions) {
            return this.normalizeConnectionOptions(connectionOptions);
        }
        return undefined;
    }
    /**
     * Normalize connection options.
     *
     * @param connectionOptions
     */
    normalizeConnectionOptions(connectionOptions) {
        if (!Array.isArray(connectionOptions))
            connectionOptions = [connectionOptions];
        connectionOptions.forEach((options) => {
            options.baseDirectory = this.baseDirectory;
            if (options.entities) {
                const entities = options.entities.map((entity) => {
                    if (typeof entity === "string" && !entity.startsWith("/")) {
                        return this.baseDirectory + "/" + entity;
                    }
                    return entity;
                });
                Object.assign(connectionOptions, { entities: entities });
            }
            if (options.subscribers) {
                const subscribers = options.subscribers.map((subscriber) => {
                    if (typeof subscriber === "string" &&
                        !subscriber.startsWith("/")) {
                        return this.baseDirectory + "/" + subscriber;
                    }
                    return subscriber;
                });
                Object.assign(connectionOptions, { subscribers: subscribers });
            }
            if (options.migrations) {
                const migrations = options.migrations.map((migration) => {
                    if (typeof migration === "string" &&
                        !migration.startsWith("/")) {
                        return this.baseDirectory + "/" + migration;
                    }
                    return migration;
                });
                Object.assign(connectionOptions, { migrations: migrations });
            }
            // make database path file in sqlite relative to package.json
            if (options.type === "better-sqlite3") {
                if (typeof options.database === "string" &&
                    !(0, PathUtils_1.isAbsolute)(options.database) &&
                    !options.database.startsWith("/") && // unix absolute
                    options.database.slice(1, 3) !== ":\\" && // windows absolute
                    options.database !== ":memory:") {
                    Object.assign(options, {
                        database: this.baseDirectory + "/" + options.database,
                    });
                }
            }
        });
        return connectionOptions;
    }
    /**
     * Gets directory where configuration file should be located and configuration file name.
     */
    get baseFilePath() {
        return PlatformTools_1.PlatformTools.pathResolve(this.baseDirectory, this.baseConfigName);
    }
    /**
     * Gets directory where configuration file should be located.
     */
    get baseDirectory() {
        return this.options?.root ?? process.cwd();
    }
    /**
     * Gets configuration file name.
     */
    get baseConfigName() {
        return this.options?.configName ?? "ormconfig";
    }
}
exports.ConnectionOptionsReader = ConnectionOptionsReader;
//# sourceMappingURL=ConnectionOptionsReader.js.map