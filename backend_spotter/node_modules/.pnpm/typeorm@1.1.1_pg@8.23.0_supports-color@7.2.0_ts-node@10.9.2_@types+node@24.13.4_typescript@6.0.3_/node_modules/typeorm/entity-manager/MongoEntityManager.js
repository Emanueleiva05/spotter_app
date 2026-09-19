"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoEntityManager = void 0;
const EntityManager_1 = require("./EntityManager");
const DocumentToEntityTransformer_1 = require("../query-builder/transformer/DocumentToEntityTransformer");
const FindOptionsUtils_1 = require("../find-options/FindOptionsUtils");
const PlatformTools_1 = require("../platform/PlatformTools");
const InsertResult_1 = require("../query-builder/result/InsertResult");
const UpdateResult_1 = require("../query-builder/result/UpdateResult");
const DeleteResult_1 = require("../query-builder/result/DeleteResult");
const error_1 = require("../error");
const ObjectUtils_1 = require("../util/ObjectUtils");
/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 *
 * This implementation is used for MongoDB driver which has some specifics in its EntityManager.
 */
class MongoEntityManager extends EntityManager_1.EntityManager {
    get mongoQueryRunner() {
        return this.dataSource.driver
            .queryRunner;
    }
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(dataSource) {
        super(dataSource);
        this["@instanceof"] = Symbol.for("MongoEntityManager");
    }
    // -------------------------------------------------------------------------
    // Overridden Methods
    // -------------------------------------------------------------------------
    /**
     * Finds entities that match given find options.
     */
    /**
     * Finds entities that match given find options or conditions.
     *
     * @param entityClassOrName
     * @param optionsOrConditions
     */
    async find(entityClassOrName, optionsOrConditions) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        const query = this.replaceObjectIdProperty(metadata, this.convertFindManyOptionsOrConditionsToMongodbQuery(optionsOrConditions));
        const cursor = this.createEntityCursor(entityClassOrName, query);
        const deleteDateColumn = metadata.deleteDateColumn;
        if (FindOptionsUtils_1.FindOptionsUtils.isFindManyOptions(optionsOrConditions)) {
            if (optionsOrConditions.select)
                cursor.project(this.convertFindOptionsSelectToProjectCriteria(optionsOrConditions.select, metadata));
            if (optionsOrConditions.skip)
                cursor.skip(optionsOrConditions.skip);
            if (optionsOrConditions.take)
                cursor.limit(optionsOrConditions.take);
            if (optionsOrConditions.order)
                cursor.sort(this.convertFindOptionsOrderToOrderCriteria(optionsOrConditions.order));
            if (deleteDateColumn && !optionsOrConditions.withDeleted) {
                this.filterSoftDeleted(cursor, deleteDateColumn, query);
            }
        }
        else if (deleteDateColumn) {
            this.filterSoftDeleted(cursor, deleteDateColumn, query);
        }
        return cursor.toArray();
    }
    /**
     * Finds entities that match given find options or conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     *
     * @param entityClassOrName
     * @param options
     */
    async findAndCount(entityClassOrName, options) {
        return this.executeFindAndCount(entityClassOrName, options);
    }
    /**
     * Finds entities that match given where conditions.
     *
     * @param entityClassOrName
     * @param where
     */
    async findAndCountBy(entityClassOrName, where) {
        return this.executeFindAndCount(entityClassOrName, where);
    }
    /**
     * Finds entities that match given WHERE conditions.
     *
     * @param entityClassOrName
     * @param where
     */
    async findBy(entityClassOrName, where) {
        return this.executeFind(entityClassOrName, where);
    }
    /**
     * Finds entities by ids.
     * Optionally find options can be applied.
     *
     * @param entityClassOrName
     * @param ids
     * @param optionsOrConditions
     */
    async findByIds(entityClassOrName, ids, optionsOrConditions) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        const query = this.convertFindManyOptionsOrConditionsToMongodbQuery(optionsOrConditions) ?? {};
        const objectIdClass = PlatformTools_1.PlatformTools.load("mongodb").ObjectId;
        query["_id"] = {
            $in: ids.map((id) => {
                if (typeof id === "string") {
                    return new objectIdClass(id);
                }
                if (typeof id === "object") {
                    if (id instanceof objectIdClass) {
                        return id;
                    }
                    const propertyName = metadata.objectIdColumn.propertyName;
                    if (id[propertyName] instanceof objectIdClass) {
                        return id[propertyName];
                    }
                }
            }),
        };
        const cursor = this.createEntityCursor(entityClassOrName, query);
        if (FindOptionsUtils_1.FindOptionsUtils.isFindManyOptions(optionsOrConditions)) {
            if (optionsOrConditions.select)
                cursor.project(this.convertFindOptionsSelectToProjectCriteria(optionsOrConditions.select, metadata));
            if (optionsOrConditions.skip)
                cursor.skip(optionsOrConditions.skip);
            if (optionsOrConditions.take)
                cursor.limit(optionsOrConditions.take);
            if (optionsOrConditions.order)
                cursor.sort(this.convertFindOptionsOrderToOrderCriteria(optionsOrConditions.order));
        }
        return cursor.toArray();
    }
    /**
     * Finds first entity that matches given conditions and/or find options.
     *
     * @param entityClassOrName
     * @param options
     */
    async findOne(entityClassOrName, options) {
        return this.executeFindOne(entityClassOrName, options);
    }
    /**
     * Finds first entity that matches given WHERE conditions.
     *
     * @param entityClassOrName
     * @param where
     */
    async findOneBy(entityClassOrName, where) {
        return this.executeFindOne(entityClassOrName, where);
    }
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
    async insert(target, entity) {
        // todo: convert entity to its database name
        const result = new InsertResult_1.InsertResult();
        if (Array.isArray(entity)) {
            result.raw = await this.insertMany(target, entity);
            Object.keys(result.raw.insertedIds).forEach((key) => {
                const insertedId = result.raw.insertedIds[key];
                result.generatedMaps.push(this.dataSource.driver.createGeneratedMap(this.dataSource.getMetadata(target), insertedId));
                result.identifiers.push(this.dataSource.driver.createGeneratedMap(this.dataSource.getMetadata(target), insertedId));
            });
        }
        else {
            result.raw = await this.insertOne(target, entity);
            result.generatedMaps.push(this.dataSource.driver.createGeneratedMap(this.dataSource.getMetadata(target), result.raw.insertedId));
            result.identifiers.push(this.dataSource.driver.createGeneratedMap(this.dataSource.getMetadata(target), result.raw.insertedId));
        }
        return result;
    }
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
    async update(target, criteria, partialEntity) {
        const result = new UpdateResult_1.UpdateResult();
        if (Array.isArray(criteria)) {
            const updateResults = await Promise.all(criteria.map((criteriaItem) => {
                return this.update(target, criteriaItem, partialEntity);
            }));
            result.raw = updateResults.map((r) => r.raw);
            result.affected = updateResults
                .map((r) => r.affected ?? 0)
                .reduce((c, r) => c + r, 0);
            result.generatedMaps = updateResults.reduce((c, r) => c.concat(r.generatedMaps), []);
        }
        else {
            const metadata = this.dataSource.getMetadata(target);
            const mongoResult = await this.updateMany(target, this.convertMixedCriteria(metadata, criteria), { $set: partialEntity });
            result.raw = mongoResult;
            result.affected = mongoResult.modifiedCount;
        }
        return result;
    }
    /**
     * Deletes entities by a given conditions.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient DELETE query.
     * Does not check if entity exist in the database.
     *
     * @param target
     * @param criteria
     */
    async delete(target, criteria) {
        const result = new DeleteResult_1.DeleteResult();
        if (Array.isArray(criteria)) {
            const deleteResults = await Promise.all(criteria.map((criteriaItem) => {
                return this.delete(target, criteriaItem);
            }));
            result.raw = deleteResults.map((r) => r.raw);
            result.affected = deleteResults
                .map((r) => r.affected ?? 0)
                .reduce((c, r) => c + r, 0);
        }
        else {
            const mongoResult = await this.deleteMany(target, this.convertMixedCriteria(this.dataSource.getMetadata(target), criteria));
            result.raw = mongoResult;
            result.affected = mongoResult.deletedCount;
        }
        return result;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     *
     * @param entityClassOrName
     * @param query
     */
    createCursor(entityClassOrName, query = {}) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.cursor(metadata.tableName, query);
    }
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     * This returns modified version of cursor that transforms each result into Entity model.
     *
     * @param entityClassOrName
     * @param query
     */
    createEntityCursor(entityClassOrName, query = {}) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        const cursor = this.createCursor(entityClassOrName, query);
        this.applyEntityTransformationToCursor(metadata, cursor);
        return cursor;
    }
    /**
     * Execute an aggregation framework pipeline against the collection.
     *
     * @param entityClassOrName
     * @param pipeline
     * @param options
     */
    aggregate(entityClassOrName, pipeline, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.aggregate(metadata.tableName, pipeline, options);
    }
    /**
     * Execute an aggregation framework pipeline against the collection.
     * This returns modified version of cursor that transforms each result into Entity model.
     *
     * @param entityClassOrName
     * @param pipeline
     * @param options
     */
    aggregateEntity(entityClassOrName, pipeline, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        const cursor = this.mongoQueryRunner.aggregate(metadata.tableName, pipeline, options);
        this.applyEntityTransformationToCursor(metadata, cursor);
        return cursor;
    }
    /**
     * Perform a bulkWrite operation without a fluent API.
     *
     * @param entityClassOrName
     * @param operations
     * @param options
     */
    bulkWrite(entityClassOrName, operations, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.bulkWrite(metadata.tableName, operations, options);
    }
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param entityClassOrName
     * @param query
     * @param options
     */
    count(entityClassOrName, query = {}, options = {}) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.count(metadata.tableName, query, options);
    }
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param entityClassOrName
     * @param query
     * @param options
     */
    countDocuments(entityClassOrName, query = {}, options = {}) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.countDocuments(metadata.tableName, query, options);
    }
    /**
     * Count number of matching documents in the db to a query.
     *
     * @param entityClassOrName
     * @param query
     * @param options
     */
    countBy(entityClassOrName, query, options) {
        return this.count(entityClassOrName, query, options);
    }
    /**
     * Creates an index on the db and collection.
     *
     * @param entityClassOrName
     * @param fieldOrSpec
     * @param options
     */
    createCollectionIndex(entityClassOrName, fieldOrSpec, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.createCollectionIndex(metadata.tableName, fieldOrSpec, options);
    }
    /**
     * Creates multiple indexes in the collection, this method is only supported for MongoDB 2.6 or higher.
     * Earlier version of MongoDB will throw a command not supported error.
     * Index specifications are defined at http://docs.mongodb.org/manual/reference/command/createIndexes/.
     *
     * @param entityClassOrName
     * @param indexSpecs
     */
    createCollectionIndexes(entityClassOrName, indexSpecs) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.createCollectionIndexes(metadata.tableName, indexSpecs);
    }
    /**
     * Delete multiple documents on MongoDB.
     *
     * @param entityClassOrName
     * @param query
     * @param options
     */
    deleteMany(entityClassOrName, query, options = {}) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.deleteMany(metadata.tableName, query, options);
    }
    /**
     * Delete a document on MongoDB.
     *
     * @param entityClassOrName
     * @param query
     * @param options
     */
    deleteOne(entityClassOrName, query, options = {}) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.deleteOne(metadata.tableName, query, options);
    }
    /**
     * The distinct command returns returns a list of distinct values for the given key across a collection.
     *
     * @param entityClassOrName
     * @param key
     * @param query
     * @param options
     */
    distinct(entityClassOrName, key, query, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.distinct(metadata.tableName, key, query, options);
    }
    /**
     * Drops an index from this collection.
     *
     * @param entityClassOrName
     * @param indexName
     * @param options
     */
    dropCollectionIndex(entityClassOrName, indexName, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.dropCollectionIndex(metadata.tableName, indexName, options);
    }
    /**
     * Drops all indexes from the collection.
     *
     * @param entityClassOrName
     */
    dropCollectionIndexes(entityClassOrName) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.dropCollectionIndexes(metadata.tableName);
    }
    /**
     * Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param entityClassOrName
     * @param query
     * @param options
     */
    findOneAndDelete(entityClassOrName, query, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.findOneAndDelete(metadata.tableName, query, options);
    }
    /**
     * Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param entityClassOrName
     * @param query
     * @param replacement
     * @param options
     */
    findOneAndReplace(entityClassOrName, query, replacement, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.findOneAndReplace(metadata.tableName, query, replacement, options);
    }
    /**
     * Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.
     *
     * @param entityClassOrName
     * @param query
     * @param update
     * @param options
     */
    findOneAndUpdate(entityClassOrName, query, update, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.findOneAndUpdate(metadata.tableName, query, update, options);
    }
    /**
     * Retrieve all the indexes on the collection.
     *
     * @param entityClassOrName
     */
    collectionIndexes(entityClassOrName) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.collectionIndexes(metadata.tableName);
    }
    /**
     * Retrieve all the indexes on the collection.
     *
     * @param entityClassOrName
     * @param indexes
     */
    collectionIndexExists(entityClassOrName, indexes) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.collectionIndexExists(metadata.tableName, indexes);
    }
    /**
     * Retrieves this collections index info.
     *
     * @param entityClassOrName
     * @param options
     */
    collectionIndexInformation(entityClassOrName, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.collectionIndexInformation(metadata.tableName, options);
    }
    /**
     * Initiate an In order bulk write operation, operations will be serially executed in the order they are added, creating a new operation for each switch in types.
     *
     * @param entityClassOrName
     * @param options
     */
    initializeOrderedBulkOp(entityClassOrName, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.initializeOrderedBulkOp(metadata.tableName, options);
    }
    /**
     * Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.
     *
     * @param entityClassOrName
     * @param options
     */
    initializeUnorderedBulkOp(entityClassOrName, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.initializeUnorderedBulkOp(metadata.tableName, options);
    }
    /**
     * Inserts an array of documents into MongoDB.
     *
     * @param entityClassOrName
     * @param docs
     * @param options
     */
    insertMany(entityClassOrName, docs, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.insertMany(metadata.tableName, docs, options);
    }
    /**
     * Inserts a single document into MongoDB.
     *
     * @param entityClassOrName
     * @param doc
     * @param options
     */
    insertOne(entityClassOrName, doc, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.insertOne(metadata.tableName, doc, options);
    }
    /**
     * Returns if the collection is a capped collection.
     *
     * @param entityClassOrName
     */
    isCapped(entityClassOrName) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.isCapped(metadata.tableName);
    }
    /**
     * Get the list of all indexes information for the collection.
     *
     * @param entityClassOrName
     * @param options
     */
    listCollectionIndexes(entityClassOrName, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.listCollectionIndexes(metadata.tableName, options);
    }
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     *
     * @param entityClassOrName
     * @param newName
     * @param options
     */
    rename(entityClassOrName, newName, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.rename(metadata.tableName, newName, options);
    }
    /**
     * Replace a document on MongoDB.
     *
     * @param entityClassOrName
     * @param query
     * @param doc
     * @param options
     */
    replaceOne(entityClassOrName, query, doc, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.replaceOne(metadata.tableName, query, doc, options);
    }
    watch(entityClassOrName, pipeline, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.watch(metadata.tableName, pipeline, options);
    }
    /**
     * Update multiple documents on MongoDB.
     *
     * @param entityClassOrName
     * @param query
     * @param update
     * @param options
     */
    updateMany(entityClassOrName, query, update, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.updateMany(metadata.tableName, query, update, options);
    }
    /**
     * Update a single document on MongoDB.
     *
     * @param entityClassOrName
     * @param query
     * @param update
     * @param options
     */
    updateOne(entityClassOrName, query, update, options) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        return this.mongoQueryRunner.updateOne(metadata.tableName, query, update, options);
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Replaces the entity's ObjectId property name (e.g. "id") with "_id" in a
     * query object so that `findOneBy({ id: value })` works as expected.
     *
     * @param metadata
     * @param query
     */
    replaceObjectIdProperty(metadata, query) {
        if (!query)
            return query;
        const objectIdColumn = metadata.objectIdColumn;
        if (!objectIdColumn)
            return query;
        const propertyName = objectIdColumn.propertyName;
        if (propertyName === "_id")
            return query;
        if (!(propertyName in query)) {
            const hasNested = ("$or" in query && Array.isArray(query.$or)) ||
                ("$and" in query && Array.isArray(query.$and));
            if (!hasNested)
                return query;
        }
        const objectIdClass = PlatformTools_1.PlatformTools.load("mongodb").ObjectId;
        return this.rewriteObjectIdQuery(query, propertyName, objectIdClass);
    }
    /**
     * Recursively rewrites a query object, renaming the given property to
     * "_id" and converting values to ObjectId instances. Walks into $or/$and.
     *
     * @param obj
     * @param propertyName
     * @param objectIdClass
     */
    rewriteObjectIdQuery(obj, propertyName, objectIdClass) {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (key === propertyName) {
                result["_id"] = this.convertToObjectId(value, objectIdClass);
            }
            else if ((key === "$or" || key === "$and") &&
                Array.isArray(value)) {
                result[key] = value.map((item) => typeof item === "object" && item !== null
                    ? this.rewriteObjectIdQuery(item, propertyName, objectIdClass)
                    : item);
            }
            else {
                result[key] = value;
            }
        }
        return result;
    }
    /**
     * Converts a query value to ObjectId, handling scalars, arrays, and
     * MongoDB operator objects (e.g. { $in: [...] }, { $ne: ... }).
     *
     * @param value
     * @param objectIdClass
     */
    convertToObjectId(value, objectIdClass) {
        if (value instanceof objectIdClass)
            return value;
        if (typeof value === "string" || typeof value === "number")
            return new objectIdClass(value);
        if (Array.isArray(value))
            return value.map((v) => this.convertToObjectId(v, objectIdClass));
        if (value !== null &&
            typeof value === "object" &&
            Object.keys(value).some((k) => k.startsWith("$"))) {
            const result = {};
            for (const [k, v] of Object.entries(value)) {
                result[k] = this.convertToObjectId(v, objectIdClass);
            }
            return result;
        }
        return value;
    }
    /**
     * Converts FindManyOptions to mongodb query.
     *
     * @param optionsOrConditions
     */
    convertFindManyOptionsOrConditionsToMongodbQuery(optionsOrConditions) {
        if (!optionsOrConditions)
            return undefined;
        FindOptionsUtils_1.FindOptionsUtils.rejectJoinOption(optionsOrConditions);
        FindOptionsUtils_1.FindOptionsUtils.rejectStringArraySelect(optionsOrConditions);
        FindOptionsUtils_1.FindOptionsUtils.rejectStringArrayRelations(optionsOrConditions);
        if (FindOptionsUtils_1.FindOptionsUtils.isFindManyOptions(optionsOrConditions))
            // If where condition is passed as a string which contains sql we have to ignore
            // as mongo is not a sql database
            return typeof optionsOrConditions.where === "string"
                ? {}
                : optionsOrConditions.where;
        return optionsOrConditions;
    }
    /**
     * Converts FindOneOptions to mongodb query.
     *
     * @param optionsOrConditions
     */
    convertFindOneOptionsOrConditionsToMongodbQuery(optionsOrConditions) {
        if (!optionsOrConditions)
            return undefined;
        FindOptionsUtils_1.FindOptionsUtils.rejectJoinOption(optionsOrConditions);
        FindOptionsUtils_1.FindOptionsUtils.rejectStringArraySelect(optionsOrConditions);
        FindOptionsUtils_1.FindOptionsUtils.rejectStringArrayRelations(optionsOrConditions);
        if (FindOptionsUtils_1.FindOptionsUtils.isFindOneOptions(optionsOrConditions))
            // If where condition is passed as a string which contains sql we have to ignore
            // as mongo is not a sql database
            return typeof optionsOrConditions.where === "string"
                ? {}
                : optionsOrConditions.where;
        return optionsOrConditions;
    }
    /**
     * Converts FindOptions into mongodb order by criteria.
     *
     * @param order
     */
    convertFindOptionsOrderToOrderCriteria(order) {
        return Object.keys(order).reduce((orderCriteria, key) => {
            switch (order[key]) {
                case "DESC":
                    orderCriteria[key] = -1;
                    break;
                case "ASC":
                    orderCriteria[key] = 1;
                    break;
                default:
                    orderCriteria[key] = order[key];
            }
            return orderCriteria;
        }, {});
    }
    /**
     * Converts FindOptions into mongodb select by criteria.
     *
     * @param selects
     * @param metadata
     */
    convertFindOptionsSelectToProjectCriteria(selects, metadata) {
        const projection = {};
        const build = (obj, embedPrefix) => {
            for (const key of Object.keys(obj)) {
                const value = obj[key];
                if (value === undefined || value === false)
                    continue;
                const propertyPath = embedPrefix ? `${embedPrefix}.${key}` : key;
                if (metadata.findColumnWithPropertyPathStrict(propertyPath)) {
                    projection[propertyPath] = 1;
                    continue;
                }
                const embed = metadata.findEmbeddedWithPropertyPath(propertyPath);
                if (embed) {
                    if (value === true) {
                        for (const subColumn of embed.columnsFromTree) {
                            projection[subColumn.propertyPath] = 1;
                        }
                    }
                    else if (typeof value === "object") {
                        build(value, propertyPath);
                    }
                    continue;
                }
                if (metadata.findRelationWithPropertyPath(propertyPath))
                    continue;
                throw new error_1.EntityPropertyNotFoundError(propertyPath, metadata);
            }
        };
        build(selects, "");
        // Translate ObjectIdColumn property name (e.g. "id") to "_id" for MongoDB
        if (metadata.objectIdColumn) {
            const propertyName = metadata.objectIdColumn.propertyName;
            if (propertyName !== "_id" &&
                projection[propertyName] !== undefined) {
                projection["_id"] = projection[propertyName];
                delete projection[propertyName];
            }
        }
        return projection;
    }
    /**
     * Ensures given id is an id for query.
     *
     * @param metadata
     * @param idMap
     */
    convertMixedCriteria(metadata, idMap) {
        const objectIdInstance = PlatformTools_1.PlatformTools.load("mongodb").ObjectId;
        // check first if it's ObjectId compatible:
        // string, number, Buffer, ObjectId or ObjectId-like
        if (objectIdInstance.isValid(idMap)) {
            return {
                _id: new objectIdInstance(idMap),
            };
        }
        // if it's some other type of object build a query from the columns
        // this check needs to be after the ObjectId check, because a valid ObjectId is also an Object instance
        if (ObjectUtils_1.ObjectUtils.isObject(idMap)) {
            return metadata.columns.reduce((query, column) => {
                const columnValue = column.getEntityValue(idMap);
                if (columnValue !== undefined)
                    query[column.databasePath] = columnValue;
                return query;
            }, {});
        }
        // last resort: try to convert it to an ObjectId anyway
        // most likely it will fail, but we want to be backwards compatible and keep the same thrown Errors.
        // it can still pass with null/undefined
        return {
            _id: new objectIdInstance(idMap),
        };
    }
    /**
     * Overrides cursor's toArray and next methods to convert results to entity automatically.
     *
     * @param metadata
     * @param cursor
     */
    applyEntityTransformationToCursor(metadata, cursor) {
        const transformer = new DocumentToEntityTransformer_1.DocumentToEntityTransformer();
        const broadcaster = this.mongoQueryRunner.broadcaster;
        let isInToArray = false;
        // transformer function that converts raw document to entity
        // used by both next and toArray internally in the MongoDB driver
        cursor.transform = (doc) => {
            return transformer.transform(doc, metadata);
        };
        // override toArray for batch broadcast (skip per-doc broadcast in next)
        const originalToArray = cursor.toArray.bind(cursor);
        cursor.toArray = async () => {
            isInToArray = true;
            try {
                const entities = await originalToArray();
                if (entities.length > 0) {
                    await broadcaster.broadcast("Load", metadata, entities);
                }
                return entities;
            }
            finally {
                isInToArray = false;
            }
        };
        // override next for per-doc broadcast (skip if in toArray batch)
        const originalNext = cursor.next.bind(cursor);
        cursor.next = async () => {
            const entity = await originalNext();
            if (entity && !isInToArray) {
                await broadcaster.broadcast("Load", metadata, [entity]);
            }
            return entity;
        };
    }
    filterSoftDeleted(cursor, deleteDateColumn, query) {
        const { $or, ...restQuery } = query ?? {};
        cursor.filter({
            $or: [
                { [deleteDateColumn.propertyName]: { $eq: null } },
                ...(Array.isArray($or) ? $or : []),
            ],
            ...restQuery,
        });
    }
    /**
     * Finds first entity that matches given conditions and/or find options.
     *
     * @param entityClassOrName
     * @param optionsOrConditions
     * @param maybeOptions
     */
    async executeFindOne(entityClassOrName, optionsOrConditions, maybeOptions) {
        const objectIdClass = PlatformTools_1.PlatformTools.load("mongodb").ObjectId;
        const id = optionsOrConditions instanceof objectIdClass ||
            typeof optionsOrConditions === "string"
            ? optionsOrConditions
            : undefined;
        const findOneOptionsOrConditions = (id ? maybeOptions : optionsOrConditions);
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        const query = this.replaceObjectIdProperty(metadata, this.convertFindOneOptionsOrConditionsToMongodbQuery(findOneOptionsOrConditions)) ?? {};
        if (id) {
            query["_id"] =
                id instanceof objectIdClass ? id : new objectIdClass(id);
        }
        const cursor = this.createEntityCursor(entityClassOrName, query);
        const deleteDateColumn = this.dataSource.getMetadata(entityClassOrName).deleteDateColumn;
        if (FindOptionsUtils_1.FindOptionsUtils.isFindOneOptions(findOneOptionsOrConditions)) {
            if (findOneOptionsOrConditions.select)
                cursor.project(this.convertFindOptionsSelectToProjectCriteria(findOneOptionsOrConditions.select, metadata));
            if (findOneOptionsOrConditions.order)
                cursor.sort(this.convertFindOptionsOrderToOrderCriteria(findOneOptionsOrConditions.order));
            if (deleteDateColumn && !findOneOptionsOrConditions.withDeleted) {
                this.filterSoftDeleted(cursor, deleteDateColumn, query);
            }
        }
        else if (deleteDateColumn) {
            this.filterSoftDeleted(cursor, deleteDateColumn, query);
        }
        // const result = await cursor.limit(1).next();
        const result = await cursor.limit(1).toArray();
        return result.length > 0 ? result[0] : null;
    }
    async executeFind(entityClassOrName, optionsOrConditions) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        const query = this.replaceObjectIdProperty(metadata, this.convertFindManyOptionsOrConditionsToMongodbQuery(optionsOrConditions));
        const cursor = this.createEntityCursor(entityClassOrName, query);
        const deleteDateColumn = metadata.deleteDateColumn;
        if (FindOptionsUtils_1.FindOptionsUtils.isFindManyOptions(optionsOrConditions)) {
            if (optionsOrConditions.select)
                cursor.project(this.convertFindOptionsSelectToProjectCriteria(optionsOrConditions.select, metadata));
            if (optionsOrConditions.skip)
                cursor.skip(optionsOrConditions.skip);
            if (optionsOrConditions.take)
                cursor.limit(optionsOrConditions.take);
            if (optionsOrConditions.order)
                cursor.sort(this.convertFindOptionsOrderToOrderCriteria(optionsOrConditions.order));
            if (deleteDateColumn && !optionsOrConditions.withDeleted) {
                this.filterSoftDeleted(cursor, deleteDateColumn, query);
            }
        }
        else if (deleteDateColumn) {
            this.filterSoftDeleted(cursor, deleteDateColumn, query);
        }
        return cursor.toArray();
    }
    /**
     * Finds entities that match given find options or conditions.
     *
     * @param entityClassOrName
     * @param optionsOrConditions
     */
    async executeFindAndCount(entityClassOrName, optionsOrConditions) {
        const metadata = this.dataSource.getMetadata(entityClassOrName);
        const query = this.replaceObjectIdProperty(metadata, this.convertFindManyOptionsOrConditionsToMongodbQuery(optionsOrConditions));
        const cursor = this.createEntityCursor(entityClassOrName, query);
        const deleteDateColumn = metadata.deleteDateColumn;
        if (FindOptionsUtils_1.FindOptionsUtils.isFindManyOptions(optionsOrConditions)) {
            if (optionsOrConditions.select)
                cursor.project(this.convertFindOptionsSelectToProjectCriteria(optionsOrConditions.select, metadata));
            if (optionsOrConditions.skip)
                cursor.skip(optionsOrConditions.skip);
            if (optionsOrConditions.take)
                cursor.limit(optionsOrConditions.take);
            if (optionsOrConditions.order)
                cursor.sort(this.convertFindOptionsOrderToOrderCriteria(optionsOrConditions.order));
            if (deleteDateColumn && !optionsOrConditions.withDeleted) {
                this.filterSoftDeleted(cursor, deleteDateColumn, query);
            }
        }
        else if (deleteDateColumn) {
            this.filterSoftDeleted(cursor, deleteDateColumn, query);
        }
        const [results, count] = await Promise.all([
            cursor.toArray(),
            this.count(entityClassOrName, query),
        ]);
        return [results, parseInt(count)];
    }
}
exports.MongoEntityManager = MongoEntityManager;
//# sourceMappingURL=MongoEntityManager.js.map