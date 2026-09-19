"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpoQueryRunner = void 0;
const error_1 = require("../../error");
const QueryFailedError_1 = require("../../error/QueryFailedError");
const QueryRunnerAlreadyReleasedError_1 = require("../../error/QueryRunnerAlreadyReleasedError");
const QueryResult_1 = require("../../query-runner/QueryResult");
const Broadcaster_1 = require("../../subscriber/Broadcaster");
const BroadcasterResult_1 = require("../../subscriber/BroadcasterResult");
const AbstractSqliteQueryRunner_1 = require("../sqlite-abstract/AbstractSqliteQueryRunner");
class ExpoQueryRunner extends AbstractSqliteQueryRunner_1.AbstractSqliteQueryRunner {
    constructor(driver) {
        super();
        this.driver = driver;
        this.dataSource = driver.dataSource;
        this.broadcaster = new Broadcaster_1.Broadcaster(this);
    }
    async beforeMigration() {
        await this.query("PRAGMA foreign_keys = OFF");
    }
    async afterMigration() {
        await this.query("PRAGMA foreign_keys = ON");
    }
    async query(query, parameters, useStructuredResult = false) {
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
        if (parameters && !Array.isArray(parameters))
            throw new error_1.NamedPlaceholdersNotSupportedError();
        const databaseConnection = await this.connect();
        const broadcasterResult = new BroadcasterResult_1.BroadcasterResult();
        this.driver.dataSource.logger.logQuery(query, parameters, this);
        await this.broadcaster.broadcast("BeforeQuery", query, parameters);
        const queryStartTime = Date.now();
        const statement = await databaseConnection.prepareAsync(query);
        try {
            const rawResult = await statement.executeAsync(parameters);
            const maxQueryExecutionTime = this.driver.options.maxQueryExecutionTime;
            const queryEndTime = Date.now();
            const queryExecutionTime = queryEndTime - queryStartTime;
            this.broadcaster.broadcastAfterQueryEvent(broadcasterResult, query, parameters, true, queryExecutionTime, rawResult, undefined);
            await broadcasterResult.wait();
            if (maxQueryExecutionTime &&
                queryExecutionTime > maxQueryExecutionTime) {
                this.driver.dataSource.logger.logQuerySlow(queryExecutionTime, query, parameters, this);
            }
            const result = new QueryResult_1.QueryResult();
            result.affected = rawResult.changes;
            result.records = await rawResult.getAllAsync();
            result.raw = query.startsWith("INSERT INTO")
                ? rawResult.lastInsertRowId
                : result.records;
            return useStructuredResult ? result : result.raw;
        }
        catch (err) {
            this.driver.dataSource.logger.logQueryError(err, query, parameters, this);
            this.broadcaster.broadcastAfterQueryEvent(broadcasterResult, query, parameters, false, 0, undefined, err);
            await broadcasterResult.wait();
            throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
        }
        finally {
            await broadcasterResult.wait();
            await statement.finalizeAsync();
        }
    }
}
exports.ExpoQueryRunner = ExpoQueryRunner;
//# sourceMappingURL=ExpoQueryRunner.js.map