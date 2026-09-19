"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapacitorQueryRunner = void 0;
const QueryFailedError_1 = require("../../error/QueryFailedError");
const QueryRunnerAlreadyReleasedError_1 = require("../../error/QueryRunnerAlreadyReleasedError");
const QueryResult_1 = require("../../query-runner/QueryResult");
const Broadcaster_1 = require("../../subscriber/Broadcaster");
const AbstractSqliteQueryRunner_1 = require("../sqlite-abstract/AbstractSqliteQueryRunner");
const NamedPlaceholdersNotSupportedError_1 = require("../../error/NamedPlaceholdersNotSupportedError");
/**
 * Runs queries on a single sqlite database connection.
 */
class CapacitorQueryRunner extends AbstractSqliteQueryRunner_1.AbstractSqliteQueryRunner {
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
    async executeSet(set) {
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
        const databaseConnection = await this.connect();
        return databaseConnection.executeSet(set, false);
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
            throw new NamedPlaceholdersNotSupportedError_1.NamedPlaceholdersNotSupportedError();
        const databaseConnection = await this.connect();
        this.driver.dataSource.logger.logQuery(query, parameters, this);
        const spaceIndex = query.indexOf(" ");
        const command = spaceIndex === -1 ? query : query.slice(0, spaceIndex);
        try {
            let raw;
            if ([
                "BEGIN",
                "ROLLBACK",
                "COMMIT",
                "CREATE",
                "ALTER",
                "DROP",
            ].indexOf(command) !== -1) {
                raw = await databaseConnection.execute(query, false);
            }
            else if (["INSERT", "UPDATE", "DELETE"].indexOf(command) !== -1) {
                raw = await databaseConnection.run(query, parameters, false);
            }
            else {
                raw = await databaseConnection.query(query, parameters ?? []);
            }
            const result = new QueryResult_1.QueryResult();
            if (raw?.hasOwnProperty("values")) {
                result.raw = raw.values;
                result.records = raw.values;
            }
            if (raw?.hasOwnProperty("changes")) {
                result.affected = raw.changes.changes;
                result.raw = raw.changes.lastId ?? raw.changes.changes;
            }
            if (!useStructuredResult) {
                return result.raw;
            }
            return result;
        }
        catch (err) {
            this.driver.dataSource.logger.logQueryError(err, query, parameters, this);
            throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
        }
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Parametrizes given object of values. Used to create column=value queries.
     *
     * @param objectLiteral
     */
    parametrize(objectLiteral) {
        return Object.keys(objectLiteral).map((key) => `"${key}"` + "=?");
    }
}
exports.CapacitorQueryRunner = CapacitorQueryRunner;
//# sourceMappingURL=CapacitorQueryRunner.js.map