import type { DataSource } from "../../data-source/DataSource";
import type { AggregateOptions, AggregationCursor, AnyBulkWriteOperation, BulkWriteOptions, BulkWriteResult, ChangeStream, ChangeStreamOptions, Collection, CommandOperationOptions, CountDocumentsOptions, CountOptions, CreateIndexesOptions, DeleteOptions, DeleteResult, Document, Filter, FindCursor, FindOneAndDeleteOptions, FindOneAndReplaceOptions, FindOneAndUpdateOptions, IndexDescription, IndexInformationOptions, IndexSpecification, InsertManyResult, InsertOneOptions, InsertOneResult, ListIndexesCursor, ListIndexesOptions, MongoClient, OptionalId, OrderedBulkOperation, RenameOptions, ReplaceOptions, UnorderedBulkOperation, UpdateFilter, UpdateOptions, UpdateResult } from "../../driver/mongodb/typings";
import type { MongoEntityManager } from "../../entity-manager/MongoEntityManager";
import type { ReadStream } from "../../platform/PlatformTools";
import type { QueryRunner } from "../../query-runner/QueryRunner";
import type { Table } from "../../schema-builder/table/Table";
import type { TableCheck } from "../../schema-builder/table/TableCheck";
import type { TableColumn } from "../../schema-builder/table/TableColumn";
import type { TableExclusion } from "../../schema-builder/table/TableExclusion";
import type { TableForeignKey } from "../../schema-builder/table/TableForeignKey";
import type { TableIndex } from "../../schema-builder/table/TableIndex";
import type { TableUnique } from "../../schema-builder/table/TableUnique";
import type { View } from "../../schema-builder/view/View";
import { Broadcaster } from "../../subscriber/Broadcaster";
import type { SqlInMemory } from "../SqlInMemory";
import type { ReplicationMode } from "../types/ReplicationMode";
/**
 * Runs queries on a single MongoDB connection.
 */
export declare class MongoQueryRunner implements QueryRunner {
    /**
     * Connection used by this query runner.
     */
    dataSource: DataSource;
    /**
     * DataSource used by the driver.
     *
     * @deprecated since 1.0.0. Use {@link dataSource} instance instead.
     */
    get connection(): DataSource;
    /**
     * Broadcaster used on this query runner to broadcast entity events.
     */
    broadcaster: Broadcaster;
    /**
     * Entity manager working only with current query runner.
     */
    manager: MongoEntityManager;
    /**
     * Indicates if connection for this query runner is released.
     * Once its released, query runner cannot run queries anymore.
     * Always false for mongodb since mongodb has a single query executor instance.
     */
    isReleased: boolean;
    /**
     * Indicates if transaction is active in this query executor.
     * Always false for mongodb since mongodb does not support transactions.
     */
    isTransactionActive: boolean;
    /**
     * Stores temporarily user data.
     * Useful for sharing data with subscribers.
     */
    data: {};
    /**
     * Real database connection from a connection pool used to perform queries.
     */
    databaseConnection: MongoClient;
    constructor(dataSource: DataSource, databaseConnection: MongoClient);
    /**
     * Called before migrations are run.
     */
    beforeMigration(): Promise<void>;
    /**
     * Called after migrations are run.
     */
    afterMigration(): Promise<void>;
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     *
     * @param collectionName
     * @param filter
     */
    cursor(collectionName: string, filter: Filter<Document>): FindCursor<any>;
    /**
     * Execute an aggregation framework pipeline against the collection.
     *
     * @param collectionName
     * @param pipeline
     * @param options
     */
    aggregate(collectionName: string, pipeline: Document[], options?: AggregateOptions): AggregationCursor<any>;
    /**
     * Perform a bulkWrite operation without a fluent API.
     *
     * @param collectionName
     * @param operations
     * @param options
     */
    bulkWrite(collectionName: string, operations: AnyBulkWriteOperation<Document>[], options?: BulkWriteOptions): Promise<BulkWriteResult>;
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param collectionName
     * @param filter
     * @param options
     */
    count(collectionName: string, filter: Filter<Document>, options?: CountOptions): Promise<number>;
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param collectionName
     * @param filter
     * @param options
     */
    countDocuments(collectionName: string, filter: Filter<Document>, options?: CountDocumentsOptions): Promise<any>;
    /**
     * Creates an index on the db and collection.
     *
     * @param collectionName
     * @param indexSpec
     * @param options
     */
    createCollectionIndex(collectionName: string, indexSpec: IndexSpecification, options?: CreateIndexesOptions): Promise<string>;
    /**
     * Creates multiple indexes in the collection.
     * Index specifications are defined at http://docs.mongodb.org/manual/reference/command/createIndexes/.
     *
     * @param collectionName
     * @param indexSpecs
     */
    createCollectionIndexes(collectionName: string, indexSpecs: IndexDescription[]): Promise<string[]>;
    /**
     * Delete multiple documents on MongoDB.
     *
     * @param collectionName
     * @param filter
     * @param options
     */
    deleteMany(collectionName: string, filter: Filter<Document>, options: DeleteOptions): Promise<DeleteResult>;
    /**
     * Delete a document on MongoDB.
     *
     * @param collectionName
     * @param filter
     * @param options
     */
    deleteOne(collectionName: string, filter: Filter<Document>, options?: DeleteOptions): Promise<DeleteResult>;
    /**
     * The distinct command returns returns a list of distinct values for the given key across a collection.
     *
     * @param collectionName
     * @param key
     * @param filter
     * @param options
     */
    distinct(collectionName: string, key: any, filter: Filter<Document>, options?: CommandOperationOptions): Promise<any>;
    /**
     * Drops an index from this collection.
     *
     * @param collectionName
     * @param indexName
     * @param options
     */
    dropCollectionIndex(collectionName: string, indexName: string, options?: CommandOperationOptions): Promise<Document>;
    /**
     * Drops all indexes from the collection.
     *
     * @param collectionName
     */
    dropCollectionIndexes(collectionName: string): Promise<boolean>;
    /**
     * Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param collectionName
     * @param filter
     * @param options
     */
    findOneAndDelete(collectionName: string, filter: Filter<Document>, options?: FindOneAndDeleteOptions): Promise<Document | null>;
    /**
     * Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param collectionName
     * @param filter
     * @param replacement
     * @param options
     */
    findOneAndReplace(collectionName: string, filter: Filter<Document>, replacement: Document, options?: FindOneAndReplaceOptions): Promise<Document | null>;
    /**
     * Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param collectionName
     * @param filter
     * @param update
     * @param options
     */
    findOneAndUpdate(collectionName: string, filter: Filter<Document>, update: UpdateFilter<Document>, options?: FindOneAndUpdateOptions): Promise<Document | null>;
    /**
     * Retrieve all the indexes on the collection.
     *
     * @param collectionName
     */
    collectionIndexes(collectionName: string): Promise<Document>;
    /**
     * Retrieve all the indexes on the collection.
     *
     * @param collectionName
     * @param indexes
     */
    collectionIndexExists(collectionName: string, indexes: string | string[]): Promise<boolean>;
    /**
     * Retrieves this collections index info.
     *
     * @param collectionName
     * @param options
     */
    collectionIndexInformation(collectionName: string, options?: IndexInformationOptions): Promise<any>;
    /**
     * Initiate an In order bulk write operation, operations will be serially executed in the order they are added, creating a new operation for each switch in types.
     *
     * @param collectionName
     * @param options
     */
    initializeOrderedBulkOp(collectionName: string, options?: BulkWriteOptions): OrderedBulkOperation;
    /**
     * Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.
     *
     * @param collectionName
     * @param options
     */
    initializeUnorderedBulkOp(collectionName: string, options?: BulkWriteOptions): UnorderedBulkOperation;
    /**
     * Inserts an array of documents into MongoDB.
     *
     * @param collectionName
     * @param docs
     * @param options
     */
    insertMany(collectionName: string, docs: OptionalId<Document>[], options?: BulkWriteOptions): Promise<InsertManyResult>;
    /**
     * Inserts a single document into MongoDB.
     *
     * @param collectionName
     * @param doc
     * @param options
     */
    insertOne(collectionName: string, doc: OptionalId<Document>, options?: InsertOneOptions): Promise<InsertOneResult>;
    /**
     * Returns if the collection is a capped collection.
     *
     * @param collectionName
     */
    isCapped(collectionName: string): Promise<boolean>;
    /**
     * Get the list of all indexes information for the collection.
     *
     * @param collectionName
     * @param options
     */
    listCollectionIndexes(collectionName: string, options?: ListIndexesOptions): ListIndexesCursor;
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     *
     * @param collectionName
     * @param newName
     * @param options
     */
    rename(collectionName: string, newName: string, options?: RenameOptions): Promise<Collection<Document>>;
    /**
     * Replace a document on MongoDB.
     *
     * @param collectionName
     * @param filter
     * @param replacement
     * @param options
     */
    replaceOne(collectionName: string, filter: Filter<Document>, replacement: Document, options?: ReplaceOptions): Promise<Document | UpdateResult>;
    /**
     * Watching new changes as stream.
     *
     * @param collectionName
     * @param pipeline
     * @param options
     */
    watch(collectionName: string, pipeline?: Document[], options?: ChangeStreamOptions): ChangeStream;
    /**
     * Update multiple documents on MongoDB.
     *
     * @param collectionName
     * @param filter
     * @param update
     * @param options
     */
    updateMany(collectionName: string, filter: Filter<Document>, update: UpdateFilter<Document>, options?: UpdateOptions): Promise<Document | UpdateResult>;
    /**
     * Update a single document on MongoDB.
     *
     * @param collectionName
     * @param filter
     * @param update
     * @param options
     */
    updateOne(collectionName: string, filter: Filter<Document>, update: UpdateFilter<Document>, options?: UpdateOptions): Promise<Document | UpdateResult>;
    /**
     * Removes all collections from the currently connected database.
     * Be careful with using this method and avoid using it in production or migrations
     * (because it can clear all your database).
     */
    clearDatabase(): Promise<void>;
    /**
     * For MongoDB database we don't create a connection because its single connection already created by a driver.
     */
    connect(): Promise<any>;
    /**
     * For MongoDB database we don't release the connection because it is a single connection.
     */
    release(): Promise<void>;
    [Symbol.asyncDispose](): Promise<void>;
    /**
     * Starts transaction.
     */
    startTransaction(): Promise<void>;
    /**
     * Commits transaction.
     */
    commitTransaction(): Promise<void>;
    /**
     * Rollbacks transaction.
     */
    rollbackTransaction(): Promise<void>;
    /**
     * Executes a given SQL query.
     *
     * @param query
     * @param parameters
     */
    query(query: string, parameters?: any[]): Promise<any>;
    /**
     * Unsupported - Executing SQL query is not supported by MongoDB driver.
     *
     * @param strings
     * @param values
     */
    sql(strings: TemplateStringsArray, ...values: unknown[]): Promise<any>;
    /**
     * Returns raw data stream.
     *
     * @param query
     * @param parameters
     * @param onEnd
     * @param onError
     */
    stream(query: string, parameters?: any[], onEnd?: Function, onError?: Function): Promise<ReadStream>;
    /**
     * Returns all available database names including system databases.
     */
    getDatabases(): Promise<string[]>;
    /**
     * Returns all available schema names including system schemas.
     * If database parameter specified, returns schemas of that database.
     *
     * @param database
     */
    getSchemas(database?: string): Promise<string[]>;
    /**
     * Loads given table's data from the database.
     *
     * @param collectionName
     */
    getTable(collectionName: string): Promise<Table | undefined>;
    /**
     * Loads all tables (with given names) from the database and creates a Table from them.
     *
     * @param collectionNames
     */
    getTables(collectionNames: string[]): Promise<Table[]>;
    /**
     * Loads given views's data from the database.
     *
     * @param collectionName
     */
    getView(collectionName: string): Promise<View | undefined>;
    /**
     * Loads all views (with given names) from the database and creates a Table from them.
     *
     * @param collectionNames
     */
    getViews(collectionNames: string[]): Promise<View[]>;
    getReplicationMode(): ReplicationMode;
    /**
     * Checks if database with the given name exist.
     *
     * @param database
     */
    hasDatabase(database: string): Promise<boolean>;
    /**
     * Loads currently using database
     */
    getCurrentDatabase(): Promise<undefined>;
    /**
     * Checks if schema with the given name exist.
     *
     * @param schema
     */
    hasSchema(schema: string): Promise<boolean>;
    /**
     * Loads currently using database schema
     */
    getCurrentSchema(): Promise<undefined>;
    /**
     * Checks if table with the given name exist in the database.
     *
     * @param collectionName
     */
    hasTable(collectionName: string): Promise<boolean>;
    /**
     * Checks if column with the given name exist in the given table.
     *
     * @param tableOrName
     * @param columnName
     */
    hasColumn(tableOrName: Table | string, columnName: string): Promise<boolean>;
    /**
     * Creates a database if it's not created.
     *
     * @param database
     */
    createDatabase(database: string): Promise<void>;
    /**
     * Drops database.
     *
     * @param database
     * @param ifExists
     */
    dropDatabase(database: string, ifExists?: boolean): Promise<void>;
    /**
     * Creates a new table schema.
     *
     * @param schemaPath
     * @param ifNotExists
     */
    createSchema(schemaPath: string, ifNotExists?: boolean): Promise<void>;
    /**
     * Drops table schema.
     *
     * @param schemaPath
     * @param ifExists
     */
    dropSchema(schemaPath: string, ifExists?: boolean): Promise<void>;
    /**
     * Creates a new table from the given table and columns inside it.
     *
     * @param table
     */
    createTable(table: Table): Promise<void>;
    /**
     * Drops the table.
     *
     * @param tableName
     */
    dropTable(tableName: Table | string): Promise<void>;
    /**
     * Creates a new view.
     *
     * @param view
     */
    createView(view: View): Promise<void>;
    /**
     * Drops the view.
     *
     * @param target
     * @param ifExists
     */
    dropView(target: View | string, ifExists?: boolean): Promise<void>;
    /**
     * Renames the given table.
     *
     * @param oldTableOrName
     * @param newTableOrName
     */
    renameTable(oldTableOrName: Table | string, newTableOrName: Table | string): Promise<void>;
    /**
     * Creates a new column from the column in the table.
     *
     * @param tableOrName
     * @param column
     */
    addColumn(tableOrName: Table | string, column: TableColumn): Promise<void>;
    /**
     * Creates a new columns from the column in the table.
     *
     * @param tableOrName
     * @param columns
     */
    addColumns(tableOrName: Table | string, columns: TableColumn[]): Promise<void>;
    /**
     * Renames column in the given table.
     *
     * @param tableOrName
     * @param oldTableColumnOrName
     * @param newTableColumnOrName
     */
    renameColumn(tableOrName: Table | string, oldTableColumnOrName: TableColumn | string, newTableColumnOrName: TableColumn | string): Promise<void>;
    /**
     * Changes a column in the table.
     *
     * @param tableOrName
     * @param oldTableColumnOrName
     * @param newColumn
     */
    changeColumn(tableOrName: Table | string, oldTableColumnOrName: TableColumn | string, newColumn: TableColumn): Promise<void>;
    /**
     * Changes a column in the table.
     *
     * @param tableOrName
     * @param changedColumns
     */
    changeColumns(tableOrName: Table | string, changedColumns: {
        newColumn: TableColumn;
        oldColumn: TableColumn;
    }[]): Promise<void>;
    /**
     * Drops column in the table.
     *
     * @param tableOrName
     * @param columnOrName
     * @param ifExists
     */
    dropColumn(tableOrName: Table | string, columnOrName: TableColumn | string, ifExists?: boolean): Promise<void>;
    /**
     * Drops the columns in the table.
     *
     * @param tableOrName
     * @param columns
     * @param ifExists
     */
    dropColumns(tableOrName: Table | string, columns: TableColumn[] | string[], ifExists?: boolean): Promise<void>;
    /**
     * Creates a new primary key.
     *
     * @param tableOrName
     * @param columnNames
     */
    createPrimaryKey(tableOrName: Table | string, columnNames: string[]): Promise<void>;
    /**
     * Updates composite primary keys.
     *
     * @param tableOrName
     * @param columns
     */
    updatePrimaryKeys(tableOrName: Table | string, columns: TableColumn[]): Promise<void>;
    /**
     * Drops a primary key.
     *
     * @param tableOrName
     * @param constraintName
     * @param ifExists
     */
    dropPrimaryKey(tableOrName: Table | string, constraintName?: string, ifExists?: boolean): Promise<void>;
    /**
     * Creates a new unique constraint.
     *
     * @param tableOrName
     * @param uniqueConstraint
     */
    createUniqueConstraint(tableOrName: Table | string, uniqueConstraint: TableUnique): Promise<void>;
    /**
     * Creates a new unique constraints.
     *
     * @param tableOrName
     * @param uniqueConstraints
     */
    createUniqueConstraints(tableOrName: Table | string, uniqueConstraints: TableUnique[]): Promise<void>;
    /**
     * Drops a unique constraint.
     *
     * @param tableOrName
     * @param uniqueOrName
     * @param ifExists
     */
    dropUniqueConstraint(tableOrName: Table | string, uniqueOrName: TableUnique | string, ifExists?: boolean): Promise<void>;
    /**
     * Drops unique constraints.
     *
     * @param tableOrName
     * @param uniqueConstraints
     * @param ifExists
     */
    dropUniqueConstraints(tableOrName: Table | string, uniqueConstraints: TableUnique[], ifExists?: boolean): Promise<void>;
    /**
     * Creates a new check constraint.
     *
     * @param tableOrName
     * @param checkConstraint
     */
    createCheckConstraint(tableOrName: Table | string, checkConstraint: TableCheck): Promise<void>;
    /**
     * Creates a new check constraints.
     *
     * @param tableOrName
     * @param checkConstraints
     */
    createCheckConstraints(tableOrName: Table | string, checkConstraints: TableCheck[]): Promise<void>;
    /**
     * Drops check constraint.
     *
     * @param tableOrName
     * @param checkOrName
     * @param ifExists
     */
    dropCheckConstraint(tableOrName: Table | string, checkOrName: TableCheck | string, ifExists?: boolean): Promise<void>;
    /**
     * Drops check constraints.
     *
     * @param tableOrName
     * @param checkConstraints
     * @param ifExists
     */
    dropCheckConstraints(tableOrName: Table | string, checkConstraints: TableCheck[], ifExists?: boolean): Promise<void>;
    /**
     * Creates a new exclusion constraint.
     *
     * @param tableOrName
     * @param exclusionConstraint
     */
    createExclusionConstraint(tableOrName: Table | string, exclusionConstraint: TableExclusion): Promise<void>;
    /**
     * Creates a new exclusion constraints.
     *
     * @param tableOrName
     * @param exclusionConstraints
     */
    createExclusionConstraints(tableOrName: Table | string, exclusionConstraints: TableExclusion[]): Promise<void>;
    /**
     * Drops exclusion constraint.
     *
     * @param tableOrName
     * @param exclusionOrName
     * @param ifExists
     */
    dropExclusionConstraint(tableOrName: Table | string, exclusionOrName: TableExclusion | string, ifExists?: boolean): Promise<void>;
    /**
     * Drops exclusion constraints.
     *
     * @param tableOrName
     * @param exclusionConstraints
     * @param ifExists
     */
    dropExclusionConstraints(tableOrName: Table | string, exclusionConstraints: TableExclusion[], ifExists?: boolean): Promise<void>;
    /**
     * Creates a new foreign key.
     *
     * @param tableOrName
     * @param foreignKey
     */
    createForeignKey(tableOrName: Table | string, foreignKey: TableForeignKey): Promise<void>;
    /**
     * Creates a new foreign keys.
     *
     * @param tableOrName
     * @param foreignKeys
     */
    createForeignKeys(tableOrName: Table | string, foreignKeys: TableForeignKey[]): Promise<void>;
    /**
     * Drops a foreign key from the table.
     *
     * @param tableOrName
     * @param foreignKey
     * @param ifExists
     */
    dropForeignKey(tableOrName: Table | string, foreignKey: TableForeignKey, ifExists?: boolean): Promise<void>;
    /**
     * Drops a foreign keys from the table.
     *
     * @param tableOrName
     * @param foreignKeys
     * @param ifExists
     */
    dropForeignKeys(tableOrName: Table | string, foreignKeys: TableForeignKey[], ifExists?: boolean): Promise<void>;
    /**
     * Creates a new index.
     *
     * @param tableOrName
     * @param index
     */
    createIndex(tableOrName: Table | string, index: TableIndex): Promise<void>;
    /**
     * Creates a new indices
     *
     * @param tableOrName
     * @param indices
     */
    createIndices(tableOrName: Table | string, indices: TableIndex[]): Promise<void>;
    /**
     * Drops an index from the table.
     *
     * @param collectionName
     * @param indexName
     * @param ifExists
     */
    dropIndex(collectionName: string, indexName: string, ifExists?: boolean): Promise<void>;
    /**
     * Drops an indices from the table.
     *
     * @param tableOrName
     * @param indices
     * @param ifExists
     */
    dropIndices(tableOrName: Table | string, indices: TableIndex[], ifExists?: boolean): Promise<void>;
    /**
     * Drops collection.
     *
     * @param collectionName
     * @param options
     * @param options.cascade
     */
    clearTable(collectionName: string, options?: {
        cascade?: boolean;
    }): Promise<void>;
    /**
     * Enables special query runner mode in which sql queries won't be executed,
     * instead they will be memorized into a special variable inside query runner.
     * You can get memorized sql using getMemorySql() method.
     */
    enableSqlMemory(): void;
    /**
     * Disables special query runner mode in which sql queries won't be executed
     * started by calling enableSqlMemory() method.
     *
     * Previously memorized sql will be flushed.
     */
    disableSqlMemory(): void;
    /**
     * Flushes all memorized sqls.
     */
    clearSqlMemory(): void;
    /**
     * Gets sql stored in the memory. Parameters in the sql are already replaced.
     */
    getMemorySql(): SqlInMemory;
    /**
     * Executes up sql queries.
     */
    executeMemoryUpSql(): Promise<void>;
    /**
     * Executes down sql queries.
     */
    executeMemoryDownSql(): Promise<void>;
    /**
     * Gets collection from the database with a given name.
     *
     * @param collectionName
     */
    protected getCollection(collectionName: string): Collection<any>;
    /**
     * Change table comment.
     *
     * @param tableOrName
     * @param comment
     */
    changeTableComment(tableOrName: Table | string, comment?: string): Promise<void>;
}
