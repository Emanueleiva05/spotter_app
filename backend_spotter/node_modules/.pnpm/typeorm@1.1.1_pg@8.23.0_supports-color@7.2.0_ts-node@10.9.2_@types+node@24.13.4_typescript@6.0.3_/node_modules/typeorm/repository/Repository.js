"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const SqlTagUtils_1 = require("../util/SqlTagUtils");
/**
 * Repository is supposed to work with your entity objects. Find entities, insert, update, delete, etc.
 */
class Repository {
    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------
    /**
     * Entity metadata of the entity current repository manages.
     */
    get metadata() {
        return this.manager.dataSource.getMetadata(this.target);
    }
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(target, manager, queryRunner) {
        this.target = target;
        this.manager = manager;
        this.queryRunner = queryRunner;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new query builder that can be used to build a SQL query.
     *
     * @param alias
     * @param queryRunner
     */
    createQueryBuilder(alias, queryRunner) {
        return this.manager.createQueryBuilder(this.metadata.target, alias ?? this.metadata.targetName, queryRunner ?? this.queryRunner);
    }
    /**
     * Checks if entity has an id.
     * If entity composite compose ids, it will check them all.
     *
     * @param entity
     */
    hasId(entity) {
        return this.manager.hasId(this.metadata.target, entity);
    }
    /**
     * Gets entity mixed id.
     *
     * @param entity
     */
    getId(entity) {
        return this.manager.getId(this.metadata.target, entity);
    }
    /**
     * Creates a new entity instance or instances.
     * Can copy properties from the given object into new entities.
     *
     * @param plainEntityLikeOrPlainEntityLikes
     */
    create(plainEntityLikeOrPlainEntityLikes) {
        return this.manager.create(this.metadata.target, plainEntityLikeOrPlainEntityLikes);
    }
    /**
     * Merges multiple entities (or entity-like objects) into a given entity.
     *
     * @param mergeIntoEntity
     * @param entityLikes
     */
    merge(mergeIntoEntity, ...entityLikes) {
        return this.manager.merge(this.metadata.target, mergeIntoEntity, ...entityLikes);
    }
    /**
     * Creates a new entity from the given plain javascript object. If entity already exist in the database, then
     * it loads it (and everything related to it), replaces all values with the new ones from the given object
     * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
     * replaced from the new object.
     *
     * Note that given entity-like object must have an entity id / primary key to find entity by.
     * Returns undefined if entity with given id was not found.
     *
     * @param entityLike
     */
    preload(entityLike) {
        return this.manager.preload(this.metadata.target, entityLike);
    }
    /**
     * Saves one or many given entities.
     *
     * @param entityOrEntities
     * @param options
     */
    save(entityOrEntities, options) {
        return this.manager.save(this.metadata.target, entityOrEntities, options);
    }
    /**
     * Removes one or many given entities.
     *
     * @param entityOrEntities
     * @param options
     */
    remove(entityOrEntities, options) {
        return this.manager.remove(this.metadata.target, entityOrEntities, options);
    }
    /**
     * Records the delete date of one or many given entities.
     *
     * @param entityOrEntities
     * @param options
     */
    softRemove(entityOrEntities, options) {
        return this.manager.softRemove(this.metadata.target, entityOrEntities, options);
    }
    /**
     * Recovers one or many given entities.
     *
     * @param entityOrEntities
     * @param options
     */
    recover(entityOrEntities, options) {
        return this.manager.recover(this.metadata.target, entityOrEntities, options);
    }
    /**
     * Inserts a given entity into the database.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient INSERT query.
     * Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.
     *
     * @param entity
     */
    insert(entity) {
        return this.manager.insert(this.metadata.target, entity);
    }
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient UPDATE query.
     * Does not check if entity exist in the database.
     *
     * @param criteria
     * @param partialEntity
     * @param options
     */
    update(criteria, partialEntity, options) {
        return this.manager.update(this.metadata.target, criteria, partialEntity, options);
    }
    /**
     * Updates all entities of target type, setting fields from supplied partial entity.
     * This is a primitive operation without cascades, relations or other operations included.
     * Executes fast and efficient UPDATE query without WHERE clause.
     *
     * WARNING! This method updates ALL rows in the target table.
     *
     * @param partialEntity
     * @param options
     */
    updateAll(partialEntity, options) {
        return this.manager.updateAll(this.metadata.target, partialEntity, options);
    }
    /**
     * Inserts a given entity into the database, unless a unique constraint conflicts then updates the entity
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient INSERT ... ON CONFLICT DO UPDATE/ON DUPLICATE KEY UPDATE query.
     *
     * @param entityOrEntities
     * @param conflictPathsOrOptions
     */
    upsert(entityOrEntities, conflictPathsOrOptions) {
        return this.manager.upsert(this.metadata.target, entityOrEntities, conflictPathsOrOptions);
    }
    /**
     * Deletes entities by a given criteria.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient DELETE query.
     * Does not check if entity exist in the database.
     *
     * @param criteria
     */
    delete(criteria) {
        return this.manager.delete(this.metadata.target, criteria);
    }
    /**
     * Deletes all entities of target type.
     * This is a primitive operation without cascades, relations or other operations included.
     * Executes fast and efficient DELETE query without WHERE clause.
     *
     * WARNING! This method deletes ALL rows in the target table.
     */
    deleteAll() {
        return this.manager.deleteAll(this.metadata.target);
    }
    /**
     * Records the delete date of entities by a given criteria.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient UPDATE query.
     * Does not check if entity exist in the database.
     *
     * @param criteria
     */
    softDelete(criteria) {
        return this.manager.softDelete(this.metadata.target, criteria);
    }
    /**
     * Restores entities by a given criteria.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient UPDATE query.
     * Does not check if entity exist in the database.
     *
     * @param criteria
     */
    restore(criteria) {
        return this.manager.restore(this.metadata.target, criteria);
    }
    /**
     * Checks whether any entity exists that matches the given options.
     *
     * @param options
     */
    exists(options) {
        return this.manager.exists(this.metadata.target, options);
    }
    /**
     * Checks whether any entity exists that matches the given conditions.
     *
     * @param where
     */
    existsBy(where) {
        return this.manager.existsBy(this.metadata.target, where);
    }
    /**
     * Counts entities that match given options.
     * Useful for pagination.
     *
     * @param options
     */
    count(options) {
        return this.manager.count(this.metadata.target, options);
    }
    /**
     * Counts entities that match given conditions.
     * Useful for pagination.
     *
     * @param where
     */
    countBy(where) {
        return this.manager.countBy(this.metadata.target, where);
    }
    /**
     * Return the SUM of a column
     *
     * @param columnName
     * @param where
     */
    sum(columnName, where) {
        return this.manager.sum(this.metadata.target, columnName, where);
    }
    /**
     * Return the AVG of a column
     *
     * @param columnName
     * @param where
     */
    average(columnName, where) {
        return this.manager.average(this.metadata.target, columnName, where);
    }
    /**
     * Return the MIN of a column
     *
     * @param columnName
     * @param where
     */
    minimum(columnName, where) {
        return this.manager.minimum(this.metadata.target, columnName, where);
    }
    /**
     * Return the MAX of a column
     *
     * @param columnName
     * @param where
     */
    maximum(columnName, where) {
        return this.manager.maximum(this.metadata.target, columnName, where);
    }
    /**
     * Finds entities that match given find options.
     *
     * @param options
     */
    async find(options) {
        return this.manager.find(this.metadata.target, options);
    }
    /**
     * Finds entities that match given find options.
     *
     * @param where
     */
    async findBy(where) {
        return this.manager.findBy(this.metadata.target, where);
    }
    /**
     * Finds entities that match given find options.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     *
     * @param options
     */
    findAndCount(options) {
        return this.manager.findAndCount(this.metadata.target, options);
    }
    /**
     * Finds entities that match given WHERE conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     *
     * @param where
     */
    findAndCountBy(where) {
        return this.manager.findAndCountBy(this.metadata.target, where);
    }
    /**
     * Finds first entity by a given find options.
     * If entity was not found in the database - returns null.
     *
     * @param options
     */
    async findOne(options) {
        return this.manager.findOne(this.metadata.target, options);
    }
    /**
     * Finds first entity that matches given where condition.
     * If entity was not found in the database - returns null.
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
     * Executes a raw SQL query and returns a raw database results.
     * Raw query execution is supported only by relational databases (MongoDB is not supported).
     *
     * @param query
     * @param parameters
     * @see [Official docs](https://typeorm.io/repository-api) for examples.
     */
    query(query, parameters) {
        return this.manager.query(query, parameters);
    }
    /**
     * Tagged template function that executes raw SQL query and returns raw database results.
     * Template expressions are automatically transformed into database parameters.
     * Raw query execution is supported only by relational databases (MongoDB is not supported).
     * Note: Don't call this as a regular function, it is meant to be used with backticks to tag a template literal.
     *
     * @example
     * repository.sql`SELECT * FROM table_name WHERE id = ${id}`
     *
     * @param strings
     * @param values
     */
    async sql(strings, ...values) {
        const { query, parameters } = (0, SqlTagUtils_1.buildSqlTag)({
            driver: this.manager.dataSource.driver,
            strings: strings,
            expressions: values,
        });
        return await this.query(query, parameters);
    }
    /**
     * Clears all the data from the given table/collection (truncates/drops it).
     *
     * Note: this method uses TRUNCATE and may not work as you expect in transactions on some platforms.
     *
     * @param options
     * @param options.cascade
     * @see https://stackoverflow.com/a/5972738/925151
     */
    clear(options) {
        return this.manager.clear(this.metadata.target, options);
    }
    /**
     * Increments some column by provided value of the entities matched given conditions.
     *
     * @param conditions
     * @param propertyPath
     * @param value
     */
    increment(conditions, propertyPath, value) {
        return this.manager.increment(this.metadata.target, conditions, propertyPath, value);
    }
    /**
     * Decrements some column by provided value of the entities matched given conditions.
     *
     * @param conditions
     * @param propertyPath
     * @param value
     */
    decrement(conditions, propertyPath, value) {
        return this.manager.decrement(this.metadata.target, conditions, propertyPath, value);
    }
    /**
     * Extends repository with provided functions.
     *
     * @param customs
     */
    extend(customs) {
        // return {
        //     ...this,
        //     ...custom
        // };
        const thisRepo = this.constructor;
        const { target, manager, queryRunner } = this;
        const ChildClass = class extends thisRepo {
            constructor(target, manager, queryRunner) {
                super(target, manager, queryRunner);
            }
        };
        for (const custom in customs)
            ChildClass.prototype[custom] = customs[custom];
        return new ChildClass(target, manager, queryRunner);
    }
}
exports.Repository = Repository;
//# sourceMappingURL=Repository.js.map