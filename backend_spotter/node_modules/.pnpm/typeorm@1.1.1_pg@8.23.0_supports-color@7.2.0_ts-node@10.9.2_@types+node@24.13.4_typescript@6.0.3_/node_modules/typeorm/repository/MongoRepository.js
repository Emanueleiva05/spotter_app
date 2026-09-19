"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoRepository = void 0;
const Repository_1 = require("./Repository");
const TypeORMError_1 = require("../error/TypeORMError");
/**
 * Repository used to manage mongodb documents of a single entity type.
 */
class MongoRepository extends Repository_1.Repository {
    // -------------------------------------------------------------------------
    // Overridden Methods
    // -------------------------------------------------------------------------
    /**
     * Raw SQL query execution is not supported by MongoDB.
     * Calling this method will return an error.
     *
     * @param query
     * @param parameters
     */
    query(query, parameters) {
        throw new TypeORMError_1.TypeORMError(`Queries aren't supported by MongoDB.`);
    }
    /**
     * Using Query Builder with MongoDB is not supported yet.
     * Calling this method will return an error.
     *
     * @param alias
     * @param queryRunner
     */
    createQueryBuilder(alias, queryRunner) {
        throw new TypeORMError_1.TypeORMError(`Query Builder is not supported by MongoDB.`);
    }
    /**
     * Finds entities that match given find options or conditions.
     *
     * @param options
     */
    find(options) {
        return this.manager.find(this.metadata.target, options);
    }
    /**
     * Finds entities that match given find options or conditions.
     *
     * @param where
     */
    findBy(where) {
        return this.manager.findBy(this.metadata.target, where);
    }
    /**
     * Finds entities that match given find options or conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     *
     * @param options
     */
    findAndCount(options) {
        return this.manager.findAndCount(this.metadata.target, options);
    }
    /**
     * Finds entities that match given find options or conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     *
     * @param where
     */
    findAndCountBy(where) {
        return this.manager.findAndCountBy(this.metadata.target, where);
    }
    /**
     * Finds entities by ids.
     * Optionally find options can be applied.
     *
     * @param ids
     * @param options
     */
    findByIds(ids, options) {
        return this.manager.findByIds(this.metadata.target, ids, options);
    }
    /**
     * Finds first entity that matches given find options.
     *
     * @param options
     */
    async findOne(options) {
        return this.manager.findOne(this.metadata.target, options);
    }
    /**
     * Finds first entity that matches given WHERE conditions.
     *
     * @param where
     */
    async findOneBy(where) {
        return this.manager.findOneBy(this.metadata.target, where);
    }
    /**
     * Finds first entity by a given find options.
     * If entity was not found in the database - rejects with error.
     *
     * @param options
     */
    async findOneOrFail(options) {
        return this.manager.findOneOrFail(this.metadata.target, options);
    }
    /**
     * Finds first entity that matches given where condition.
     * If entity was not found in the database - rejects with error.
     *
     * @param where
     */
    async findOneByOrFail(where) {
        return this.manager.findOneByOrFail(this.metadata.target, where);
    }
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     *
     * @param query
     */
    createCursor(query) {
        return this.manager.createCursor(this.metadata.target, query);
    }
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     * This returns modified version of cursor that transforms each result into Entity model.
     *
     * @param query
     */
    createEntityCursor(query) {
        return this.manager.createEntityCursor(this.metadata.target, query);
    }
    /**
     * Execute an aggregation framework pipeline against the collection.
     *
     * @param pipeline
     * @param options
     */
    aggregate(pipeline, options) {
        return this.manager.aggregate(this.metadata.target, pipeline, options);
    }
    /**
     * Execute an aggregation framework pipeline against the collection.
     * This returns modified version of cursor that transforms each result into Entity model.
     *
     * @param pipeline
     * @param options
     */
    aggregateEntity(pipeline, options) {
        return this.manager.aggregateEntity(this.metadata.target, pipeline, options);
    }
    /**
     * Perform a bulkWrite operation without a fluent API.
     *
     * @param operations
     * @param options
     */
    bulkWrite(operations, options) {
        return this.manager.bulkWrite(this.metadata.target, operations, options);
    }
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param query
     * @param options
     */
    count(query, options) {
        return this.manager.count(this.metadata.target, query ?? {}, options);
    }
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param query
     * @param options
     */
    countDocuments(query, options) {
        return this.manager.countDocuments(this.metadata.target, query ?? {}, options);
    }
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param query
     * @param options
     */
    countBy(query, options) {
        return this.manager.countBy(this.metadata.target, query, options);
    }
    /**
     * Creates an index on the db and collection.
     *
     * @param fieldOrSpec
     * @param options
     */
    createCollectionIndex(fieldOrSpec, options) {
        return this.manager.createCollectionIndex(this.metadata.target, fieldOrSpec, options);
    }
    /**
     * Creates multiple indexes in the collection, this method is only supported for MongoDB 2.6 or higher.
     * Earlier version of MongoDB will throw a command not supported error.
     * Index specifications are defined at http://docs.mongodb.org/manual/reference/command/createIndexes/.
     *
     * @param indexSpecs
     */
    createCollectionIndexes(indexSpecs) {
        return this.manager.createCollectionIndexes(this.metadata.target, indexSpecs);
    }
    /**
     * Delete multiple documents on MongoDB.
     *
     * @param query
     * @param options
     */
    deleteMany(query, options) {
        return this.manager.deleteMany(this.metadata.tableName, query, options);
    }
    /**
     * Delete a document on MongoDB.
     *
     * @param query
     * @param options
     */
    deleteOne(query, options) {
        return this.manager.deleteOne(this.metadata.tableName, query, options);
    }
    /**
     * The distinct command returns returns a list of distinct values for the given key across a collection.
     *
     * @param key
     * @param query
     * @param options
     */
    distinct(key, query, options) {
        return this.manager.distinct(this.metadata.tableName, key, query, options);
    }
    /**
     * Drops an index from this collection.
     *
     * @param indexName
     * @param options
     */
    dropCollectionIndex(indexName, options) {
        return this.manager.dropCollectionIndex(this.metadata.tableName, indexName, options);
    }
    /**
     * Drops all indexes from the collection.
     */
    dropCollectionIndexes() {
        return this.manager.dropCollectionIndexes(this.metadata.tableName);
    }
    /**
     * Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param query
     * @param options
     */
    findOneAndDelete(query, options) {
        return this.manager.findOneAndDelete(this.metadata.tableName, query, options);
    }
    /**
     * Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param query
     * @param replacement
     * @param options
     */
    findOneAndReplace(query, replacement, options) {
        return this.manager.findOneAndReplace(this.metadata.tableName, query, replacement, options);
    }
    /**
     * Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param query
     * @param update
     * @param options
     */
    findOneAndUpdate(query, update, options) {
        return this.manager.findOneAndUpdate(this.metadata.tableName, query, update, options);
    }
    /**
     * Retrieve all the indexes on the collection.
     */
    collectionIndexes() {
        return this.manager.collectionIndexes(this.metadata.tableName);
    }
    /**
     * Retrieve all the indexes on the collection.
     *
     * @param indexes
     */
    collectionIndexExists(indexes) {
        return this.manager.collectionIndexExists(this.metadata.tableName, indexes);
    }
    /**
     * Retrieves this collections index info.
     *
     * @param options
     * @param options.full
     */
    collectionIndexInformation(options) {
        return this.manager.collectionIndexInformation(this.metadata.tableName, options);
    }
    /**
     * Initiate an In order bulk write operation, operations will be serially executed in the order they are added, creating a new operation for each switch in types.
     *
     * @param options
     */
    initializeOrderedBulkOp(options) {
        return this.manager.initializeOrderedBulkOp(this.metadata.tableName, options);
    }
    /**
     * Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.
     *
     * @param options
     */
    initializeUnorderedBulkOp(options) {
        return this.manager.initializeUnorderedBulkOp(this.metadata.tableName, options);
    }
    /**
     * Inserts an array of documents into MongoDB.
     *
     * @param docs
     * @param options
     */
    insertMany(docs, options) {
        return this.manager.insertMany(this.metadata.tableName, docs, options);
    }
    /**
     * Inserts a single document into MongoDB.
     *
     * @param doc
     * @param options
     */
    insertOne(doc, options) {
        return this.manager.insertOne(this.metadata.tableName, doc, options);
    }
    /**
     * Returns if the collection is a capped collection.
     */
    isCapped() {
        return this.manager.isCapped(this.metadata.tableName);
    }
    /**
     * Get the list of all indexes information for the collection.
     *
     * @param options
     */
    listCollectionIndexes(options) {
        return this.manager.listCollectionIndexes(this.metadata.tableName, options);
    }
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     *
     * @param newName
     * @param options
     * @param options.dropTarget
     */
    rename(newName, options) {
        return this.manager.rename(this.metadata.tableName, newName, options);
    }
    /**
     * Replace a document on MongoDB.
     *
     * @param query
     * @param doc
     * @param options
     */
    replaceOne(query, doc, options) {
        return this.manager.replaceOne(this.metadata.tableName, query, doc, options);
    }
    /**
     * Update multiple documents on MongoDB.
     *
     * @param query
     * @param update
     * @param options
     */
    updateMany(query, update, options) {
        return this.manager.updateMany(this.metadata.tableName, query, update, options);
    }
    /**
     * Update a single document on MongoDB.
     *
     * @param query
     * @param update
     * @param options
     */
    updateOne(query, update, options) {
        return this.manager.updateOne(this.metadata.tableName, query, update, options);
    }
}
exports.MongoRepository = MongoRepository;
//# sourceMappingURL=MongoRepository.js.map