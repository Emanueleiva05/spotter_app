import { EntityManager } from "./EntityManager";
import type { EntityTarget } from "../common/EntityTarget";
import type { ObjectLiteral } from "../common/ObjectLiteral";
import type { MongoQueryRunner } from "../driver/mongodb/MongoQueryRunner";
import type { FindManyOptions } from "../find-options/FindManyOptions";
import type { QueryDeepPartialEntity } from "../query-builder/QueryPartialEntity";
import { InsertResult } from "../query-builder/result/InsertResult";
import { UpdateResult } from "../query-builder/result/UpdateResult";
import { DeleteResult } from "../query-builder/result/DeleteResult";
import type { EntityMetadata } from "../metadata/EntityMetadata";
import type { AggregateOptions, AggregationCursor, AnyBulkWriteOperation, BulkWriteOptions, BulkWriteResult, ChangeStream, ChangeStreamOptions, Collection, CommandOperationOptions, CountDocumentsOptions, CountOptions, CreateIndexesOptions, DeleteOptions, DeleteResult as DeleteResultMongoDb, Document, Filter, FilterOperators, FindCursor, FindOneAndDeleteOptions, FindOneAndReplaceOptions, FindOneAndUpdateOptions, IndexDescription, IndexInformationOptions, IndexSpecification, InsertManyResult, InsertOneOptions, InsertOneResult, ListIndexesCursor, ListIndexesOptions, ObjectId, OptionalId, OrderedBulkOperation, RenameOptions, ReplaceOptions, UnorderedBulkOperation, UpdateFilter, UpdateOptions, UpdateResult as UpdateResultMongoDb } from "../driver/mongodb/typings";
import type { DataSource } from "../data-source/DataSource";
import type { MongoFindManyOptions } from "../find-options/mongodb/MongoFindManyOptions";
import type { MongoFindOneOptions } from "../find-options/mongodb/MongoFindOneOptions";
import type { FindOptionsSelect } from "../find-options/FindOptionsSelect";
import type { ColumnMetadata } from "../metadata/ColumnMetadata";
/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 *
 * This implementation is used for MongoDB driver which has some specifics in its EntityManager.
 */
export declare class MongoEntityManager extends EntityManager {
    readonly "@instanceof": symbol;
    get mongoQueryRunner(): MongoQueryRunner;
    constructor(dataSource: DataSource);
    /**
     * Finds entities that match given find options.
     */
    /**
     * Finds entities that match given find options or conditions.
     *
     * @param entityClassOrName
     * @param optionsOrConditions
     */
    find<Entity>(entityClassOrName: EntityTarget<Entity>, optionsOrConditions?: FindManyOptions<Entity> | Partial<Entity> | FilterOperators<Entity>): Promise<Entity[]>;
    /**
     * Finds entities that match given find options or conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     *
     * @param entityClassOrName
     * @param options
     */
    findAndCount<Entity>(entityClassOrName: EntityTarget<Entity>, options?: MongoFindManyOptions<Entity>): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given where conditions.
     *
     * @param entityClassOrName
     * @param where
     */
    findAndCountBy<Entity>(entityClassOrName: EntityTarget<Entity>, where: any): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given WHERE conditions.
     *
     * @param entityClassOrName
     * @param where
     */
    findBy<Entity>(entityClassOrName: EntityTarget<Entity>, where: any): Promise<Entity[]>;
    /**
     * Finds entities by ids.
     * Optionally find options can be applied.
     *
     * @param entityClassOrName
     * @param ids
     * @param optionsOrConditions
     */
    findByIds<Entity>(entityClassOrName: EntityTarget<Entity>, ids: any[], optionsOrConditions?: FindManyOptions<Entity> | Partial<Entity>): Promise<Entity[]>;
    /**
     * Finds first entity that matches given conditions and/or find options.
     *
     * @param entityClassOrName
     * @param options
     */
    findOne<Entity>(entityClassOrName: EntityTarget<Entity>, options: MongoFindOneOptions<Entity>): Promise<Entity | null>;
    /**
     * Finds first entity that matches given WHERE conditions.
     *
     * @param entityClassOrName
     * @param where
     */
    findOneBy<Entity>(entityClassOrName: EntityTarget<Entity>, where: any): Promise<Entity | null>;
    /**
     * Inserts a given entity into the database.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient INSERT query.
     * Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.
     * You can execute bulk inserts using this method.
     *
     * @param target
     * @param entity
     */
    insert<Entity>(target: EntityTarget<Entity>, entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[]): Promise<InsertResult>;
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient UPDATE query.
     * Does not check if entity exist in the database.
     *
     * @param target
     * @param criteria
     * @param partialEntity
     */
    update<Entity>(target: EntityTarget<Entity>, criteria: string | string[] | number | number[] | Date | Date[] | ObjectId | ObjectId[] | ObjectLiteral, partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult>;
    /**
     * Deletes entities by a given conditions.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient DELETE query.
     * Does not check if entity exist in the database.
     *
     * @param target
     * @param criteria
     */
    delete<Entity>(target: EntityTarget<Entity>, criteria: string | string[] | number | number[] | Date | Date[] | ObjectId | ObjectId[] | ObjectLiteral[]): Promise<DeleteResult>;
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     *
     * @param entityClassOrName
     * @param query
     */
    createCursor<Entity, T = any>(entityClassOrName: EntityTarget<Entity>, query?: ObjectLiteral): FindCursor<T>;
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     * This returns modified version of cursor that transforms each result into Entity model.
     *
     * @param entityClassOrName
     * @param query
     */
    createEntityCursor<Entity>(entityClassOrName: EntityTarget<Entity>, query?: ObjectLiteral): FindCursor<Entity>;
    /**
     * Execute an aggregation framework pipeline against the collection.
     *
     * @param entityClassOrName
     * @param pipeline
     * @param options
     */
    aggregate<Entity, R = any>(entityClassOrName: EntityTarget<Entity>, pipeline: Document[], options?: AggregateOptions): AggregationCursor<R>;
    /**
     * Execute an aggregation framework pipeline against the collection.
     * This returns modified version of cursor that transforms each result into Entity model.
     *
     * @param entityClassOrName
     * @param pipeline
     * @param options
     */
    aggregateEntity<Entity>(entityClassOrName: EntityTarget<Entity>, pipeline: Document[], options?: AggregateOptions): AggregationCursor<Entity>;
    /**
     * Perform a bulkWrite operation without a fluent API.
     *
     * @param entityClassOrName
     * @param operations
     * @param options
     */
    bulkWrite<Entity>(entityClassOrName: EntityTarget<Entity>, operations: AnyBulkWriteOperation<Document>[], options?: BulkWriteOptions): Promise<BulkWriteResult>;
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param entityClassOrName
     * @param query
     * @param options
     */
    count<Entity>(entityClassOrName: EntityTarget<Entity>, query?: Filter<Document>, options?: CountOptions): Promise<number>;
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param entityClassOrName
     * @param query
     * @param options
     */
    countDocuments<Entity>(entityClassOrName: EntityTarget<Entity>, query?: Filter<Document>, options?: CountDocumentsOptions): Promise<number>;
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param entityClassOrName
     * @param query
     * @param options
     */
    countBy<Entity>(entityClassOrName: EntityTarget<Entity>, query?: ObjectLiteral, options?: CountOptions): Promise<number>;
    /**
     * Creates an index on the db and collection.
     *
     * @param entityClassOrName
     * @param fieldOrSpec
     * @param options
     */
    createCollectionIndex<Entity>(entityClassOrName: EntityTarget<Entity>, fieldOrSpec: IndexSpecification, options?: CreateIndexesOptions): Promise<string>;
    /**
     * Creates multiple indexes in the collection, this method is only supported for MongoDB 2.6 or higher.
     * Earlier version of MongoDB will throw a command not supported error.
     * Index specifications are defined at http://docs.mongodb.org/manual/reference/command/createIndexes/.
     *
     * @param entityClassOrName
     * @param indexSpecs
     */
    createCollectionIndexes<Entity>(entityClassOrName: EntityTarget<Entity>, indexSpecs: IndexDescription[]): Promise<string[]>;
    /**
     * Delete multiple documents on MongoDB.
     *
     * @param entityClassOrName
     * @param query
     * @param options
     */
    deleteMany<Entity>(entityClassOrName: EntityTarget<Entity>, query: Filter<Document>, options?: DeleteOptions): Promise<DeleteResultMongoDb>;
    /**
     * Delete a document on MongoDB.
     *
     * @param entityClassOrName
     * @param query
     * @param options
     */
    deleteOne<Entity>(entityClassOrName: EntityTarget<Entity>, query: Filter<Document>, options?: DeleteOptions): Promise<DeleteResultMongoDb>;
    /**
     * The distinct command returns returns a list of distinct values for the given key across a collection.
     *
     * @param entityClassOrName
     * @param key
     * @param query
     * @param options
     */
    distinct<Entity>(entityClassOrName: EntityTarget<Entity>, key: string, query: Filter<Document>, options?: CommandOperationOptions): Promise<any>;
    /**
     * Drops an index from this collection.
     *
     * @param entityClassOrName
     * @param indexName
     * @param options
     */
    dropCollectionIndex<Entity>(entityClassOrName: EntityTarget<Entity>, indexName: string, options?: CommandOperationOptions): Promise<any>;
    /**
     * Drops all indexes from the collection.
     *
     * @param entityClassOrName
     */
    dropCollectionIndexes<Entity>(entityClassOrName: EntityTarget<Entity>): Promise<any>;
    /**
     * Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param entityClassOrName
     * @param query
     * @param options
     */
    findOneAndDelete<Entity>(entityClassOrName: EntityTarget<Entity>, query: ObjectLiteral, options?: FindOneAndDeleteOptions): Promise<Document | null>;
    /**
     * Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param entityClassOrName
     * @param query
     * @param replacement
     * @param options
     */
    findOneAndReplace<Entity>(entityClassOrName: EntityTarget<Entity>, query: Filter<Document>, replacement: Document, options?: FindOneAndReplaceOptions): Promise<Document | null>;
    /**
     * Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param entityClassOrName
     * @param query
     * @param update
     * @param options
     */
    findOneAndUpdate<Entity>(entityClassOrName: EntityTarget<Entity>, query: Filter<Document>, update: UpdateFilter<Document>, options?: FindOneAndUpdateOptions): Promise<Document | null>;
    /**
     * Retrieve all the indexes on the collection.
     *
     * @param entityClassOrName
     */
    collectionIndexes<Entity>(entityClassOrName: EntityTarget<Entity>): Promise<Document>;
    /**
     * Retrieve all the indexes on the collection.
     *
     * @param entityClassOrName
     * @param indexes
     */
    collectionIndexExists<Entity>(entityClassOrName: EntityTarget<Entity>, indexes: string | string[]): Promise<boolean>;
    /**
     * Retrieves this collections index info.
     *
     * @param entityClassOrName
     * @param options
     */
    collectionIndexInformation<Entity>(entityClassOrName: EntityTarget<Entity>, options?: IndexInformationOptions): Promise<any>;
    /**
     * Initiate an In order bulk write operation, operations will be serially executed in the order they are added, creating a new operation for each switch in types.
     *
     * @param entityClassOrName
     * @param options
     */
    initializeOrderedBulkOp<Entity>(entityClassOrName: EntityTarget<Entity>, options?: BulkWriteOptions): OrderedBulkOperation;
    /**
     * Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.
     *
     * @param entityClassOrName
     * @param options
     */
    initializeUnorderedBulkOp<Entity>(entityClassOrName: EntityTarget<Entity>, options?: BulkWriteOptions): UnorderedBulkOperation;
    /**
     * Inserts an array of documents into MongoDB.
     *
     * @param entityClassOrName
     * @param docs
     * @param options
     */
    insertMany<Entity>(entityClassOrName: EntityTarget<Entity>, docs: OptionalId<Document>[], options?: BulkWriteOptions): Promise<InsertManyResult>;
    /**
     * Inserts a single document into MongoDB.
     *
     * @param entityClassOrName
     * @param doc
     * @param options
     */
    insertOne<Entity>(entityClassOrName: EntityTarget<Entity>, doc: OptionalId<Document>, options?: InsertOneOptions): Promise<InsertOneResult>;
    /**
     * Returns if the collection is a capped collection.
     *
     * @param entityClassOrName
     */
    isCapped<Entity>(entityClassOrName: EntityTarget<Entity>): Promise<any>;
    /**
     * Get the list of all indexes information for the collection.
     *
     * @param entityClassOrName
     * @param options
     */
    listCollectionIndexes<Entity>(entityClassOrName: EntityTarget<Entity>, options?: ListIndexesOptions): ListIndexesCursor;
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     *
     * @param entityClassOrName
     * @param newName
     * @param options
     */
    rename<Entity>(entityClassOrName: EntityTarget<Entity>, newName: string, options?: RenameOptions): Promise<Collection<Document>>;
    /**
     * Replace a document on MongoDB.
     *
     * @param entityClassOrName
     * @param query
     * @param doc
     * @param options
     */
    replaceOne<Entity>(entityClassOrName: EntityTarget<Entity>, query: Filter<Document>, doc: Document, options?: ReplaceOptions): Promise<Document | UpdateResultMongoDb>;
    watch<Entity>(entityClassOrName: EntityTarget<Entity>, pipeline?: Document[], options?: ChangeStreamOptions): ChangeStream;
    /**
     * Update multiple documents on MongoDB.
     *
     * @param entityClassOrName
     * @param query
     * @param update
     * @param options
     */
    updateMany<Entity>(entityClassOrName: EntityTarget<Entity>, query: Filter<Document>, update: UpdateFilter<Document>, options?: UpdateOptions): Promise<Document | UpdateResultMongoDb>;
    /**
     * Update a single document on MongoDB.
     *
     * @param entityClassOrName
     * @param query
     * @param update
     * @param options
     */
    updateOne<Entity>(entityClassOrName: EntityTarget<Entity>, query: Filter<Document>, update: UpdateFilter<Document>, options?: UpdateOptions): Promise<Document | UpdateResultMongoDb>;
    /**
     * Replaces the entity's ObjectId property name (e.g. "id") with "_id" in a
     * query object so that `findOneBy({ id: value })` works as expected.
     *
     * @param metadata
     * @param query
     */
    protected replaceObjectIdProperty(metadata: EntityMetadata, query: ObjectLiteral | undefined): ObjectLiteral | undefined;
    /**
     * Recursively rewrites a query object, renaming the given property to
     * "_id" and converting values to ObjectId instances. Walks into $or/$and.
     *
     * @param obj
     * @param propertyName
     * @param objectIdClass
     */
    private rewriteObjectIdQuery;
    /**
     * Converts a query value to ObjectId, handling scalars, arrays, and
     * MongoDB operator objects (e.g. { $in: [...] }, { $ne: ... }).
     *
     * @param value
     * @param objectIdClass
     */
    private convertToObjectId;
    /**
     * Converts FindManyOptions to mongodb query.
     *
     * @param optionsOrConditions
     */
    protected convertFindManyOptionsOrConditionsToMongodbQuery<Entity>(optionsOrConditions: MongoFindManyOptions<Entity> | Partial<Entity> | FilterOperators<Entity> | any[] | undefined): ObjectLiteral | undefined;
    /**
     * Converts FindOneOptions to mongodb query.
     *
     * @param optionsOrConditions
     */
    protected convertFindOneOptionsOrConditionsToMongodbQuery<Entity>(optionsOrConditions: MongoFindOneOptions<Entity> | Partial<Entity> | undefined): ObjectLiteral | undefined;
    /**
     * Converts FindOptions into mongodb order by criteria.
     *
     * @param order
     */
    protected convertFindOptionsOrderToOrderCriteria(order: ObjectLiteral): ObjectLiteral;
    /**
     * Converts FindOptions into mongodb select by criteria.
     *
     * @param selects
     * @param metadata
     */
    protected convertFindOptionsSelectToProjectCriteria(selects: FindOptionsSelect<any>, metadata: EntityMetadata): ObjectLiteral;
    /**
     * Ensures given id is an id for query.
     *
     * @param metadata
     * @param idMap
     */
    protected convertMixedCriteria(metadata: EntityMetadata, idMap: any): ObjectLiteral;
    /**
     * Overrides cursor's toArray and next methods to convert results to entity automatically.
     *
     * @param metadata
     * @param cursor
     */
    protected applyEntityTransformationToCursor<Entity extends ObjectLiteral>(metadata: EntityMetadata, cursor: FindCursor<Entity> | AggregationCursor<Entity>): void;
    protected filterSoftDeleted<Entity>(cursor: FindCursor<Entity>, deleteDateColumn: ColumnMetadata, query?: ObjectLiteral): void;
    /**
     * Finds first entity that matches given conditions and/or find options.
     *
     * @param entityClassOrName
     * @param optionsOrConditions
     * @param maybeOptions
     */
    protected executeFindOne<Entity>(entityClassOrName: EntityTarget<Entity>, optionsOrConditions?: any, maybeOptions?: MongoFindOneOptions<Entity>): Promise<Entity | null>;
    protected executeFind<Entity>(entityClassOrName: EntityTarget<Entity>, optionsOrConditions?: MongoFindManyOptions<Entity> | Partial<Entity> | any[]): Promise<Entity[]>;
    /**
     * Finds entities that match given find options or conditions.
     *
     * @param entityClassOrName
     * @param optionsOrConditions
     */
    executeFindAndCount<Entity>(entityClassOrName: EntityTarget<Entity>, optionsOrConditions?: MongoFindManyOptions<Entity> | Partial<Entity>): Promise<[Entity[], number]>;
}
