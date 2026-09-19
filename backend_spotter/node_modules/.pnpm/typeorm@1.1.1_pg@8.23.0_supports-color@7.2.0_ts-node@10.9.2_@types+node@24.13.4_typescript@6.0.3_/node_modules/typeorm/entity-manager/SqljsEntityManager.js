"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqljsEntityManager = void 0;
const EntityManager_1 = require("./EntityManager");
/**
 * A special EntityManager that includes import/export and load/save function
 * that are unique to Sql.js.
 */
class SqljsEntityManager extends EntityManager_1.EntityManager {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(dataSource, queryRunner) {
        super(dataSource, queryRunner);
        this["@instanceof"] = Symbol.for("SqljsEntityManager");
        this.driver = dataSource.driver;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Loads either the definition from a file (Node.js) or localstorage (browser)
     * or uses the given definition to open a new database.
     *
     * @param fileNameOrLocalStorageOrData
     */
    async loadDatabase(fileNameOrLocalStorageOrData) {
        await this.driver.load(fileNameOrLocalStorageOrData);
    }
    /**
     * Saves the current database to a file (Node.js) or localstorage (browser)
     * if fileNameOrLocalStorage is not set options.location is used.
     *
     * @param fileNameOrLocalStorage
     */
    async saveDatabase(fileNameOrLocalStorage) {
        await this.driver.save(fileNameOrLocalStorage);
    }
    /**
     * Returns the current database definition.
     */
    exportDatabase() {
        return this.driver.export();
    }
}
exports.SqljsEntityManager = SqljsEntityManager;
//# sourceMappingURL=SqljsEntityManager.js.map