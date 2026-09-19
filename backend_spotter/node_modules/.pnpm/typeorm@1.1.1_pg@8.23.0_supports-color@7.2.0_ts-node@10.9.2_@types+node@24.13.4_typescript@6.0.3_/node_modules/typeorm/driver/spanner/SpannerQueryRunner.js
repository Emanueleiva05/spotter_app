"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpannerQueryRunner = void 0;
const error_1 = require("../../error");
const NamedPlaceholdersNotSupportedError_1 = require("../../error/NamedPlaceholdersNotSupportedError");
const QueryFailedError_1 = require("../../error/QueryFailedError");
const QueryRunnerAlreadyReleasedError_1 = require("../../error/QueryRunnerAlreadyReleasedError");
const TransactionNotStartedError_1 = require("../../error/TransactionNotStartedError");
const BaseQueryRunner_1 = require("../../query-runner/BaseQueryRunner");
const QueryResult_1 = require("../../query-runner/QueryResult");
const Table_1 = require("../../schema-builder/table/Table");
const TableCheck_1 = require("../../schema-builder/table/TableCheck");
const TableColumn_1 = require("../../schema-builder/table/TableColumn");
const TableForeignKey_1 = require("../../schema-builder/table/TableForeignKey");
const TableIndex_1 = require("../../schema-builder/table/TableIndex");
const TableUnique_1 = require("../../schema-builder/table/TableUnique");
const View_1 = require("../../schema-builder/view/View");
const Broadcaster_1 = require("../../subscriber/Broadcaster");
const BroadcasterResult_1 = require("../../subscriber/BroadcasterResult");
const OrmUtils_1 = require("../../util/OrmUtils");
const Query_1 = require("../Query");
const validate_isolation_level_1 = require("../validate-isolation-level");
const MetadataTableType_1 = require("../types/MetadataTableType");
/**
 * Runs queries on a single postgres database connection.
 */
class SpannerQueryRunner extends BaseQueryRunner_1.BaseQueryRunner {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(driver, mode) {
        super();
        this.driver = driver;
        this.dataSource = driver.dataSource;
        this.mode = mode;
        this.broadcaster = new Broadcaster_1.Broadcaster(this);
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates/uses database connection from the connection pool to perform further operations.
     * Returns obtained database connection.
     */
    async connect() {
        if (this.session) {
            this.sessionTransaction ??= await this.session.transaction();
            return this.session;
        }
        const [session] = await this.driver.instanceDatabase.createSession({});
        this.session = session;
        this.sessionTransaction = await session.transaction();
        return this.session;
    }
    /**
     * Releases used database connection.
     * You cannot use query runner methods once its released.
     */
    async release() {
        this.isReleased = true;
        if (this.session) {
            await this.session.delete();
        }
        this.session = undefined;
        return Promise.resolve();
    }
    /**
     * Starts transaction.
     *
     * @param isolationLevel
     */
    async startTransaction(isolationLevel) {
        isolationLevel ??= this.dataSource.options.isolationLevel;
        (0, validate_isolation_level_1.validateIsolationLevel)(this.driver.supportedIsolationLevels, isolationLevel);
        this.isTransactionActive = true;
        try {
            await this.broadcaster.broadcast("BeforeTransactionStart");
        }
        catch (err) {
            this.isTransactionActive = false;
            throw err;
        }
        try {
            await this.connect();
            if (isolationLevel) {
                this.sessionTransaction.setReadWriteTransactionOptions({
                    isolationLevel: this.mapSpannerIsolationLevel(isolationLevel),
                });
            }
            await this.sessionTransaction.begin();
        }
        catch (err) {
            this.isTransactionActive = false;
            await this.resetSessionTransaction();
            throw err;
        }
        this.dataSource.logger.logQuery("START TRANSACTION");
        await this.broadcaster.broadcast("AfterTransactionStart");
    }
    /**
     * Commits transaction.
     * Error will be thrown if transaction was not started.
     */
    async commitTransaction() {
        if (!this.isTransactionActive || !this.sessionTransaction)
            throw new TransactionNotStartedError_1.TransactionNotStartedError();
        await this.broadcaster.broadcast("BeforeTransactionCommit");
        await this.sessionTransaction.commit();
        this.dataSource.logger.logQuery("COMMIT");
        this.isTransactionActive = false;
        // Spanner transaction options (e.g. isolation level) persist on the
        // object across commit, so replace it with a fresh one before reuse.
        // If the recreate fails, clear it and let connect() recreate lazily —
        // the commit itself already succeeded, so we must not fail the caller.
        await this.resetSessionTransaction();
        await this.broadcaster.broadcast("AfterTransactionCommit");
    }
    /**
     * Rollbacks transaction.
     * Error will be thrown if transaction was not started.
     */
    async rollbackTransaction() {
        if (!this.isTransactionActive || !this.sessionTransaction)
            throw new TransactionNotStartedError_1.TransactionNotStartedError();
        await this.broadcaster.broadcast("BeforeTransactionRollback");
        await this.sessionTransaction.rollback();
        this.dataSource.logger.logQuery("ROLLBACK");
        this.isTransactionActive = false;
        // Spanner transaction options (e.g. isolation level) persist on the
        // object across rollback, so replace it with a fresh one before reuse.
        // If the recreate fails, clear it and let connect() recreate lazily —
        // the rollback itself already succeeded, so we must not fail the caller.
        await this.resetSessionTransaction();
        await this.broadcaster.broadcast("AfterTransactionRollback");
    }
    /**
     * Replaces the cached session transaction with a fresh one so that options
     * (e.g. isolation level) do not bleed into the next transaction. Failures
     * are tolerated: the stale reference is cleared and connect() will lazily
     * create a fresh one on next use.
     */
    async resetSessionTransaction() {
        if (!this.session)
            return;
        try {
            this.sessionTransaction = await this.session.transaction();
        }
        catch {
            this.sessionTransaction = undefined;
        }
    }
    /**
     * Maps a TypeORM isolation level to the Spanner protobuf enum key.
     *
     * @param level
     * @see https://cloud.google.com/spanner/docs/reference/rpc/google.spanner.v1#google.spanner.v1.TransactionOptions.IsolationLevel
     */
    mapSpannerIsolationLevel(level) {
        switch (level) {
            case "SERIALIZABLE":
                return "SERIALIZABLE";
            case "REPEATABLE READ":
                return "REPEATABLE_READ";
            default:
                throw new error_1.TypeORMError(`Spanner driver does not support isolation level "${level}"`);
        }
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
        await this.connect();
        this.driver.dataSource.logger.logQuery(query, parameters, this);
        await this.broadcaster.broadcast("BeforeQuery", query, parameters);
        const broadcasterResult = new BroadcasterResult_1.BroadcasterResult();
        try {
            const queryStartTime = Date.now();
            let rawResult = undefined;
            const isSelect = query.startsWith("SELECT");
            const executor = isSelect && !this.isTransactionActive
                ? this.driver.instanceDatabase
                : this.sessionTransaction;
            if (!this.isTransactionActive && !isSelect) {
                const defaultIsolationLevel = this.dataSource.options.isolationLevel;
                if (defaultIsolationLevel &&
                    this.driver.supportedIsolationLevels.includes(defaultIsolationLevel)) {
                    this.sessionTransaction.setReadWriteTransactionOptions({
                        isolationLevel: this.mapSpannerIsolationLevel(defaultIsolationLevel),
                    });
                }
                await this.sessionTransaction.begin();
            }
            try {
                rawResult = await executor.run({
                    sql: query,
                    params: parameters
                        ? parameters.reduce((params, value, index) => {
                            params["param" + index] = value;
                            return params;
                        }, {})
                        : undefined,
                    json: true,
                });
                if (!this.isTransactionActive && !isSelect) {
                    await this.sessionTransaction.commit();
                    await this.resetSessionTransaction();
                }
            }
            catch (error) {
                try {
                    // we throw original error even if rollback thrown an error
                    if (!this.isTransactionActive && !isSelect) {
                        await this.sessionTransaction.rollback();
                        await this.resetSessionTransaction();
                    }
                }
                catch (rollbackError) { }
                throw error;
            }
            // log slow queries if maxQueryExecution time is set
            const maxQueryExecutionTime = this.driver.options.maxQueryExecutionTime;
            const queryEndTime = Date.now();
            const queryExecutionTime = queryEndTime - queryStartTime;
            this.broadcaster.broadcastAfterQueryEvent(broadcasterResult, query, parameters, true, queryExecutionTime, rawResult, undefined);
            if (maxQueryExecutionTime &&
                queryExecutionTime > maxQueryExecutionTime)
                this.driver.dataSource.logger.logQuerySlow(queryExecutionTime, query, parameters, this);
            const result = new QueryResult_1.QueryResult();
            result.raw = rawResult;
            result.records = rawResult ? rawResult[0] : [];
            if (rawResult?.[1]?.rowCountExact) {
                result.affected = parseInt(rawResult[1].rowCountExact);
            }
            if (!useStructuredResult) {
                return result.records;
            }
            return result;
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
     * Update database schema.
     * Used for creating/altering/dropping tables, columns, indexes, etc.
     *
     * DDL changing queries should be executed by `updateSchema()` method.
     *
     * @param query
     * @param parameters
     */
    async updateDDL(query, parameters) {
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
        this.driver.dataSource.logger.logQuery(query, parameters, this);
        try {
            const queryStartTime = Date.now();
            const [operation] = await this.driver.instanceDatabase.updateSchema(query);
            await operation.promise();
            // log slow queries if maxQueryExecution time is set
            const maxQueryExecutionTime = this.driver.options.maxQueryExecutionTime;
            const queryEndTime = Date.now();
            const queryExecutionTime = queryEndTime - queryStartTime;
            if (maxQueryExecutionTime &&
                queryExecutionTime > maxQueryExecutionTime)
                this.driver.dataSource.logger.logQuerySlow(queryExecutionTime, query, parameters, this);
        }
        catch (err) {
            this.driver.dataSource.logger.logQueryError(err, query, parameters, this);
            throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
        }
    }
    /**
     * Returns raw data stream.
     *
     * @param query
     * @param parameters
     * @param onEnd
     * @param onError
     */
    async stream(query, parameters, onEnd, onError) {
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
        try {
            this.driver.dataSource.logger.logQuery(query, parameters, this);
            const request = {
                sql: query,
                params: parameters
                    ? parameters.reduce((params, value, index) => {
                        params["param" + index] = value;
                        return params;
                    }, {})
                    : undefined,
                json: true,
            };
            const stream = this.driver.instanceDatabase.runStream(request);
            if (onEnd) {
                stream.on("end", onEnd);
            }
            if (onError) {
                stream.on("error", onError);
            }
            return stream;
        }
        catch (err) {
            this.driver.dataSource.logger.logQueryError(err, query, parameters, this);
            throw new QueryFailedError_1.QueryFailedError(query, parameters, err);
        }
    }
    /**
     * Returns all available database names including system databases.
     */
    async getDatabases() {
        return Promise.resolve([]);
    }
    /**
     * Returns all available schema names including system schemas.
     * If database parameter specified, returns schemas of that database.
     *
     * @param database
     */
    async getSchemas(database) {
        return Promise.resolve([]);
    }
    /**
     * Checks if database with the given name exist.
     *
     * @param database
     */
    async hasDatabase(database) {
        throw new error_1.TypeORMError(`Check database queries are not supported by Spanner driver.`);
    }
    /**
     * Loads currently using database
     */
    async getCurrentDatabase() {
        throw new error_1.TypeORMError(`Check database queries are not supported by Spanner driver.`);
    }
    /**
     * Checks if schema with the given name exist.
     *
     * @param schema
     */
    async hasSchema(schema) {
        const result = await this.query(`SELECT * FROM "information_schema"."schemata" WHERE "schema_name" = @param0`, [schema]);
        return result.length ? true : false;
    }
    /**
     * Loads currently using database schema
     */
    async getCurrentSchema() {
        throw new error_1.TypeORMError(`Check schema queries are not supported by Spanner driver.`);
    }
    /**
     * Checks if table with the given name exist in the database.
     *
     * @param tableOrName
     */
    async hasTable(tableOrName) {
        const tableName = tableOrName instanceof Table_1.Table ? tableOrName.name : tableOrName;
        const sql = `SELECT * FROM \`INFORMATION_SCHEMA\`.\`TABLES\` ` +
            `WHERE \`TABLE_CATALOG\` = '' AND \`TABLE_SCHEMA\` = '' AND \`TABLE_TYPE\` = 'BASE TABLE' ` +
            `AND \`TABLE_NAME\` = @param0`;
        const result = await this.query(sql, [tableName]);
        return result.length ? true : false;
    }
    /**
     * Checks if column with the given name exist in the given table.
     *
     * @param tableOrName
     * @param columnName
     */
    async hasColumn(tableOrName, columnName) {
        const tableName = tableOrName instanceof Table_1.Table ? tableOrName.name : tableOrName;
        const sql = `SELECT * FROM \`INFORMATION_SCHEMA\`.\`COLUMNS\` ` +
            `WHERE \`TABLE_CATALOG\` = '' AND \`TABLE_SCHEMA\` = '' ` +
            `AND \`TABLE_NAME\` = @param0 AND \`COLUMN_NAME\` = @param1`;
        const result = await this.query(sql, [tableName, columnName]);
        return result.length ? true : false;
    }
    /**
     * Creates a new database.
     * Note: Spanner does not support database creation inside a transaction block.
     *
     * @param database
     * @param ifNotExists
     */
    async createDatabase(database, ifNotExists) {
        if (ifNotExists) {
            const databaseAlreadyExists = await this.hasDatabase(database);
            if (databaseAlreadyExists)
                return Promise.resolve();
        }
        const escaped = this.driver.escape(database);
        const up = `CREATE DATABASE ${escaped}`;
        const down = `DROP DATABASE ${escaped}`;
        await this.executeQueries(new Query_1.Query(up), new Query_1.Query(down));
    }
    /**
     * Drops database.
     * Note: Spanner does not support database dropping inside a transaction block.
     *
     * @param database
     * @param ifExists
     */
    async dropDatabase(database, ifExists) {
        if (ifExists) {
            const databaseExists = await this.hasDatabase(database);
            if (!databaseExists)
                return;
        }
        const escaped = this.driver.escape(database);
        const up = `DROP DATABASE ${escaped}`;
        const down = `CREATE DATABASE ${escaped}`;
        await this.executeQueries(new Query_1.Query(up), new Query_1.Query(down));
    }
    /**
     * Creates a new table schema.
     *
     * @param schemaPath
     * @param ifNotExists
     */
    async createSchema(schemaPath, ifNotExists) {
        return Promise.resolve();
    }
    /**
     * Drops table schema.
     *
     * @param schemaPath
     * @param ifExists
     * @param isCascade
     */
    async dropSchema(schemaPath, ifExists, isCascade) {
        return Promise.resolve();
    }
    /**
     * Creates a new table.
     *
     * @param table
     * @param ifNotExists
     * @param createForeignKeys
     * @param createIndices
     */
    async createTable(table, ifNotExists = false, createForeignKeys = true, createIndices = true) {
        if (ifNotExists) {
            const isTableExist = await this.hasTable(table);
            if (isTableExist)
                return Promise.resolve();
        }
        const upQueries = [];
        const downQueries = [];
        upQueries.push(this.createTableSql(table, createForeignKeys));
        downQueries.push(this.dropTableSql(table));
        // if createForeignKeys is true, we must drop created foreign keys in down query.
        // createTable does not need separate method to create foreign keys, because it create fk's in the same query with table creation.
        if (createForeignKeys)
            table.foreignKeys.forEach((foreignKey) => downQueries.push(this.dropForeignKeySql(table, foreignKey)));
        if (createIndices) {
            table.indices.forEach((index) => {
                // new index may be passed without name. In this case we generate index name manually.
                index.name ??= this.dataSource.namingStrategy.indexName(table, index.columnNames, index.where);
                upQueries.push(this.createIndexSql(table, index));
                downQueries.push(this.dropIndexSql(table, index));
            });
        }
        // if table has column with generated type, we must add the expression to the metadata table
        const generatedColumns = table.columns.filter((column) => column.generatedType && column.asExpression);
        for (const column of generatedColumns) {
            const insertQuery = this.insertTypeormMetadataSql({
                table: table.name,
                type: MetadataTableType_1.MetadataTableType.GENERATED_COLUMN,
                name: column.name,
                value: column.asExpression,
            });
            const deleteQuery = this.deleteTypeormMetadataSql({
                table: table.name,
                type: MetadataTableType_1.MetadataTableType.GENERATED_COLUMN,
                name: column.name,
            });
            upQueries.push(insertQuery);
            downQueries.push(deleteQuery);
        }
        await this.executeQueries(upQueries, downQueries);
    }
    /**
     * Drops the table.
     *
     * @param target
     * @param ifExists
     * @param dropForeignKeys
     * @param dropIndices
     */
    async dropTable(target, ifExists, dropForeignKeys = true, dropIndices = true) {
        // It needs because if table does not exist and dropForeignKeys or dropIndices is true, we don't need
        // to perform drop queries for foreign keys and indices.
        if (ifExists) {
            const isTableExist = await this.hasTable(target);
            if (!isTableExist)
                return Promise.resolve();
        }
        // if dropTable called with dropForeignKeys = true, we must create foreign keys in down query.
        const createForeignKeys = dropForeignKeys;
        const tablePath = this.getTablePath(target);
        const table = await this.getCachedTable(tablePath);
        const upQueries = [];
        const downQueries = [];
        if (dropIndices) {
            table.indices.forEach((index) => {
                upQueries.push(this.dropIndexSql(table, index));
                downQueries.push(this.createIndexSql(table, index));
            });
        }
        if (dropForeignKeys)
            table.foreignKeys.forEach((foreignKey) => upQueries.push(this.dropForeignKeySql(table, foreignKey)));
        upQueries.push(this.dropTableSql(table));
        downQueries.push(this.createTableSql(table, createForeignKeys));
        // if table had columns with generated type, we must remove the expression from the metadata table
        const generatedColumns = table.columns.filter((column) => column.generatedType && column.asExpression);
        for (const column of generatedColumns) {
            const deleteQuery = this.deleteTypeormMetadataSql({
                table: table.name,
                type: MetadataTableType_1.MetadataTableType.GENERATED_COLUMN,
                name: column.name,
            });
            const insertQuery = this.insertTypeormMetadataSql({
                table: table.name,
                type: MetadataTableType_1.MetadataTableType.GENERATED_COLUMN,
                name: column.name,
                value: column.asExpression,
            });
            upQueries.push(deleteQuery);
            downQueries.push(insertQuery);
        }
        await this.executeQueries(upQueries, downQueries);
    }
    /**
     * Creates a new view.
     *
     * @param view
     */
    async createView(view) {
        const upQueries = [];
        const downQueries = [];
        upQueries.push(this.createViewSql(view));
        upQueries.push(await this.insertViewDefinitionSql(view));
        downQueries.push(this.dropViewSql(view));
        downQueries.push(await this.deleteViewDefinitionSql(view));
        await this.executeQueries(upQueries, downQueries);
    }
    /**
     * Drops the view.
     *
     * @param target
     * @param ifExists
     */
    async dropView(target, ifExists) {
        const viewName = target instanceof View_1.View ? target.name : target;
        if (ifExists) {
            const foundViews = await this.loadViews([viewName]);
            if (foundViews.length === 0)
                return;
        }
        const view = await this.getCachedView(viewName);
        const upQueries = [];
        const downQueries = [];
        upQueries.push(await this.deleteViewDefinitionSql(view));
        upQueries.push(this.dropViewSql(view));
        downQueries.push(await this.insertViewDefinitionSql(view));
        downQueries.push(this.createViewSql(view));
        await this.executeQueries(upQueries, downQueries);
    }
    /**
     * Renames the given table.
     *
     * @param oldTableOrName
     * @param newTableName
     */
    async renameTable(oldTableOrName, newTableName) {
        throw new error_1.TypeORMError(`Rename table queries are not supported by Spanner driver.`);
    }
    /**
     * Creates a new column from the column in the table.
     *
     * @param tableOrName
     * @param column
     */
    async addColumn(tableOrName, column) {
        const table = tableOrName instanceof Table_1.Table
            ? tableOrName
            : await this.getCachedTable(tableOrName);
        const clonedTable = table.clone();
        const upQueries = [];
        const downQueries = [];
        upQueries.push(new Query_1.Query(`ALTER TABLE ${this.escapePath(table)} ADD ${this.buildCreateColumnSql(column)}`));
        downQueries.push(new Query_1.Query(`ALTER TABLE ${this.escapePath(table)} DROP COLUMN ${this.driver.escape(column.name)}`));
        // create column index
        const columnIndex = clonedTable.indices.find((index) => index.columnNames.length === 1 &&
            index.columnNames[0] === column.name);
        if (columnIndex) {
            upQueries.push(this.createIndexSql(table, columnIndex));
            downQueries.push(this.dropIndexSql(table, columnIndex));
        }
        else if (column.isUnique) {
            const uniqueIndex = new TableIndex_1.TableIndex({
                name: this.dataSource.namingStrategy.indexName(table, [
                    column.name,
                ]),
                columnNames: [column.name],
                isUnique: true,
            });
            clonedTable.indices.push(uniqueIndex);
            clonedTable.uniques.push(new TableUnique_1.TableUnique({
                name: uniqueIndex.name,
                columnNames: uniqueIndex.columnNames,
            }));
            upQueries.push(this.createIndexSql(table, uniqueIndex));
            downQueries.push(this.dropIndexSql(table, uniqueIndex));
        }
        if (column.generatedType && column.asExpression) {
            const insertQuery = this.insertTypeormMetadataSql({
                table: table.name,
                type: MetadataTableType_1.MetadataTableType.GENERATED_COLUMN,
                name: column.name,
                value: column.asExpression,
            });
            const deleteQuery = this.deleteTypeormMetadataSql({
                table: table.name,
                type: MetadataTableType_1.MetadataTableType.GENERATED_COLUMN,
                name: column.name,
            });
            upQueries.push(insertQuery);
            downQueries.push(deleteQuery);
        }
        await this.executeQueries(upQueries, downQueries);
        clonedTable.addColumn(column);
        this.replaceCachedTable(table, clonedTable);
    }
    /**
     * Creates a new columns from the column in the table.
     *
     * @param tableOrName
     * @param columns
     */
    async addColumns(tableOrName, columns) {
        for (const column of columns) {
            await this.addColumn(tableOrName, column);
        }
    }
    /**
     * Renames column in the given table.
     *
     * @param tableOrName
     * @param oldTableColumnOrName
     * @param newTableColumnOrName
     */
    async renameColumn(tableOrName, oldTableColumnOrName, newTableColumnOrName) {
        const table = tableOrName instanceof Table_1.Table
            ? tableOrName
            : await this.getCachedTable(tableOrName);
        const oldColumn = oldTableColumnOrName instanceof TableColumn_1.TableColumn
            ? oldTableColumnOrName
            : table.columns.find((c) => c.name === oldTableColumnOrName);
        if (!oldColumn)
            throw new error_1.TypeORMError(`Column "${oldTableColumnOrName}" was not found in the "${table.name}" table.`);
        let newColumn;
        if (newTableColumnOrName instanceof TableColumn_1.TableColumn) {
            newColumn = newTableColumnOrName;
        }
        else {
            newColumn = oldColumn.clone();
            newColumn.name = newTableColumnOrName;
        }
        return this.changeColumn(table, oldColumn, newColumn);
    }
    /**
     * Changes a column in the table.
     *
     * @param tableOrName
     * @param oldTableColumnOrName
     * @param newColumn
     */
    async changeColumn(tableOrName, oldTableColumnOrName, newColumn) {
        const table = tableOrName instanceof Table_1.Table
            ? tableOrName
            : await this.getCachedTable(tableOrName);
        let clonedTable = table.clone();
        const upQueries = [];
        const downQueries = [];
        const oldColumn = oldTableColumnOrName instanceof TableColumn_1.TableColumn
            ? oldTableColumnOrName
            : table.columns.find((column) => column.name === oldTableColumnOrName);
        if (!oldColumn)
            throw new error_1.TypeORMError(`Column "${oldTableColumnOrName}" was not found in the "${table.name}" table.`);
        if (oldColumn.name !== newColumn.name ||
            oldColumn.type !== newColumn.type ||
            oldColumn.length !== newColumn.length ||
            oldColumn.isArray !== newColumn.isArray ||
            oldColumn.generatedType !== newColumn.generatedType ||
            oldColumn.asExpression !== newColumn.asExpression) {
            // To avoid data conversion, we just recreate column
            await this.dropColumn(table, oldColumn);
            await this.addColumn(table, newColumn);
            // update cloned table
            clonedTable = table.clone();
        }
        else {
            if (newColumn.precision !== oldColumn.precision ||
                newColumn.scale !== oldColumn.scale) {
                upQueries.push(new Query_1.Query(`ALTER TABLE ${this.escapePath(table)} ALTER COLUMN "${newColumn.name}" TYPE ${this.driver.createFullType(newColumn)}`));
                downQueries.push(new Query_1.Query(`ALTER TABLE ${this.escapePath(table)} ALTER COLUMN "${newColumn.name}" TYPE ${this.driver.createFullType(oldColumn)}`));
            }
            if (oldColumn.isNullable !== newColumn.isNullable) {
                if (newColumn.isNullable) {
                    upQueries.push(new Query_1.Query(`ALTER TABLE ${this.escapePath(table)} ALTER COLUMN "${oldColumn.name}" DROP NOT NULL`));
                    downQueries.push(new Query_1.Query(`ALTER TABLE ${this.escapePath(table)} ALTER COLUMN "${oldColumn.name}" SET NOT NULL`));
                }
                else {
                    upQueries.push(new Query_1.Query(`ALTER TABLE ${this.escapePath(table)} ALTER COLUMN "${oldColumn.name}" SET NOT NULL`));
                    downQueries.push(new Query_1.Query(`ALTER TABLE ${this.escapePath(table)} ALTER COLUMN "${oldColumn.name}" DROP NOT NULL`));
                }
            }
            if (newColumn.isUnique !== oldColumn.isUnique) {
                if (newColumn.isUnique === true) {
                    const uniqueIndex = new TableIndex_1.TableIndex({
                        name: this.dataSource.namingStrategy.indexName(table, [
                            newColumn.name,
                        ]),
                        columnNames: [newColumn.name],
                        isUnique: true,
                    });
                    clonedTable.indices.push(uniqueIndex);
                    clonedTable.uniques.push(new TableUnique_1.TableUnique({
                        name: uniqueIndex.name,
                        columnNames: uniqueIndex.columnNames,
                    }));
                    upQueries.push(this.createIndexSql(table, uniqueIndex));
                    downQueries.push(this.dropIndexSql(table, uniqueIndex));
                }
                else {
                    const uniqueIndex = clonedTable.indices.find((index) => {
                        return (index.columnNames.length === 1 &&
                            index.isUnique === true &&
                            !!index.columnNames.find((columnName) => columnName === newColumn.name));
                    });
                    clonedTable.indices.splice(clonedTable.indices.indexOf(uniqueIndex), 1);
                    const tableUnique = clonedTable.uniques.find((unique) => unique.name === uniqueIndex.name);
                    clonedTable.uniques.splice(clonedTable.uniques.indexOf(tableUnique), 1);
                    upQueries.push(this.dropIndexSql(table, uniqueIndex));
                    downQueries.push(this.createIndexSql(table, uniqueIndex));
                }
            }
        }
        await this.executeQueries(upQueries, downQueries);
        this.replaceCachedTable(table, clonedTable);
    }
    /**
     * Changes a column in the table.
     *
     * @param tableOrName
     * @param changedColumns
     */
    async changeColumns(tableOrName, changedColumns) {
        for (const { oldColumn, newColumn } of changedColumns) {
            await this.changeColumn(tableOrName, oldColumn, newColumn);
        }
    }
    /**
     * Drops column in the table.
     *
     * @param tableOrName
     * @param columnOrName
     * @param ifExists
     */
    async dropColumn(tableOrName, columnOrName, ifExists) {
        const table = tableOrName instanceof Table_1.Table
            ? tableOrName
            : await this.getCachedTable(tableOrName);
        const column = columnOrName instanceof TableColumn_1.TableColumn
            ? columnOrName
            : table.findColumnByName(columnOrName);
        if (!column) {
            if (ifExists)
                return;
            throw new error_1.TypeORMError(`Column "${columnOrName}" was not found in table "${table.name}"`);
        }
        const clonedTable = table.clone();
        const upQueries = [];
        const downQueries = [];
        // drop column index
        const columnIndex = clonedTable.indices.find((index) => index.columnNames.length === 1 &&
            index.columnNames[0] === column.name);
        if (columnIndex) {
            clonedTable.indices.splice(clonedTable.indices.indexOf(columnIndex), 1);
            upQueries.push(this.dropIndexSql(table, columnIndex));
            downQueries.push(this.createIndexSql(table, columnIndex));
        }
        // drop column check
        const columnCheck = clonedTable.checks.find((check) => !!check.columnNames &&
            check.columnNames.length === 1 &&
            check.columnNames[0] === column.name);
        if (columnCheck) {
            clonedTable.checks.splice(clonedTable.checks.indexOf(columnCheck), 1);
            upQueries.push(this.dropCheckConstraintSql(table, columnCheck));
            downQueries.push(this.createCheckConstraintSql(table, columnCheck));
        }
        upQueries.push(new Query_1.Query(`ALTER TABLE ${this.escapePath(table)} DROP COLUMN ${this.driver.escape(column.name)}`));
        downQueries.push(new Query_1.Query(`ALTER TABLE ${this.escapePath(table)} ADD ${this.buildCreateColumnSql(column)}`));
        if (column.generatedType && column.asExpression) {
            const deleteQuery = this.deleteTypeormMetadataSql({
                table: table.name,
                type: MetadataTableType_1.MetadataTableType.GENERATED_COLUMN,
                name: column.name,
            });
            const insertQuery = this.insertTypeormMetadataSql({
                table: table.name,
                type: MetadataTableType_1.MetadataTableType.GENERATED_COLUMN,
                name: column.name,
                value: column.asExpression,
            });
            upQueries.push(deleteQuery);
            downQueries.push(insertQuery);
        }
        await this.executeQueries(upQueries, downQueries);
        clonedTable.removeColumn(column);
        this.replaceCachedTable(table, clonedTable);
    }
    /**
     * Drops the columns in the table.
     *
     * @param tableOrName
     * @param columns
     * @param ifExists
     */
    async dropColumns(tableOrName, columns, ifExists) {
        for (const column of [...columns]) {
            await this.dropColumn(tableOrName, column, ifExists);
        }
    }
    /**
     * Creates a new primary key.
     *
     * Not supported in Spanner.
     *
     * @param tableOrName
     * @param columnNames
     * @see https://cloud.google.com/spanner/docs/schema-and-data-model#notes_about_key_columns
     */
    async createPrimaryKey(tableOrName, columnNames) {
        throw new Error("The keys of a table can't change; you can't add a key column to an existing table or remove a key column from an existing table.");
    }
    /**
     * Updates composite primary keys.
     *
     * @param tableOrName
     * @param columns
     */
    async updatePrimaryKeys(tableOrName, columns) {
        throw new Error("The keys of a table can't change; you can't add a key column to an existing table or remove a key column from an existing table.");
    }
    /**
     * Drops a primary key.
     *
     * Not supported in Spanner.
     *
     * @param tableOrName
     * @param constraintName
     * @param ifExists
     * @see https://cloud.google.com/spanner/docs/schema-and-data-model#notes_about_key_columns
     */
    async dropPrimaryKey(tableOrName, constraintName, ifExists) {
        throw new Error("The keys of a table can't change; you can't add a key column to an existing table or remove a key column from an existing table.");
    }
    /**
     * Creates new unique constraint.
     *
     * @param tableOrName
     * @param uniqueConstraint
     */
    async createUniqueConstraint(tableOrName, uniqueConstraint) {
        throw new error_1.TypeORMError(`Spanner does not support unique constraints. Use unique index instead.`);
    }
    /**
     * Creates new unique constraints.
     *
     * @param tableOrName
     * @param uniqueConstraints
     */
    async createUniqueConstraints(tableOrName, uniqueConstraints) {
        throw new error_1.TypeORMError(`Spanner does not support unique constraints. Use unique index instead.`);
    }
    /**
     * Drops unique constraint.
     *
     * @param tableOrName
     * @param uniqueOrName
     * @param ifExists
     */
    async dropUniqueConstraint(tableOrName, uniqueOrName, ifExists) {
        throw new error_1.TypeORMError(`Spanner does not support unique constraints. Use unique index instead.`);
    }
    /**
     * Drops unique constraints.
     *
     * @param tableOrName
     * @param uniqueConstraints
     * @param ifExists
     */
    async dropUniqueConstraints(tableOrName, uniqueConstraints, ifExists) {
        throw new error_1.TypeORMError(`Spanner does not support unique constraints. Use unique index instead.`);
    }
    /**
     * Creates a new check constraint.
     *
     * @param tableOrName
     * @param checkConstraint
     */
    async createCheckConstraint(tableOrName, checkConstraint) {
        const table = tableOrName instanceof Table_1.Table
            ? tableOrName
            : await this.getCachedTable(tableOrName);
        // new check constraint may be passed without name. In this case we generate unique name manually.
        checkConstraint.name ??=
            this.dataSource.namingStrategy.checkConstraintName(table, checkConstraint.expression);
        const up = this.createCheckConstraintSql(table, checkConstraint);
        const down = this.dropCheckConstraintSql(table, checkConstraint);
        await this.executeQueries(up, down);
        table.addCheckConstraint(checkConstraint);
    }
    /**
     * Creates new check constraints.
     *
     * @param tableOrName
     * @param checkConstraints
     */
    async createCheckConstraints(tableOrName, checkConstraints) {
        const promises = checkConstraints.map((checkConstraint) => this.createCheckConstraint(tableOrName, checkConstraint));
        await Promise.all(promises);
    }
    /**
     * Drops check constraint.
     *
     * @param tableOrName
     * @param checkOrName
     * @param ifExists
     */
    async dropCheckConstraint(tableOrName, checkOrName, ifExists) {
        const table = tableOrName instanceof Table_1.Table
            ? tableOrName
            : await this.getCachedTable(tableOrName);
        const checkConstraint = checkOrName instanceof TableCheck_1.TableCheck
            ? checkOrName
            : table.checks.find((c) => c.name === checkOrName);
        if (!checkConstraint) {
            if (ifExists)
                return;
            throw new error_1.TypeORMError(`Supplied check constraint was not found in table ${table.name}`);
        }
        const up = this.dropCheckConstraintSql(table, checkConstraint);
        const down = this.createCheckConstraintSql(table, checkConstraint);
        await this.executeQueries(up, down);
        table.removeCheckConstraint(checkConstraint);
    }
    /**
     * Drops check constraints.
     *
     * @param tableOrName
     * @param checkConstraints
     * @param ifExists
     */
    async dropCheckConstraints(tableOrName, checkConstraints, ifExists) {
        const promises = checkConstraints.map((checkConstraint) => this.dropCheckConstraint(tableOrName, checkConstraint, ifExists));
        await Promise.all(promises);
    }
    /**
     * Creates new exclusion constraint.
     *
     * @param tableOrName
     * @param exclusionConstraint
     */
    async createExclusionConstraint(tableOrName, exclusionConstraint) {
        throw new error_1.TypeORMError(`Spanner does not support exclusion constraints.`);
    }
    /**
     * Creates new exclusion constraints.
     *
     * @param tableOrName
     * @param exclusionConstraints
     */
    async createExclusionConstraints(tableOrName, exclusionConstraints) {
        throw new error_1.TypeORMError(`Spanner does not support exclusion constraints.`);
    }
    /**
     * Drops exclusion constraint.
     *
     * @param tableOrName
     * @param exclusionOrName
     * @param ifExists
     */
    async dropExclusionConstraint(tableOrName, exclusionOrName, ifExists) {
        throw new error_1.TypeORMError(`Spanner does not support exclusion constraints.`);
    }
    /**
     * Drops exclusion constraints.
     *
     * @param tableOrName
     * @param exclusionConstraints
     * @param ifExists
     */
    async dropExclusionConstraints(tableOrName, exclusionConstraints, ifExists) {
        throw new error_1.TypeORMError(`Spanner does not support exclusion constraints.`);
    }
    /**
     * Creates a new foreign key.
     *
     * @param tableOrName
     * @param foreignKey
     */
    async createForeignKey(tableOrName, foreignKey) {
        const table = tableOrName instanceof Table_1.Table
            ? tableOrName
            : await this.getCachedTable(tableOrName);
        // new FK may be passed without name. In this case we generate FK name manually.
        foreignKey.name ??= this.dataSource.namingStrategy.foreignKeyName(table, foreignKey.columnNames, this.getTablePath(foreignKey), foreignKey.referencedColumnNames);
        const up = this.createForeignKeySql(table, foreignKey);
        const down = this.dropForeignKeySql(table, foreignKey);
        await this.executeQueries(up, down);
        table.addForeignKey(foreignKey);
    }
    /**
     * Creates a new foreign keys.
     *
     * @param tableOrName
     * @param foreignKeys
     */
    async createForeignKeys(tableOrName, foreignKeys) {
        for (const foreignKey of foreignKeys) {
            await this.createForeignKey(tableOrName, foreignKey);
        }
    }
    /**
     * Drops a foreign key from the table.
     *
     * @param tableOrName
     * @param foreignKeyOrName
     * @param ifExists
     */
    async dropForeignKey(tableOrName, foreignKeyOrName, ifExists) {
        const table = tableOrName instanceof Table_1.Table
            ? tableOrName
            : await this.getCachedTable(tableOrName);
        const foreignKey = foreignKeyOrName instanceof TableForeignKey_1.TableForeignKey
            ? foreignKeyOrName
            : table.foreignKeys.find((fk) => fk.name === foreignKeyOrName);
        if (!foreignKey) {
            if (ifExists)
                return;
            throw new error_1.TypeORMError(`Supplied foreign key was not found in table ${table.name}`);
        }
        foreignKey.name ??= this.dataSource.namingStrategy.foreignKeyName(table, foreignKey.columnNames, this.getTablePath(foreignKey), foreignKey.referencedColumnNames);
        const up = this.dropForeignKeySql(table, foreignKey);
        const down = this.createForeignKeySql(table, foreignKey);
        await this.executeQueries(up, down);
        table.removeForeignKey(foreignKey);
    }
    /**
     * Drops a foreign keys from the table.
     *
     * @param tableOrName
     * @param foreignKeys
     * @param ifExists
     */
    async dropForeignKeys(tableOrName, foreignKeys, ifExists) {
        for (const foreignKey of [...foreignKeys]) {
            await this.dropForeignKey(tableOrName, foreignKey, ifExists);
        }
    }
    /**
     * Creates a new index.
     *
     * @param tableOrName
     * @param index
     */
    async createIndex(tableOrName, index) {
        const table = tableOrName instanceof Table_1.Table
            ? tableOrName
            : await this.getCachedTable(tableOrName);
        // new index may be passed without name. In this case we generate index name manually.
        index.name ??= this.generateIndexName(table, index);
        const up = this.createIndexSql(table, index);
        const down = this.dropIndexSql(table, index);
        await this.executeQueries(up, down);
        table.addIndex(index);
    }
    /**
     * Creates a new indices
     *
     * @param tableOrName
     * @param indices
     */
    async createIndices(tableOrName, indices) {
        for (const index of indices) {
            await this.createIndex(tableOrName, index);
        }
    }
    /**
     * Drops an index from the table.
     *
     * @param tableOrName
     * @param indexOrName
     * @param ifExists
     */
    async dropIndex(tableOrName, indexOrName, ifExists) {
        const table = tableOrName instanceof Table_1.Table
            ? tableOrName
            : await this.getCachedTable(tableOrName);
        const index = indexOrName instanceof TableIndex_1.TableIndex
            ? indexOrName
            : table.indices.find((i) => i.name === indexOrName);
        if (!index) {
            if (ifExists)
                return;
            throw new error_1.TypeORMError(`Supplied index ${indexOrName} was not found in table ${table.name}`);
        }
        // new index may be passed without name. In this case we generate index name manually.
        index.name ??= this.generateIndexName(table, index);
        const up = this.dropIndexSql(table, index);
        const down = this.createIndexSql(table, index);
        await this.executeQueries(up, down);
        table.removeIndex(index);
    }
    /**
     * Drops an indices from the table.
     *
     * @param tableOrName
     * @param indices
     * @param ifExists
     */
    async dropIndices(tableOrName, indices, ifExists) {
        for (const index of [...indices]) {
            await this.dropIndex(tableOrName, index, ifExists);
        }
    }
    /**
     * Clears all table contents.
     * Spanner does not support TRUNCATE TABLE statement, so we use DELETE FROM.
     *
     * @param tableName
     * @param options
     * @param options.cascade
     */
    async clearTable(tableName, options) {
        if (options?.cascade) {
            throw new error_1.TypeORMError(`Spanner does not support clearing table with cascade option`);
        }
        await this.query(`DELETE FROM ${this.escapePath(tableName)} WHERE true`);
    }
    /**
     * Removes all tables from the currently connected database.
     */
    async clearDatabase() {
        // drop index queries
        const selectIndexDropsQuery = `SELECT concat('DROP INDEX \`', INDEX_NAME, '\`') AS \`query\` ` +
            `FROM \`INFORMATION_SCHEMA\`.\`INDEXES\` ` +
            `WHERE \`TABLE_CATALOG\` = '' AND \`TABLE_SCHEMA\` = '' AND \`INDEX_TYPE\` = 'INDEX' AND \`SPANNER_IS_MANAGED\` = false`;
        const dropIndexQueries = await this.query(selectIndexDropsQuery);
        // drop foreign key queries
        const selectFKDropsQuery = `SELECT concat('ALTER TABLE \`', TABLE_NAME, '\`', ' DROP CONSTRAINT \`', CONSTRAINT_NAME, '\`') AS \`query\` ` +
            `FROM \`INFORMATION_SCHEMA\`.\`TABLE_CONSTRAINTS\` ` +
            `WHERE \`TABLE_CATALOG\` = '' AND \`TABLE_SCHEMA\` = '' AND \`CONSTRAINT_TYPE\` = 'FOREIGN KEY'`;
        const dropFKQueries = await this.query(selectFKDropsQuery);
        // drop view queries
        // const selectViewDropsQuery = `SELECT concat('DROP VIEW \`', TABLE_NAME, '\`') AS \`query\` FROM \`INFORMATION_SCHEMA\`.\`VIEWS\``
        // const dropViewQueries: ObjectLiteral[] = await this.query(
        //     selectViewDropsQuery,
        // )
        // drop table queries
        const dropTablesQuery = `SELECT concat('DROP TABLE \`', TABLE_NAME, '\`') AS \`query\` ` +
            `FROM \`INFORMATION_SCHEMA\`.\`TABLES\` ` +
            `WHERE \`TABLE_CATALOG\` = '' AND \`TABLE_SCHEMA\` = '' AND \`TABLE_TYPE\` = 'BASE TABLE'`;
        const dropTableQueries = await this.query(dropTablesQuery);
        if (!dropIndexQueries.length &&
            !dropFKQueries.length &&
            // !dropViewQueries.length &&
            !dropTableQueries.length)
            return;
        const isAnotherTransactionActive = this.isTransactionActive;
        if (!isAnotherTransactionActive)
            await this.startTransaction();
        try {
            for (const query of dropIndexQueries) {
                await this.updateDDL(query["query"]);
            }
            for (const query of dropFKQueries) {
                await this.updateDDL(query["query"]);
            }
            // for (let query of dropViewQueries) {
            //     await this.updateDDL(query["query"])
            // }
            for (const query of dropTableQueries) {
                await this.updateDDL(query["query"]);
            }
            await this.commitTransaction();
        }
        catch (error) {
            try {
                // we throw original error even if rollback thrown an error
                if (!isAnotherTransactionActive)
                    await this.rollbackTransaction();
            }
            catch (rollbackError) { }
            throw error;
        }
    }
    // -------------------------------------------------------------------------
    // Override Methods
    // -------------------------------------------------------------------------
    /**
     * Executes up sql queries.
     */
    async executeMemoryUpSql() {
        for (const { query, parameters } of this.sqlInMemory.upQueries) {
            if (this.isDMLQuery(query)) {
                await this.query(query, parameters);
            }
            else {
                await this.updateDDL(query, parameters);
            }
        }
    }
    /**
     * Executes down sql queries.
     */
    async executeMemoryDownSql() {
        for (const { query, parameters, } of this.sqlInMemory.downQueries.reverse()) {
            if (this.isDMLQuery(query)) {
                await this.query(query, parameters);
            }
            else {
                await this.updateDDL(query, parameters);
            }
        }
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    async loadViews(viewNames) {
        // const hasTable = await this.hasTable(this.getTypeormMetadataTableName())
        // if (!hasTable) {
        //     return []
        // }
        //
        // if (!viewNames) {
        //     viewNames = []
        // }
        //
        // const escapedViewNames = viewNames
        //     .map((viewName) => `'${viewName}'`)
        //     .join(", ")
        //
        // const query =
        //     `SELECT \`T\`.*, \`V\`.\`VIEW_DEFINITION\` FROM ${this.escapePath(
        //         this.getTypeormMetadataTableName(),
        //     )} \`T\` ` +
        //     `INNER JOIN \`INFORMATION_SCHEMA\`.\`VIEWS\` \`V\` ON \`V\`.\`TABLE_NAME\` = \`T\`.\`NAME\` ` +
        //     `WHERE \`T\`.\`TYPE\` = '${MetadataTableType.VIEW}' ${
        //         viewNames.length
        //             ? ` AND \`T\`.\`NAME\` IN (${escapedViewNames})`
        //             : ""
        //     }`
        // const dbViews = await this.query(query)
        // return dbViews.map((dbView: any) => {
        //     const view = new View()
        //     view.database = dbView["NAME"]
        //     view.name = this.driver.buildTableName(dbView["NAME"])
        //     view.expression = dbView["NAME"]
        //     return view
        // })
        return Promise.resolve([]);
    }
    /**
     * Loads all tables (with given names) from the database and creates a Table from them.
     *
     * @param tableNames
     */
    async loadTables(tableNames) {
        if (tableNames?.length === 0) {
            return [];
        }
        const dbTables = [];
        if (tableNames?.length) {
            const placeholders = tableNames
                .map((_, i) => `@param${i}`)
                .join(", ");
            const tablesSql = `SELECT \`TABLE_NAME\` ` +
                `FROM \`INFORMATION_SCHEMA\`.\`TABLES\` ` +
                `WHERE \`TABLE_CATALOG\` = '' AND \`TABLE_SCHEMA\` = '' AND \`TABLE_TYPE\` = 'BASE TABLE' ` +
                `AND \`TABLE_NAME\` IN (${placeholders})`;
            dbTables.push(...(await this.query(tablesSql, tableNames)));
        }
        else {
            // Since we don't have any of this data we have to do a scan
            const tablesSql = `SELECT \`TABLE_NAME\` ` +
                `FROM \`INFORMATION_SCHEMA\`.\`TABLES\` ` +
                `WHERE \`TABLE_CATALOG\` = '' AND \`TABLE_SCHEMA\` = '' AND \`TABLE_TYPE\` = 'BASE TABLE'`;
            dbTables.push(...(await this.query(tablesSql)));
        }
        // if tables were not found in the db, no need to proceed
        if (!dbTables.length)
            return [];
        const loadedTableNames = dbTables
            .map((dbTable) => `'${dbTable.TABLE_NAME}'`)
            .join(", ");
        const columnsSql = `SELECT * FROM \`INFORMATION_SCHEMA\`.\`COLUMNS\` WHERE \`TABLE_CATALOG\` = '' AND \`TABLE_SCHEMA\` = '' AND \`TABLE_NAME\` IN (${loadedTableNames})`;
        const primaryKeySql = `SELECT \`KCU\`.\`TABLE_NAME\`, \`KCU\`.\`COLUMN_NAME\` ` +
            `FROM \`INFORMATION_SCHEMA\`.\`TABLE_CONSTRAINTS\` \`TC\` ` +
            `INNER JOIN \`INFORMATION_SCHEMA\`.\`KEY_COLUMN_USAGE\` \`KCU\` ON \`KCU\`.\`CONSTRAINT_NAME\` = \`TC\`.\`CONSTRAINT_NAME\` ` +
            `WHERE \`TC\`.\`TABLE_CATALOG\` = '' AND \`TC\`.\`TABLE_SCHEMA\` = '' AND \`TC\`.\`CONSTRAINT_TYPE\` = 'PRIMARY KEY' ` +
            `AND \`TC\`.\`TABLE_NAME\` IN (${loadedTableNames})`;
        const indicesSql = `SELECT \`I\`.\`TABLE_NAME\`, \`I\`.\`INDEX_NAME\`, \`I\`.\`IS_UNIQUE\`, \`I\`.\`IS_NULL_FILTERED\`, \`IC\`.\`COLUMN_NAME\` ` +
            `FROM \`INFORMATION_SCHEMA\`.\`INDEXES\` \`I\` ` +
            `INNER JOIN \`INFORMATION_SCHEMA\`.\`INDEX_COLUMNS\` \`IC\` ON \`IC\`.\`INDEX_NAME\` = \`I\`.\`INDEX_NAME\` ` +
            `AND \`IC\`.\`TABLE_NAME\` = \`I\`.\`TABLE_NAME\` ` +
            `WHERE \`I\`.\`TABLE_CATALOG\` = '' AND \`I\`.\`TABLE_SCHEMA\` = '' AND \`I\`.\`TABLE_NAME\` IN (${loadedTableNames}) ` +
            `AND \`I\`.\`INDEX_TYPE\` = 'INDEX' AND \`I\`.\`SPANNER_IS_MANAGED\` = false`;
        const checksSql = `SELECT \`TC\`.\`TABLE_NAME\`, \`TC\`.\`CONSTRAINT_NAME\`, \`CC\`.\`CHECK_CLAUSE\`, \`CCU\`.\`COLUMN_NAME\`` +
            `FROM \`INFORMATION_SCHEMA\`.\`TABLE_CONSTRAINTS\` \`TC\` ` +
            `INNER JOIN \`INFORMATION_SCHEMA\`.\`CONSTRAINT_COLUMN_USAGE\` \`CCU\` ON \`CCU\`.\`CONSTRAINT_NAME\` = \`TC\`.\`CONSTRAINT_NAME\` ` +
            `INNER JOIN \`INFORMATION_SCHEMA\`.\`CHECK_CONSTRAINTS\` \`CC\` ON \`CC\`.\`CONSTRAINT_NAME\` = \`TC\`.\`CONSTRAINT_NAME\` ` +
            `WHERE \`TC\`.\`TABLE_CATALOG\` = '' AND \`TC\`.\`TABLE_SCHEMA\` = '' AND \`TC\`.\`CONSTRAINT_TYPE\` = 'CHECK' ` +
            `AND \`TC\`.\`TABLE_NAME\` IN (${loadedTableNames}) AND \`TC\`.\`CONSTRAINT_NAME\` NOT LIKE 'CK_IS_NOT_NULL%'`;
        const foreignKeysSql = `SELECT \`TC\`.\`TABLE_NAME\`, \`TC\`.\`CONSTRAINT_NAME\`, \`KCU\`.\`COLUMN_NAME\`, ` +
            `\`CTU\`.\`TABLE_NAME\` AS \`REFERENCED_TABLE_NAME\`, \`CCU\`.\`COLUMN_NAME\` AS \`REFERENCED_COLUMN_NAME\`, ` +
            `\`RC\`.\`UPDATE_RULE\`, \`RC\`.\`DELETE_RULE\` ` +
            `FROM \`INFORMATION_SCHEMA\`.\`TABLE_CONSTRAINTS\` \`TC\` ` +
            `INNER JOIN \`INFORMATION_SCHEMA\`.\`KEY_COLUMN_USAGE\` \`KCU\` ON \`KCU\`.\`CONSTRAINT_NAME\` = \`TC\`.\`CONSTRAINT_NAME\` ` +
            `INNER JOIN \`INFORMATION_SCHEMA\`.\`CONSTRAINT_TABLE_USAGE\` \`CTU\` ON \`CTU\`.\`CONSTRAINT_NAME\` = \`TC\`.\`CONSTRAINT_NAME\` ` +
            `INNER JOIN \`INFORMATION_SCHEMA\`.\`REFERENTIAL_CONSTRAINTS\` \`RC\` ON \`RC\`.\`CONSTRAINT_NAME\` = \`TC\`.\`CONSTRAINT_NAME\` ` +
            `INNER JOIN \`INFORMATION_SCHEMA\`.\`CONSTRAINT_COLUMN_USAGE\` \`CCU\` ON \`CCU\`.\`CONSTRAINT_NAME\` = \`TC\`.\`CONSTRAINT_NAME\` ` +
            `WHERE \`TC\`.\`TABLE_CATALOG\` = '' AND \`TC\`.\`TABLE_SCHEMA\` = '' AND \`TC\`.\`CONSTRAINT_TYPE\` = 'FOREIGN KEY' ` +
            `AND \`TC\`.\`TABLE_NAME\` IN (${loadedTableNames})`;
        const [dbColumns, dbPrimaryKeys, dbIndices, dbChecks, dbForeignKeys,] = await Promise.all([
            this.query(columnsSql),
            this.query(primaryKeySql),
            this.query(indicesSql),
            this.query(checksSql),
            this.query(foreignKeysSql),
        ]);
        // create tables for loaded tables
        return Promise.all(dbTables.map(async (dbTable) => {
            const table = new Table_1.Table();
            table.name = this.driver.buildTableName(dbTable["TABLE_NAME"]);
            // create columns from the loaded columns
            table.columns = await Promise.all(dbColumns
                .filter((dbColumn) => dbColumn["TABLE_NAME"] ===
                dbTable["TABLE_NAME"])
                .map(async (dbColumn) => {
                const columnUniqueIndices = dbIndices.filter((dbIndex) => {
                    return (dbIndex["TABLE_NAME"] ===
                        dbTable["TABLE_NAME"] &&
                        dbIndex["COLUMN_NAME"] ===
                            dbColumn["COLUMN_NAME"] &&
                        dbIndex["IS_UNIQUE"] === true);
                });
                const tableMetadata = this.dataSource.entityMetadatas.find((metadata) => this.getTablePath(table) ===
                    this.getTablePath(metadata));
                const hasIgnoredIndex = columnUniqueIndices.length > 0 &&
                    tableMetadata?.indices.some((index) => {
                        return columnUniqueIndices.some((uniqueIndex) => {
                            return (index.name ===
                                uniqueIndex["INDEX_NAME"] &&
                                index.synchronize === false);
                        });
                    });
                const isConstraintComposite = columnUniqueIndices.every((uniqueIndex) => {
                    return dbIndices.some((dbIndex) => dbIndex["INDEX_NAME"] ===
                        uniqueIndex["INDEX_NAME"] &&
                        dbIndex["COLUMN_NAME"] !==
                            dbColumn["COLUMN_NAME"]);
                });
                const tableColumn = new TableColumn_1.TableColumn();
                tableColumn.name = dbColumn["COLUMN_NAME"];
                let fullType = dbColumn["SPANNER_TYPE"].toLowerCase();
                if (fullType.indexOf("array") !== -1) {
                    tableColumn.isArray = true;
                    fullType = fullType.slice(fullType.indexOf("<") + 1, fullType.indexOf(">"));
                }
                if (fullType.indexOf("(") !== -1) {
                    tableColumn.type = fullType.slice(0, fullType.indexOf("("));
                }
                else {
                    tableColumn.type = fullType;
                }
                if (this.driver.withLengthColumnTypes.indexOf(tableColumn.type) !== -1) {
                    tableColumn.length = fullType.slice(fullType.indexOf("(") + 1, fullType.indexOf(")"));
                }
                if (dbColumn["IS_GENERATED"] === "ALWAYS") {
                    tableColumn.asExpression =
                        dbColumn["GENERATION_EXPRESSION"];
                    tableColumn.generatedType = "STORED";
                    // We cannot relay on information_schema.columns.generation_expression, because it is formatted different.
                    const asExpressionQuery = this.selectTypeormMetadataSql({
                        table: dbTable["TABLE_NAME"],
                        type: MetadataTableType_1.MetadataTableType.GENERATED_COLUMN,
                        name: tableColumn.name,
                    });
                    const results = await this.query(asExpressionQuery.query, asExpressionQuery.parameters);
                    if (results[0]?.value) {
                        tableColumn.asExpression = results[0].value;
                    }
                    else {
                        tableColumn.asExpression = "";
                    }
                }
                tableColumn.isUnique =
                    columnUniqueIndices.length > 0 &&
                        !hasIgnoredIndex &&
                        !isConstraintComposite;
                tableColumn.isNullable =
                    dbColumn["IS_NULLABLE"] === "YES";
                tableColumn.isPrimary = dbPrimaryKeys.some((dbPrimaryKey) => {
                    return (dbPrimaryKey["TABLE_NAME"] ===
                        dbColumn["TABLE_NAME"] &&
                        dbPrimaryKey["COLUMN_NAME"] ===
                            dbColumn["COLUMN_NAME"]);
                });
                return tableColumn;
            }));
            const tableForeignKeys = dbForeignKeys.filter((dbForeignKey) => {
                return (dbForeignKey["TABLE_NAME"] === dbTable["TABLE_NAME"]);
            });
            table.foreignKeys = OrmUtils_1.OrmUtils.uniq(tableForeignKeys, (dbForeignKey) => dbForeignKey["CONSTRAINT_NAME"]).map((dbForeignKey) => {
                const foreignKeys = tableForeignKeys.filter((dbFk) => dbFk["CONSTRAINT_NAME"] ===
                    dbForeignKey["CONSTRAINT_NAME"]);
                return new TableForeignKey_1.TableForeignKey({
                    name: dbForeignKey["CONSTRAINT_NAME"],
                    columnNames: OrmUtils_1.OrmUtils.uniq(foreignKeys.map((dbFk) => dbFk["COLUMN_NAME"])),
                    referencedDatabase: dbForeignKey["REFERENCED_TABLE_SCHEMA"],
                    referencedTableName: dbForeignKey["REFERENCED_TABLE_NAME"],
                    referencedColumnNames: OrmUtils_1.OrmUtils.uniq(foreignKeys.map((dbFk) => dbFk["REFERENCED_COLUMN_NAME"])),
                    onDelete: dbForeignKey["DELETE_RULE"],
                    onUpdate: dbForeignKey["UPDATE_RULE"],
                });
            });
            const tableIndices = dbIndices.filter((dbIndex) => dbIndex["TABLE_NAME"] === dbTable["TABLE_NAME"]);
            table.indices = OrmUtils_1.OrmUtils.uniq(tableIndices, (dbIndex) => dbIndex["INDEX_NAME"]).map((constraint) => {
                const indices = tableIndices.filter((index) => {
                    return index["INDEX_NAME"] === constraint["INDEX_NAME"];
                });
                return new TableIndex_1.TableIndex({
                    table: table,
                    name: constraint["INDEX_NAME"],
                    columnNames: indices.map((i) => i["COLUMN_NAME"]),
                    isUnique: constraint["IS_UNIQUE"],
                    isNullFiltered: constraint["IS_NULL_FILTERED"],
                });
            });
            const tableChecks = dbChecks.filter((dbCheck) => dbCheck["TABLE_NAME"] === dbTable["TABLE_NAME"]);
            table.checks = OrmUtils_1.OrmUtils.uniq(tableChecks, (dbIndex) => dbIndex["CONSTRAINT_NAME"]).map((constraint) => {
                const checks = tableChecks.filter((dbC) => dbC["CONSTRAINT_NAME"] ===
                    constraint["CONSTRAINT_NAME"]);
                return new TableCheck_1.TableCheck({
                    name: constraint["CONSTRAINT_NAME"],
                    columnNames: checks.map((c) => c["COLUMN_NAME"]),
                    expression: constraint["CHECK_CLAUSE"],
                });
            });
            return table;
        }));
    }
    /**
     * Builds create table sql.
     *
     * @param table
     * @param createForeignKeys
     */
    createTableSql(table, createForeignKeys) {
        const columnDefinitions = table.columns
            .map((column) => this.buildCreateColumnSql(column))
            .join(", ");
        let sql = `CREATE TABLE ${this.escapePath(table)} (${columnDefinitions}`;
        // we create unique indexes instead of unique constraints, because Spanner does not have unique constraints.
        // if we mark column as Unique, it means that we create UNIQUE INDEX.
        table.columns
            .filter((column) => column.isUnique)
            .forEach((column) => {
            const isUniqueIndexExist = table.indices.some((index) => {
                return (index.columnNames.length === 1 &&
                    !!index.isUnique &&
                    index.columnNames.indexOf(column.name) !== -1);
            });
            const isUniqueConstraintExist = table.uniques.some((unique) => {
                return (unique.columnNames.length === 1 &&
                    unique.columnNames.indexOf(column.name) !== -1);
            });
            if (!isUniqueIndexExist && !isUniqueConstraintExist)
                table.indices.push(new TableIndex_1.TableIndex({
                    name: this.dataSource.namingStrategy.uniqueConstraintName(table, [column.name]),
                    columnNames: [column.name],
                    isUnique: true,
                }));
        });
        // as Spanner does not have unique constraints, we must create table indices from table uniques and mark them as unique.
        if (table.uniques.length > 0) {
            table.uniques.forEach((unique) => {
                const uniqueExist = table.indices.some((index) => index.name === unique.name);
                if (!uniqueExist) {
                    table.indices.push(new TableIndex_1.TableIndex({
                        name: unique.name,
                        columnNames: unique.columnNames,
                        isUnique: true,
                    }));
                }
            });
        }
        if (table.checks.length > 0) {
            const checksSql = table.checks
                .map((check) => {
                const checkName = check.name ??
                    this.dataSource.namingStrategy.checkConstraintName(table, check.expression);
                return `CONSTRAINT \`${checkName}\` CHECK (${check.expression})`;
            })
                .join(", ");
            sql += `, ${checksSql}`;
        }
        if (table.foreignKeys.length > 0 && createForeignKeys) {
            const foreignKeysSql = table.foreignKeys
                .map((fk) => {
                const columnNames = fk.columnNames
                    .map((columnName) => `\`${columnName}\``)
                    .join(", ");
                fk.name ??= this.dataSource.namingStrategy.foreignKeyName(table, fk.columnNames, this.getTablePath(fk), fk.referencedColumnNames);
                const referencedColumnNames = fk.referencedColumnNames
                    .map((columnName) => `\`${columnName}\``)
                    .join(", ");
                return `CONSTRAINT \`${fk.name}\` FOREIGN KEY (${columnNames}) REFERENCES ${this.escapePath(this.getTablePath(fk))} (${referencedColumnNames})`;
            })
                .join(", ");
            sql += `, ${foreignKeysSql}`;
        }
        sql += `)`;
        const primaryColumns = table.columns.filter((column) => column.isPrimary);
        if (primaryColumns.length > 0) {
            const columnNames = primaryColumns
                .map((column) => this.driver.escape(column.name))
                .join(", ");
            sql += ` PRIMARY KEY (${columnNames})`;
        }
        return new Query_1.Query(sql);
    }
    /**
     * Builds drop table sql.
     *
     * @param tableOrPath
     */
    dropTableSql(tableOrPath) {
        return new Query_1.Query(`DROP TABLE ${this.escapePath(tableOrPath)}`);
    }
    createViewSql(view) {
        const materializedClause = view.materialized ? "MATERIALIZED " : "";
        const viewName = this.escapePath(view);
        const expression = typeof view.expression === "string"
            ? view.expression
            : view.expression(this.dataSource).getQuery();
        return new Query_1.Query(`CREATE ${materializedClause}VIEW ${viewName} SQL SECURITY INVOKER AS ${expression}`);
    }
    async insertViewDefinitionSql(view) {
        const { schema, tableName: name } = this.driver.parseTableName(view);
        const type = view.materialized
            ? MetadataTableType_1.MetadataTableType.MATERIALIZED_VIEW
            : MetadataTableType_1.MetadataTableType.VIEW;
        const expression = typeof view.expression === "string"
            ? view.expression.trim()
            : view.expression(this.dataSource).getQuery();
        return this.insertTypeormMetadataSql({
            type,
            schema,
            name,
            value: expression,
        });
    }
    /**
     * Builds drop view sql.
     *
     * @param view
     */
    dropViewSql(view) {
        const materializedClause = view.materialized ? "MATERIALIZED " : "";
        return new Query_1.Query(`DROP ${materializedClause}VIEW ${this.escapePath(view)}`);
    }
    /**
     * Builds remove view sql.
     *
     * @param view
     */
    async deleteViewDefinitionSql(view) {
        const { schema, tableName: name } = this.driver.parseTableName(view);
        const type = view.materialized
            ? MetadataTableType_1.MetadataTableType.MATERIALIZED_VIEW
            : MetadataTableType_1.MetadataTableType.VIEW;
        return this.deleteTypeormMetadataSql({ type, schema, name });
    }
    /**
     * Builds create index sql.
     *
     * @param table
     * @param index
     */
    createIndexSql(table, index) {
        const columns = index.columnNames
            .map((columnName) => this.driver.escape(columnName))
            .join(", ");
        let indexType = "";
        if (index.isUnique)
            indexType += "UNIQUE ";
        if (index.isNullFiltered)
            indexType += "NULL_FILTERED ";
        return new Query_1.Query(`CREATE ${indexType}INDEX \`${index.name}\` ON ${this.escapePath(table)} (${columns})`);
    }
    /**
     * Builds drop index sql.
     *
     * @param table
     * @param indexOrName
     */
    dropIndexSql(table, indexOrName) {
        const indexName = indexOrName instanceof TableIndex_1.TableIndex ? indexOrName.name : indexOrName;
        return new Query_1.Query(`DROP INDEX \`${indexName}\``);
    }
    /**
     * Builds create check constraint sql.
     *
     * @param table
     * @param checkConstraint
     */
    createCheckConstraintSql(table, checkConstraint) {
        return new Query_1.Query(`ALTER TABLE ${this.escapePath(table)} ADD CONSTRAINT \`${checkConstraint.name}\` CHECK (${checkConstraint.expression})`);
    }
    /**
     * Builds drop check constraint sql.
     *
     * @param table
     * @param checkOrName
     */
    dropCheckConstraintSql(table, checkOrName) {
        const checkName = checkOrName instanceof TableCheck_1.TableCheck ? checkOrName.name : checkOrName;
        return new Query_1.Query(`ALTER TABLE ${this.escapePath(table)} DROP CONSTRAINT \`${checkName}\``);
    }
    /**
     * Builds create foreign key sql.
     *
     * @param table
     * @param foreignKey
     */
    createForeignKeySql(table, foreignKey) {
        const columnNames = foreignKey.columnNames
            .map((column) => this.driver.escape(column))
            .join(", ");
        const referencedColumnNames = foreignKey.referencedColumnNames
            .map((column) => this.driver.escape(column))
            .join(",");
        const sql = `ALTER TABLE ${this.escapePath(table)} ADD CONSTRAINT \`${foreignKey.name}\` FOREIGN KEY (${columnNames}) ` +
            `REFERENCES ${this.escapePath(this.getTablePath(foreignKey))} (${referencedColumnNames})`;
        return new Query_1.Query(sql);
    }
    /**
     * Builds drop foreign key sql.
     *
     * @param table
     * @param foreignKeyOrName
     */
    dropForeignKeySql(table, foreignKeyOrName) {
        const foreignKeyName = foreignKeyOrName instanceof TableForeignKey_1.TableForeignKey
            ? foreignKeyOrName.name
            : foreignKeyOrName;
        return new Query_1.Query(`ALTER TABLE ${this.escapePath(table)} DROP CONSTRAINT \`${foreignKeyName}\``);
    }
    /**
     * Escapes given table or view path.
     *
     * @param target
     */
    escapePath(target) {
        const { tableName } = this.driver.parseTableName(target);
        return `\`${tableName}\``;
    }
    /**
     * Builds a part of query to create/change a column.
     *
     * @param column
     */
    buildCreateColumnSql(column) {
        let c = `${this.driver.escape(column.name)} ${this.dataSource.driver.createFullType(column)}`;
        // Spanner supports only STORED generated column type
        if (column.generatedType === "STORED" && column.asExpression) {
            c += ` AS (${column.asExpression}) STORED`;
        }
        else {
            if (!column.isNullable)
                c += " NOT NULL";
        }
        return c;
    }
    /**
     * Executes sql used special for schema build.
     *
     * @param upQueries
     * @param downQueries
     */
    async executeQueries(upQueries, downQueries) {
        if (upQueries instanceof Query_1.Query)
            upQueries = [upQueries];
        if (downQueries instanceof Query_1.Query)
            downQueries = [downQueries];
        this.sqlInMemory.upQueries.push(...upQueries);
        this.sqlInMemory.downQueries.push(...downQueries);
        // if sql-in-memory mode is enabled then simply store sql in memory and return
        if (this.sqlMemoryMode === true)
            return Promise.resolve();
        for (const { query, parameters } of upQueries) {
            if (this.isDMLQuery(query)) {
                await this.query(query, parameters);
            }
            else {
                await this.updateDDL(query, parameters);
            }
        }
    }
    isDMLQuery(query) {
        return (query.startsWith("INSERT") ||
            query.startsWith("UPDATE") ||
            query.startsWith("DELETE"));
    }
    /**
     * Change table comment.
     *
     * @param tableOrName
     * @param comment
     */
    changeTableComment(tableOrName, comment) {
        throw new error_1.TypeORMError(`spanner driver does not support change table comment.`);
    }
}
exports.SpannerQueryRunner = SpannerQueryRunner;
//# sourceMappingURL=SpannerQueryRunner.js.map