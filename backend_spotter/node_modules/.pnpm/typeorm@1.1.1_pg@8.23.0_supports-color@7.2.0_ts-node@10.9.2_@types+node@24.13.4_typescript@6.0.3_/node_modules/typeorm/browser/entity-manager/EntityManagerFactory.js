"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManagerFactory = void 0;
const EntityManager_1 = require("./EntityManager");
const MongoEntityManager_1 = require("./MongoEntityManager");
const SqljsEntityManager_1 = require("./SqljsEntityManager");
/**
 * Helps to create entity managers.
 */
class EntityManagerFactory {
    /**
     * Creates a new entity manager depend on a given connection's driver.
     *
     * @param dataSource
     * @param queryRunner
     * @returns an EntityManager specialized for the driver
     */
    create(dataSource, queryRunner) {
        if (dataSource.driver.options.type === "mongodb")
            return new MongoEntityManager_1.MongoEntityManager(dataSource);
        if (dataSource.driver.options.type === "sqljs")
            return new SqljsEntityManager_1.SqljsEntityManager(dataSource, queryRunner);
        return new EntityManager_1.EntityManager(dataSource, queryRunner);
    }
}
exports.EntityManagerFactory = EntityManagerFactory;
//# sourceMappingURL=EntityManagerFactory.js.map