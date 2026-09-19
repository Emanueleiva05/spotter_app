"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoQueryRunner = void 0;
const error_1 = require("../../error");
const Broadcaster_1 = require("../../subscriber/Broadcaster");
/**
 * Runs queries on a single MongoDB connection.
 */
class MongoQueryRunner {
    /**
     * DataSource used by the driver.
     *
     * @deprecated since 1.0.0. Use {@link dataSource} instance instead.
     */
    get connection() {
        return this.dataSource;
    }
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(dataSource, databaseConnection) {
        /**
         * Indicates if connection for this query runner is released.
         * Once its released, query runner cannot run queries anymore.
         * Always false for mongodb since mongodb has a single query executor instance.
         */
        this.isReleased = false;
        /**
         * Indicates if transaction is active in this query executor.
         * Always false for mongodb since mongodb does not support transactions.
         */
        this.isTransactionActive = false;
        /**
         * Stores temporarily user data.
         * Useful for sharing data with subscribers.
         */
        this.data = {};
        this.dataSource = dataSource;
        this.databaseConnection = databaseConnection;
        this.broadcaster = new Broadcaster_1.Broadcaster(this);
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Called before migrations are run.
     */
    async beforeMigration() {
        // Do nothing
    }
    /**
     * Called after migrations are run.
     */
    async afterMigration() {
        // Do nothing
    }
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     *
     * @param collectionName
     * @param filter
     */
    cursor(collectionName, filter) {
        return this.getCollection(collectionName).find(filter || {});
    }
    /**
     * Execute an aggregation framework pipeline against the collection.
     *
     * @param collectionName
     * @param pipeline
     * @param options
     */
    aggregate(collectionName, pipeline, options) {
        return this.getCollection(collectionName).aggregate(pipeline, options ?? {});
    }
    /**
     * Perform a bulkWrite operation without a fluent API.
     *
     * @param collectionName
     * @param operations
     * @param options
     */
    async bulkWrite(collectionName, operations, options) {
        return await this.getCollection(collectionName).bulkWrite(operations, options ?? {});
    }
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param collectionName
     * @param filter
     * @param options
     */
    async count(collectionName, filter, options) {
        return this.getCollection(collectionName).count(filter || {}, options ?? {});
    }
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param collectionName
     * @param filter
     * @param options
     */
    async countDocuments(collectionName, filter, options) {
        return this.getCollection(collectionName).countDocuments(filter || {}, options ?? {});
    }
    /**
     * Creates an index on the db and collection.
     *
     * @param collectionName
     * @param indexSpec
     * @param options
     */
    async createCollectionIndex(collectionName, indexSpec, options) {
        return this.getCollection(collectionName).createIndex(indexSpec, options ?? {});
    }
    /**
     * Creates multiple indexes in the collection.
     * Index specifications are defined at http://docs.mongodb.org/manual/reference/command/createIndexes/.
     *
     * @param collectionName
     * @param indexSpecs
     */
    async createCollectionIndexes(collectionName, indexSpecs) {
        return this.getCollection(collectionName).createIndexes(indexSpecs);
    }
    /**
     * Delete multiple documents on MongoDB.
     *
     * @param collectionName
     * @param filter
     * @param options
     */
    async deleteMany(collectionName, filter, options) {
        return this.getCollection(collectionName).deleteMany(filter, options || {});
    }
    /**
     * Delete a document on MongoDB.
     *
     * @param collectionName
     * @param filter
     * @param options
     */
    async deleteOne(collectionName, filter, options) {
        return this.getCollection(collectionName).deleteOne(filter, options ?? {});
    }
    /**
     * The distinct command returns returns a list of distinct values for the given key across a collection.
     *
     * @param collectionName
     * @param key
     * @param filter
     * @param options
     */
    async distinct(collectionName, key, filter, options) {
        return this.getCollection(collectionName).distinct(key, filter, options ?? {});
    }
    /**
     * Drops an index from this collection.
     *
     * @param collectionName
     * @param indexName
     * @param options
     */
    async dropCollectionIndex(collectionName, indexName, options) {
        return this.getCollection(collectionName).dropIndex(indexName, options ?? {});
    }
    /**
     * Drops all indexes from the collection.
     *
     * @param collectionName
     */
    async dropCollectionIndexes(collectionName) {
        return this.getCollection(collectionName).dropIndexes();
    }
    /**
     * Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param collectionName
     * @param filter
     * @param options
     */
    async findOneAndDelete(collectionName, filter, options) {
        return this.getCollection(collectionName).findOneAndDelete(filter, options ?? {});
    }
    /**
     * Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param collectionName
     * @param filter
     * @param replacement
     * @param options
     */
    async findOneAndReplace(collectionName, filter, replacement, options) {
        return this.getCollection(collectionName).findOneAndReplace(filter, replacement, options ?? {});
    }
    /**
     * Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param collectionName
     * @param filter
     * @param update
     * @param options
     */
    async findOneAndUpdate(collectionName, filter, update, options) {
        return this.getCollection(collectionName).findOneAndUpdate(filter, update, options ?? {});
    }
    /**
     * Retrieve all the indexes on the collection.
     *
     * @param collectionName
     */
    async collectionIndexes(collectionName) {
        return this.getCollection(collectionName).indexes();
    }
    /**
     * Retrieve all the indexes on the collection.
     *
     * @param collectionName
     * @param indexes
     */
    async collectionIndexExists(collectionName, indexes) {
        return this.getCollection(collectionName).indexExists(indexes);
    }
    /**
     * Retrieves this collections index info.
     *
     * @param collectionName
     * @param options
     */
    async collectionIndexInformation(collectionName, options) {
        return this.getCollection(collectionName).indexInformation(options ?? {});
    }
    /**
     * Initiate an In order bulk write operation, operations will be serially executed in the order they are added, creating a new operation for each switch in types.
     *
     * @param collectionName
     * @param options
     */
    initializeOrderedBulkOp(collectionName, options) {
        return this.getCollection(collectionName).initializeOrderedBulkOp(options);
    }
    /**
     * Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.
     *
     * @param collectionName
     * @param options
     */
    initializeUnorderedBulkOp(collectionName, options) {
        return this.getCollection(collectionName).initializeUnorderedBulkOp(options);
    }
    /**
     * Inserts an array of documents into MongoDB.
     *
     * @param collectionName
     * @param docs
     * @param options
     */
    async insertMany(collectionName, docs, options) {
        return this.getCollection(collectionName).insertMany(docs, options ?? {});
    }
    /**
     * Inserts a single document into MongoDB.
     *
     * @param collectionName
     * @param doc
     * @param options
     */
    async insertOne(collectionName, doc, options) {
        return this.getCollection(collectionName).insertOne(doc, options ?? {});
    }
    /**
     * Returns if the collection is a capped collection.
     *
     * @param collectionName
     */
    async isCapped(collectionName) {
        return this.getCollection(collectionName).isCapped();
    }
    /**
     * Get the list of all indexes information for the collection.
     *
     * @param collectionName
     * @param options
     */
    listCollectionIndexes(collectionName, options) {
        return this.getCollection(collectionName).listIndexes(options);
    }
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     *
     * @param collectionName
     * @param newName
     * @param options
     */
    async rename(collectionName, newName, options) {
        return this.getCollection(collectionName).rename(newName, options ?? {});
    }
    /**
     * Replace a document on MongoDB.
     *
     * @param collectionName
     * @param filter
     * @param replacement
     * @param options
     */
    async replaceOne(collectionName, filter, replacement, options) {
        return this.getCollection(collectionName).replaceOne(filter, replacement, options ?? {});
    }
    /**
     * Watching new changes as stream.
     *
     * @param collectionName
     * @param pipeline
     * @param options
     */
    watch(collectionName, pipeline, options) {
        return this.getCollection(collectionName).watch(pipeline, options);
    }
    /**
     * Update multiple documents on MongoDB.
     *
     * @param collectionName
     * @param filter
     * @param update
     * @param options
     */
    async updateMany(collectionName, filter, update, options) {
        return this.getCollection(collectionName).updateMany(filter, update, options ?? {});
    }
    /**
     * Update a single document on MongoDB.
     *
     * @param collectionName
     * @param filter
     * @param update
     * @param options
     */
    async updateOne(collectionName, filter, update, options) {
        return await this.getCollection(collectionName).updateOne(filter, update, options ?? {});
    }
    // -------------------------------------------------------------------------
    // Public Implemented Methods (from QueryRunner)
    // -------------------------------------------------------------------------
    /**
     * Removes all collections from the currently connected database.
     * Be careful with using this method and avoid using it in production or migrations
     * (because it can clear all your database).
     */
    async clearDatabase() {
        await this.databaseConnection
            .db(this.dataSource.driver.database)
            .dropDatabase();
    }
    /**
     * For MongoDB database we don't create a connection because its single connection already created by a driver.
     */
    async connect() { }
    /**
     * For MongoDB database we don't release the connection because it is a single connection.
     */
    async release() {
        // the mongodb driver does not support releasing connection, so simply don't do anything here
    }
    async [Symbol.asyncDispose]() {
        // there's no clean-up necessary, so simply don't do anything here
    }
    /**
     * Starts transaction.
     */
    async startTransaction() {
        // transactions are not supported by mongodb driver, so simply don't do anything here
    }
    /**
     * Commits transaction.
     */
    async commitTransaction() {
        // transactions are not supported by mongodb driver, so simply don't do anything here
    }
    /**
     * Rollbacks transaction.
     */
    async rollbackTransaction() {
        // transactions are not supported by mongodb driver, so simply don't do anything here
    }
    /**
     * Executes a given SQL query.
     *
     * @param query
     * @param parameters
     */
    query(query, parameters) {
        throw new error_1.TypeORMError(`Executing SQL query is not supported by MongoDB driver.`);
    }
    /**
     * Unsupported - Executing SQL query is not supported by MongoDB driver.
     *
     * @param strings
     * @param values
     */
    async sql(strings, ...values) {
        throw new error_1.TypeORMError(`Executing SQL query is not supported by MongoDB driver.`);
    }
    /**
     * Returns raw data stream.
     *
     * @param query
     * @param parameters
     * @param onEnd
     * @param onError
     */
    stream(query, parameters, onEnd, onError) {
        throw new error_1.TypeORMError(`Stream is not supported by MongoDB driver. Use watch instead.`);
    }
    /**
     * Returns all available database names including system databases.
     */
    async getDatabases() {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Returns all available schema names including system schemas.
     * If database parameter specified, returns schemas of that database.
     *
     * @param database
     */
    async getSchemas(database) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Loads given table's data from the database.
     *
     * @param collectionName
     */
    async getTable(collectionName) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Loads all tables (with given names) from the database and creates a Table from them.
     *
     * @param collectionNames
     */
    async getTables(collectionNames) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Loads given views's data from the database.
     *
     * @param collectionName
     */
    async getView(collectionName) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Loads all views (with given names) from the database and creates a Table from them.
     *
     * @param collectionNames
     */
    async getViews(collectionNames) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    getReplicationMode() {
        return "master";
    }
    /**
     * Checks if database with the given name exist.
     *
     * @param database
     */
    async hasDatabase(database) {
        throw new error_1.TypeORMError(`Check database queries are not supported by MongoDB driver.`);
    }
    /**
     * Loads currently using database
     */
    async getCurrentDatabase() {
        throw new error_1.TypeORMError(`Check database queries are not supported by MongoDB driver.`);
    }
    /**
     * Checks if schema with the given name exist.
     *
     * @param schema
     */
    async hasSchema(schema) {
        throw new error_1.TypeORMError(`Check schema queries are not supported by MongoDB driver.`);
    }
    /**
     * Loads currently using database schema
     */
    async getCurrentSchema() {
        throw new error_1.TypeORMError(`Check schema queries are not supported by MongoDB driver.`);
    }
    /**
     * Checks if table with the given name exist in the database.
     *
     * @param collectionName
     */
    async hasTable(collectionName) {
        throw new error_1.TypeORMError(`Check schema queries are not supported by MongoDB driver.`);
    }
    /**
     * Checks if column with the given name exist in the given table.
     *
     * @param tableOrName
     * @param columnName
     */
    async hasColumn(tableOrName, columnName) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a database if it's not created.
     *
     * @param database
     */
    async createDatabase(database) {
        throw new error_1.TypeORMError(`Database create queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops database.
     *
     * @param database
     * @param ifExists
     */
    async dropDatabase(database, ifExists) {
        throw new error_1.TypeORMError(`Database drop queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new table schema.
     *
     * @param schemaPath
     * @param ifNotExists
     */
    async createSchema(schemaPath, ifNotExists) {
        throw new error_1.TypeORMError(`Schema create queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops table schema.
     *
     * @param schemaPath
     * @param ifExists
     */
    async dropSchema(schemaPath, ifExists) {
        throw new error_1.TypeORMError(`Schema drop queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new table from the given table and columns inside it.
     *
     * @param table
     */
    async createTable(table) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops the table.
     *
     * @param tableName
     */
    async dropTable(tableName) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new view.
     *
     * @param view
     */
    async createView(view) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops the view.
     *
     * @param target
     * @param ifExists
     */
    async dropView(target, ifExists) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Renames the given table.
     *
     * @param oldTableOrName
     * @param newTableOrName
     */
    async renameTable(oldTableOrName, newTableOrName) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new column from the column in the table.
     *
     * @param tableOrName
     * @param column
     */
    async addColumn(tableOrName, column) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new columns from the column in the table.
     *
     * @param tableOrName
     * @param columns
     */
    async addColumns(tableOrName, columns) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Renames column in the given table.
     *
     * @param tableOrName
     * @param oldTableColumnOrName
     * @param newTableColumnOrName
     */
    async renameColumn(tableOrName, oldTableColumnOrName, newTableColumnOrName) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Changes a column in the table.
     *
     * @param tableOrName
     * @param oldTableColumnOrName
     * @param newColumn
     */
    async changeColumn(tableOrName, oldTableColumnOrName, newColumn) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Changes a column in the table.
     *
     * @param tableOrName
     * @param changedColumns
     */
    async changeColumns(tableOrName, changedColumns) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops column in the table.
     *
     * @param tableOrName
     * @param columnOrName
     * @param ifExists
     */
    async dropColumn(tableOrName, columnOrName, ifExists) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops the columns in the table.
     *
     * @param tableOrName
     * @param columns
     * @param ifExists
     */
    async dropColumns(tableOrName, columns, ifExists) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new primary key.
     *
     * @param tableOrName
     * @param columnNames
     */
    async createPrimaryKey(tableOrName, columnNames) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Updates composite primary keys.
     *
     * @param tableOrName
     * @param columns
     */
    async updatePrimaryKeys(tableOrName, columns) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops a primary key.
     *
     * @param tableOrName
     * @param constraintName
     * @param ifExists
     */
    async dropPrimaryKey(tableOrName, constraintName, ifExists) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new unique constraint.
     *
     * @param tableOrName
     * @param uniqueConstraint
     */
    async createUniqueConstraint(tableOrName, uniqueConstraint) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new unique constraints.
     *
     * @param tableOrName
     * @param uniqueConstraints
     */
    async createUniqueConstraints(tableOrName, uniqueConstraints) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops a unique constraint.
     *
     * @param tableOrName
     * @param uniqueOrName
     * @param ifExists
     */
    async dropUniqueConstraint(tableOrName, uniqueOrName, ifExists) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops unique constraints.
     *
     * @param tableOrName
     * @param uniqueConstraints
     * @param ifExists
     */
    async dropUniqueConstraints(tableOrName, uniqueConstraints, ifExists) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new check constraint.
     *
     * @param tableOrName
     * @param checkConstraint
     */
    async createCheckConstraint(tableOrName, checkConstraint) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new check constraints.
     *
     * @param tableOrName
     * @param checkConstraints
     */
    async createCheckConstraints(tableOrName, checkConstraints) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops check constraint.
     *
     * @param tableOrName
     * @param checkOrName
     * @param ifExists
     */
    async dropCheckConstraint(tableOrName, checkOrName, ifExists) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops check constraints.
     *
     * @param tableOrName
     * @param checkConstraints
     * @param ifExists
     */
    async dropCheckConstraints(tableOrName, checkConstraints, ifExists) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new exclusion constraint.
     *
     * @param tableOrName
     * @param exclusionConstraint
     */
    async createExclusionConstraint(tableOrName, exclusionConstraint) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new exclusion constraints.
     *
     * @param tableOrName
     * @param exclusionConstraints
     */
    async createExclusionConstraints(tableOrName, exclusionConstraints) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops exclusion constraint.
     *
     * @param tableOrName
     * @param exclusionOrName
     * @param ifExists
     */
    async dropExclusionConstraint(tableOrName, exclusionOrName, ifExists) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops exclusion constraints.
     *
     * @param tableOrName
     * @param exclusionConstraints
     * @param ifExists
     */
    async dropExclusionConstraints(tableOrName, exclusionConstraints, ifExists) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new foreign key.
     *
     * @param tableOrName
     * @param foreignKey
     */
    async createForeignKey(tableOrName, foreignKey) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new foreign keys.
     *
     * @param tableOrName
     * @param foreignKeys
     */
    async createForeignKeys(tableOrName, foreignKeys) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops a foreign key from the table.
     *
     * @param tableOrName
     * @param foreignKey
     * @param ifExists
     */
    async dropForeignKey(tableOrName, foreignKey, ifExists) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops a foreign keys from the table.
     *
     * @param tableOrName
     * @param foreignKeys
     * @param ifExists
     */
    async dropForeignKeys(tableOrName, foreignKeys, ifExists) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new index.
     *
     * @param tableOrName
     * @param index
     */
    async createIndex(tableOrName, index) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Creates a new indices
     *
     * @param tableOrName
     * @param indices
     */
    async createIndices(tableOrName, indices) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops an index from the table.
     *
     * @param collectionName
     * @param indexName
     * @param ifExists
     */
    async dropIndex(collectionName, indexName, ifExists) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops an indices from the table.
     *
     * @param tableOrName
     * @param indices
     * @param ifExists
     */
    async dropIndices(tableOrName, indices, ifExists) {
        throw new error_1.TypeORMError(`Schema update queries are not supported by MongoDB driver.`);
    }
    /**
     * Drops collection.
     *
     * @param collectionName
     * @param options
     * @param options.cascade
     */
    async clearTable(collectionName, options) {
        if (options?.cascade) {
            throw new error_1.TypeORMError(`MongoDB driver does not support clearing table with cascade option`);
        }
        await this.databaseConnection
            .db(this.dataSource.driver.database)
            .dropCollection(collectionName);
    }
    /**
     * Enables special query runner mode in which sql queries won't be executed,
     * instead they will be memorized into a special variable inside query runner.
     * You can get memorized sql using getMemorySql() method.
     */
    enableSqlMemory() {
        throw new error_1.TypeORMError(`This operation is not supported by MongoDB driver.`);
    }
    /**
     * Disables special query runner mode in which sql queries won't be executed
     * started by calling enableSqlMemory() method.
     *
     * Previously memorized sql will be flushed.
     */
    disableSqlMemory() {
        throw new error_1.TypeORMError(`This operation is not supported by MongoDB driver.`);
    }
    /**
     * Flushes all memorized sqls.
     */
    clearSqlMemory() {
        throw new error_1.TypeORMError(`This operation is not supported by MongoDB driver.`);
    }
    /**
     * Gets sql stored in the memory. Parameters in the sql are already replaced.
     */
    getMemorySql() {
        throw new error_1.TypeORMError(`This operation is not supported by MongoDB driver.`);
    }
    /**
     * Executes up sql queries.
     */
    async executeMemoryUpSql() {
        throw new error_1.TypeORMError(`This operation is not supported by MongoDB driver.`);
    }
    /**
     * Executes down sql queries.
     */
    async executeMemoryDownSql() {
        throw new error_1.TypeORMError(`This operation is not supported by MongoDB driver.`);
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Gets collection from the database with a given name.
     *
     * @param collectionName
     */
    getCollection(collectionName) {
        return this.databaseConnection
            .db(this.dataSource.driver.database)
            .collection(collectionName);
    }
    /**
     * Change table comment.
     *
     * @param tableOrName
     * @param comment
     */
    changeTableComment(tableOrName, comment) {
        throw new error_1.TypeORMError(`mongodb driver does not support change table comment.`);
    }
}
exports.MongoQueryRunner = MongoQueryRunner;
//# sourceMappingURL=MongoQueryRunner.js.map