"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CordovaQueryRunner = void 0;
const error_1 = require("../../error");
const QueryFailedError_1 = require("../../error/QueryFailedError");
const QueryRunnerAlreadyReleasedError_1 = require("../../error/QueryRunnerAlreadyReleasedError");
const QueryResult_1 = require("../../query-runner/QueryResult");
const Broadcaster_1 = require("../../subscriber/Broadcaster");
const BroadcasterResult_1 = require("../../subscriber/BroadcasterResult");
const AbstractSqliteQueryRunner_1 = require("../sqlite-abstract/AbstractSqliteQueryRunner");
/**
 * Runs queries on a single sqlite database connection.
 */
class CordovaQueryRunner extends AbstractSqliteQueryRunner_1.AbstractSqliteQueryRunner {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(driver) {
        super();
        this.driver = driver;
        this.dataSource = driver.dataSource;
        this.broadcaster = new Broadcaster_1.Broadcaster(this);
    }
    /**
     * Called before migrations are run.
     */
    async beforeMigration() {
        await this.query(`PRAGMA foreign_keys = OFF`);
    }
    /**
     * Called after migrations are run.
     */
    async afterMigration() {
        await this.query(`PRAGMA foreign_keys = ON`);
    }
    /**
     * Executes a given SQL query.
     *
     * @param query
     * @param parameters
     * @param useStructuredResult
     */
    async query(query, parameters, useStructuredResult = false) {
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
        if (parameters && !Array.isArray(parameters))
            throw new error_1.NamedPlaceholdersNotSupportedError();
        const databaseConnection = await this.connect();
        this.driver.dataSource.logger.logQuery(query, parameters, this);
        await this.broadcaster.broadcast("BeforeQuery", query, parameters);
        const broadcasterResult = new BroadcasterResult_1.BroadcasterResult();
        const queryStartTime = Date.now();
        try {
            const raw = await new Promise((ok, fail) => {
                databaseConnection.executeSql(query, parameters, (raw) => ok(raw), (err) => fail(err));
            });
            // log slow queries if maxQueryExecution time is set
            const maxQueryExecutionTime = this.driver.options.maxQueryExecutionTime;
            const queryEndTime = Date.now();
            const queryExecutionTime = queryEndTime - queryStartTime;
            this.broadcaster.broadcastAfterQueryEvent(broadcasterResult, query, parameters, true, queryExecutionTime, raw, undefined);
            if (maxQueryExecutionTime &&
                queryExecutionTime > maxQueryExecutionTime) {
                this.driver.dataSource.logger.logQuerySlow(queryExecutionTime, query, parameters, this);
            }
            const result = new QueryResult_1.QueryResult();
            if (query.startsWith("INSERT INTO")) {
                result.raw = raw.insertId;
            }
            else {
                const resultSet = [];
                for (let i = 0; i < raw.rows.length; i++) {
                    resultSet.push(raw.rows.item(i));
                }
                result.records = resultSet;
                result.raw = resultSet;
                result.affected = raw.rowsAffected;
            }
            if (useStructuredResult) {
                return result;
            }
            else {
                return result.raw;
            }
        }
        catch (err) {
            this.driver.dataSource.logger.logQueryError(err, query, parameters, this);
            this.broadcaster.broadcastAfterQueryEvent(broadcasterResult, query, parameters, false, undefined, undefined, err);
            throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
        }
        finally {
            await broadcasterResult.wait();
        }
    }
    /**
     * Would start a transaction but this driver does not support transactions.
     */
    async startTransaction() {
        throw new error_1.TypeORMError("Transactions are not supported by the Cordova driver");
    }
    /**
     * Would start a transaction but this driver does not support transactions.
     */
    async commitTransaction() {
        throw new error_1.TypeORMError("Transactions are not supported by the Cordova driver");
    }
    /**
     * Would start a transaction but this driver does not support transactions.
     */
    async rollbackTransaction() {
        throw new error_1.TypeORMError("Transactions are not supported by the Cordova driver");
    }
    /**
     * Removes all tables from the currently connected database.
     * Be careful with using this method and avoid using it in production or migrations
     * (because it can clear all your database).
     */
    async clearDatabase() {
        await this.query(`PRAGMA foreign_keys = OFF`);
        try {
            const selectViewDropsQuery = `SELECT 'DROP VIEW "' || name || '";' as query FROM "sqlite_master" WHERE "type" = 'view'`;
            const dropViewQueries = await this.query(selectViewDropsQuery);
            const selectTableDropsQuery = `SELECT 'DROP TABLE "' || name || '";' as query FROM "sqlite_master" WHERE "type" = 'table' AND "name" != 'sqlite_sequence'`;
            const dropTableQueries = await this.query(selectTableDropsQuery);
            await Promise.all(dropViewQueries.map((q) => this.query(q["query"])));
            await Promise.all(dropTableQueries.map((q) => this.query(q["query"])));
        }
        finally {
            await this.query(`PRAGMA foreign_keys = ON`);
        }
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Parametrizes given object of values. Used to create column=value queries.
     *
     * @param objectLiteral
     * @param startIndex
     */
    parametrize(objectLiteral, startIndex = 0) {
        return Object.keys(objectLiteral).map((key, index) => `"${key}"` + "=?");
    }
}
exports.CordovaQueryRunner = CordovaQueryRunner;
//# sourceMappingURL=CordovaQueryRunner.js.map