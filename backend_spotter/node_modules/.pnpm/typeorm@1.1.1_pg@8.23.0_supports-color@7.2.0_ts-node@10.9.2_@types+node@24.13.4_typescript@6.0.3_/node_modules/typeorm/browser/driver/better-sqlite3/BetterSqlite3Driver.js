"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetterSqlite3Driver = void 0;
const tslib_1 = require("tslib");
const promises_1 = tslib_1.__importDefault(require("node:fs/promises"));
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const error_1 = require("../../error");
const PlatformTools_1 = require("../../platform/PlatformTools");
const PathUtils_1 = require("../../util/PathUtils");
const AbstractSqliteDriver_1 = require("../sqlite-abstract/AbstractSqliteDriver");
const BetterSqlite3QueryRunner_1 = require("./BetterSqlite3QueryRunner");
/**
 * Organizes communication with sqlite DBMS.
 */
class BetterSqlite3Driver extends AbstractSqliteDriver_1.AbstractSqliteDriver {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(dataSource) {
        super(dataSource);
        this.database = this.options.database;
        // load sqlite package
        this.loadDependencies();
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Closes connection with database.
     */
    async disconnect() {
        this.queryRunner = undefined;
        this.databaseConnection.close();
    }
    /**
     * Creates a query runner used to execute database queries.
     *
     * @param mode
     */
    createQueryRunner(mode) {
        this.queryRunner ??= new BetterSqlite3QueryRunner_1.BetterSqlite3QueryRunner(this);
        return this.queryRunner;
    }
    normalizeType(column) {
        if (typeof column.type === "function" &&
            column.type.prototype instanceof Uint8Array) {
            return "blob";
        }
        return super.normalizeType(column);
    }
    async afterConnect() {
        return this.attachDatabases();
    }
    /**
     * For SQLite, the database may be added in the decorator metadata. It will be a filepath to a database file.
     *
     * @param tableName
     * @param _schema
     * @param database
     */
    buildTableName(tableName, _schema, database) {
        if (!database)
            return tableName;
        if (this.getAttachedDatabaseHandleByRelativePath(database))
            return `${this.getAttachedDatabaseHandleByRelativePath(database)}.${tableName}`;
        if (database === this.options.database)
            return tableName;
        // we use the decorated name as supplied when deriving attach handle (ideally without non-portable absolute path)
        const identifierHash = (0, PathUtils_1.filepathToName)(database);
        // decorated name will be assumed relative to main database file when non absolute. Paths supplied as absolute won't be portable
        const absFilepath = (0, PathUtils_1.isAbsolute)(database)
            ? database
            : node_path_1.default.join(this.getMainDatabasePath(), database);
        this.attachedDatabases[database] = {
            attachFilepathAbsolute: absFilepath,
            attachFilepathRelative: database,
            attachHandle: identifierHash,
        };
        return `${identifierHash}.${tableName}`;
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Creates connection with the database.
     */
    async createDatabaseConnection() {
        // not to create database directory if is in memory
        if (this.options.database !== ":memory:")
            await this.createDatabaseDirectory(node_path_1.default.dirname(this.options.database));
        const { database, readonly = false, fileMustExist = false, timeout = 5000, verbose = null, nativeBinding = null, prepareDatabase, } = this.options;
        const databaseConnection = new this.sqlite(database, {
            readonly,
            fileMustExist,
            timeout,
            verbose,
            nativeBinding,
        });
        // in the options, if encryption key for SQLCipher is setted.
        // Must invoke key pragma before trying to do any other interaction with the database.
        if (this.options.key) {
            databaseConnection.pragma(`key = ${JSON.stringify(this.options.key)}`);
        }
        // function to run before a database is used in typeorm.
        if (typeof prepareDatabase === "function") {
            await prepareDatabase(databaseConnection);
        }
        // we need to enable foreign keys in sqlite to make sure all foreign key related features
        // working properly. this also makes onDelete to work with sqlite.
        databaseConnection.pragma("foreign_keys = ON");
        // turn on WAL mode to enhance performance
        if (this.options.enableWAL) {
            databaseConnection.pragma("journal_mode = WAL");
        }
        return databaseConnection;
    }
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    loadDependencies() {
        try {
            const sqlite = this.options.driver ?? PlatformTools_1.PlatformTools.load("better-sqlite3");
            this.sqlite = sqlite;
        }
        catch (e) {
            throw new error_1.DriverPackageNotInstalledError("SQLite", "better-sqlite3");
        }
    }
    /**
     * Auto creates database directory if it does not exist.
     *
     * @param dbPath
     */
    async createDatabaseDirectory(dbPath) {
        await promises_1.default.mkdir(dbPath, { recursive: true });
    }
    /**
     * Performs the attaching of the database files. The attachedDatabase should have been populated during calls to #buildTableName
     * during EntityMetadata production (see EntityMetadata#buildTablePath)
     *
     * https://sqlite.org/lang_attach.html
     */
    async attachDatabases() {
        // @todo - possibly check number of databases (but unqueriable at runtime sadly) - https://www.sqlite.org/limits.html#max_attached
        for (const { attachHandle, attachFilepathAbsolute } of Object.values(this.attachedDatabases)) {
            await this.createDatabaseDirectory(node_path_1.default.dirname(attachFilepathAbsolute));
            await this.dataSource.query(`ATTACH "${attachFilepathAbsolute}" AS "${attachHandle}"`);
        }
    }
    getMainDatabasePath() {
        const optionsDb = this.options.database;
        return node_path_1.default.dirname((0, PathUtils_1.isAbsolute)(optionsDb)
            ? optionsDb
            : node_path_1.default.join(this.options.baseDirectory, optionsDb));
    }
}
exports.BetterSqlite3Driver = BetterSqlite3Driver;
//# sourceMappingURL=BetterSqlite3Driver.js.map