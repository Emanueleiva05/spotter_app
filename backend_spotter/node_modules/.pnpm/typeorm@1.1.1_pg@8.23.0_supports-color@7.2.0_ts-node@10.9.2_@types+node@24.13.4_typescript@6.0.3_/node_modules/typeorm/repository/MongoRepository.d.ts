import type { ObjectLiteral } from "../common/ObjectLiteral";
import { Repository } from "./Repository";
import type { MongoFindManyOptions } from "../find-options/mongodb/MongoFindManyOptions";
import type { MongoEntityManager } from "../entity-manager/MongoEntityManager";
import type { QueryRunner } from "../query-runner/QueryRunner";
import type { SelectQueryBuilder } from "../query-builder/SelectQueryBuilder";
import type { MongoFindOneOptions } from "../find-options/mongodb/MongoFindOneOptions";
import type { FindOneOptions } from "../find-options/FindOneOptions";
import type { CreateIndexesOptions, ReplaceOptions, AggregateOptions, AggregationCursor, AnyBulkWriteOperation, BulkWriteOptions, BulkWriteResult, Collection, CommandOperationOptions, CountOptions, DeleteOptions, DeleteResult, Document, Filter, FilterOperators, FindCursor, FindOneAndDeleteOptions, FindOneAndReplaceOptions, FindOneAndUpdateOptions, IndexDescription, InsertManyResult, InsertOneOptions, InsertOneResult, ListIndexesCursor, ListIndexesOptions, OrderedBulkOperation, UnorderedBulkOperation, UpdateFilter, UpdateOptions, UpdateResult, CountDocumentsOptions } from "../driver/mongodb/typings";
import type { FindManyOptions } from "../find-options/FindManyOptions";
/**
 * Repository used to manage mongodb documents of a single entity type.
 */
export declare class MongoRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
    /**
     * Entity Manager used by this repository.
     */
    readonly manager: MongoEntityManager;
    /**
     * Raw SQL query execution is not supported by MongoDB.
     * Calling this method will return an error.
     *
     * @param query
     * @param parameters
     */
    query(query: string, parameters?: any[]): Promise<any>;
    /**
     * Using Query Builder with MongoDB is not supported yet.
     * Calling this method will return an error.
     *
     * @param alias
     * @param queryRunner
     */
    createQueryBuilder(alias: string, queryRunner?: QueryRunner): SelectQueryBuilder<Entity>;
    /**
     * Finds entities that match given find options or conditions.
     *
     * @param options
     */
    find(options?: FindManyOptions<Entity> | Partial<Entity> | FilterOperators<Entity>): Promise<Entity[]>;
    /**
     * Finds entities that match given find options or conditions.
     *
     * @param where
     */
    findBy(where: any): Promise<Entity[]>;
    /**
     * Finds entities that match given find options or conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     *
     * @param options
     */
    findAndCount(options?: MongoFindManyOptions<Entity>): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given find options or conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     *
     * @param where
     */
    findAndCountBy(where: any): Promise<[Entity[], number]>;
    /**
     * Finds entities by ids.
     * Optionally find options can be applied.
     *
     * @param ids
     * @param options
     */
    findByIds(ids: any[], options?: any): Promise<Entity[]>;
    /**
     * Finds first entity that matches given find options.
     *
     * @param options
     */
    findOne(options: MongoFindOneOptions<Entity>): Promise<Entity | null>;
    /**
     * Finds first entity that matches given WHERE conditions.
     *
     * @param where
     */
    findOneBy(where: any): Promise<Entity | null>;
    /**
     * Finds first entity by a given find options.
     * If entity was not found in the database - rejects with error.
     *
     * @param options
     */
    findOneOrFail(options: FindOneOptions<Entity>): Promise<Entity>;
    /**
     * Finds first entity that matches given where condition.
     * If entity was not found in the database - rejects with error.
     *
     * @param where
     */
    findOneByOrFail(where: any): Promise<Entity>;
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     *
     * @param query
     */
    createCursor<T = any>(query?: Filter<Entity>): FindCursor<T>;
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     * This returns modified version of cursor that transforms each result into Entity model.
     *
     * @param query
     */
    createEntityCursor(query?: Filter<Entity>): FindCursor<Entity>;
    /**
     * Execute an aggregation framework pipeline against the collection.
     *
     * @param pipeline
     * @param options
     */
    aggregate<R = any>(pipeline: ObjectLiteral[], options?: AggregateOptions): AggregationCursor<R>;
    /**
     * Execute an aggregation framework pipeline against the collection.
     * This returns modified version of cursor that transforms each result into Entity model.
     *
     * @param pipeline
     * @param options
     */
    aggregateEntity(pipeline: ObjectLiteral[], options?: AggregateOptions): AggregationCursor<Entity>;
    /**
     * Perform a bulkWrite operation without a fluent API.
     *
     * @param operations
     * @param options
     */
    bulkWrite(operations: AnyBulkWriteOperation[], options?: BulkWriteOptions): Promise<BulkWriteResult>;
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param query
     * @param options
     */
    count(query?: ObjectLiteral, options?: CountOptions): Promise<number>;
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param query
     * @param options
     */
    countDocuments(query?: ObjectLiteral, options?: CountDocumentsOptions): Promise<number>;
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param query
     * @param options
     */
    countBy(query?: ObjectLiteral, options?: CountOptions): Promise<number>;
    /**
     * Creates an index on the db and collection.
     *
     * @param fieldOrSpec
     * @param options
     */
    createCollectionIndex(fieldOrSpec: string | any, options?: CreateIndexesOptions): Promise<string>;
    /**
     * Creates multiple indexes in the collection, this method is only supported for MongoDB 2.6 or higher.
     * Earlier version of MongoDB will throw a command not supported error.
     * Index specifications are defined at http://docs.mongodb.org/manual/reference/command/createIndexes/.
     *
     * @param indexSpecs
     */
    createCollectionIndexes(indexSpecs: IndexDescription[]): Promise<string[]>;
    /**
     * Delete multiple documents on MongoDB.
     *
     * @param query
     * @param options
     */
    deleteMany(query: ObjectLiteral, options?: DeleteOptions): Promise<DeleteResult>;
    /**
     * Delete a document on MongoDB.
     *
     * @param query
     * @param options
     */
    deleteOne(query: ObjectLiteral, options?: DeleteOptions): Promise<DeleteResult>;
    /**
     * The distinct command returns returns a list of distinct values for the given key across a collection.
     *
     * @param key
     * @param query
     * @param options
     */
    distinct(key: string, query: ObjectLiteral, options?: CommandOperationOptions): Promise<any>;
    /**
     * Drops an index from this collection.
     *
     * @param indexName
     * @param options
     */
    dropCollectionIndex(indexName: string, options?: CommandOperationOptions): Promise<any>;
    /**
     * Drops all indexes from the collection.
     */
    dropCollectionIndexes(): Promise<any>;
    /**
     * Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param query
     * @param options
     */
    findOneAndDelete(query: ObjectLiteral, options?: FindOneAndDeleteOptions): Promise<Document | null>;
    /**
     * Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param query
     * @param replacement
     * @param options
     */
    findOneAndReplace(query: ObjectLiteral, replacement: Object, options?: FindOneAndReplaceOptions): Promise<Document | null>;
    /**
     * Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param query
     * @param update
     * @param options
     */
    findOneAndUpdate(query: ObjectLiteral, update: Object, options?: FindOneAndUpdateOptions): Promise<Document | null>;
    /**
     * Retrieve all the indexes on the collection.
     */
    collectionIndexes(): Promise<any>;
    /**
     * Retrieve all the indexes on the collection.
     *
     * @param indexes
     */
    collectionIndexExists(indexes: string | string[]): Promise<boolean>;
    /**
     * Retrieves this collections index info.
     *
     * @param options
     * @param options.full
     */
    collectionIndexInformation(options?: {
        full: boolean;
    }): Promise<any>;
    /**
     * Initiate an In order bulk write operation, operations will be serially executed in the order they are added, creating a new operation for each switch in types.
     *
     * @param options
     */
    initializeOrderedBulkOp(options?: BulkWriteOptions): OrderedBulkOperation;
    /**
     * Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.
     *
     * @param options
     */
    initializeUnorderedBulkOp(options?: BulkWriteOptions): UnorderedBulkOperation;
    /**
     * Inserts an array of documents into MongoDB.
     *
     * @param docs
     * @param options
     */
    insertMany(docs: ObjectLiteral[], options?: BulkWriteOptions): Promise<InsertManyResult<Document>>;
    /**
     * Inserts a single document into MongoDB.
     *
     * @param doc
     * @param options
     */
    insertOne(doc: ObjectLiteral, options?: InsertOneOptions): Promise<InsertOneResult>;
    /**
     * Returns if the collection is a capped collection.
     */
    isCapped(): Promise<any>;
    /**
     * Get the list of all indexes information for the collection.
     *
     * @param options
     */
    listCollectionIndexes(options?: ListIndexesOptions): ListIndexesCursor;
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     *
     * @param newName
     * @param options
     * @param options.dropTarget
     */
    rename(newName: string, options?: {
        dropTarget?: boolean;
    }): Promise<Collection<Document>>;
    /**
     * Replace a document on MongoDB.
     *
     * @param query
     * @param doc
     * @param options
     */
    replaceOne(query: ObjectLiteral, doc: ObjectLiteral, options?: ReplaceOptions): Promise<Document | UpdateResult>;
    /**
     * Update multiple documents on MongoDB.
     *
     * @param query
     * @param update
     * @param options
     */
    updateMany(query: ObjectLiteral, update: UpdateFilter<Document>, options?: UpdateOptions): Promise<Document | UpdateResult>;
    /**
     * Update a single document on MongoDB.
     *
     * @param query
     * @param update
     * @param options
     */
    updateOne(query: ObjectLiteral, update: UpdateFilter<Document>, options?: UpdateOptions): Promise<Document | UpdateResult>;
}
