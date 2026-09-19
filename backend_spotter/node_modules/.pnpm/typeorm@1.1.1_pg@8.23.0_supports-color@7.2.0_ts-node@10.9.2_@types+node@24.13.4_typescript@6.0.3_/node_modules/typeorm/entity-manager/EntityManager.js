"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManager = void 0;
const EntityNotFoundError_1 = require("../error/EntityNotFoundError");
const QueryRunnerProviderAlreadyReleasedError_1 = require("../error/QueryRunnerProviderAlreadyReleasedError");
const NoNeedToReleaseEntityManagerError_1 = require("../error/NoNeedToReleaseEntityManagerError");
const MongoRepository_1 = require("../repository/MongoRepository");
const TreeRepository_1 = require("../repository/TreeRepository");
const Repository_1 = require("../repository/Repository");
const PlainObjectToNewEntityTransformer_1 = require("../query-builder/transformer/PlainObjectToNewEntityTransformer");
const PlainObjectToDatabaseEntityTransformer_1 = require("../query-builder/transformer/PlainObjectToDatabaseEntityTransformer");
const error_1 = require("../error");
const EntityPersistExecutor_1 = require("../persistence/EntityPersistExecutor");
const ObjectUtils_1 = require("../util/ObjectUtils");
const InstanceChecker_1 = require("../util/InstanceChecker");
const SqlTagUtils_1 = require("../util/SqlTagUtils");
const OrmUtils_1 = require("../util/OrmUtils");
/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 */
class EntityManager {
    /**
     * DataSource used by this entity manager.
     *
     * @deprecated since 1.0.0. Use {@link dataSource} instance instead.
     */
    get connection() {
        return this.dataSource;
    }
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(dataSource, queryRunner) {
        this["@instanceof"] = Symbol.for("EntityManager");
        // -------------------------------------------------------------------------
        // Protected Properties
        // -------------------------------------------------------------------------
        /**
         * Once created and then reused by repositories.
         * Created as a future replacement for the #repositories to provide a bit more perf optimization.
         */
        this.repositories = new Map();
        /**
         * Once created and then reused by repositories.
         */
        this.treeRepositories = [];
        /**
         * Plain to object transformer used in create and merge operations.
         */
        this.plainObjectToEntityTransformer = new PlainObjectToNewEntityTransformer_1.PlainObjectToNewEntityTransformer();
        this.dataSource = dataSource;
        if (queryRunner) {
            this.queryRunner = queryRunner;
            // dynamic: this.queryRunner = manager;
            ObjectUtils_1.ObjectUtils.assign(this.queryRunner, { manager: this });
        }
    }
    /**
     * Wraps given function execution (and all operations made there) in a transaction.
     * All database operations must be executed using provided entity manager.
     *
     * @param isolationOrRunInTransaction
     * @param runInTransactionParam
     */
    async transaction(isolationOrRunInTransaction, runInTransactionParam) {
        const isolation = typeof isolationOrRunInTransaction === "string"
            ? isolationOrRunInTransaction
            : undefined;
        const runInTransaction = typeof isolationOrRunInTransaction === "function"
            ? isolationOrRunInTransaction
            : runInTransactionParam;
        if (!runInTransaction) {
            throw new error_1.TypeORMError(`Transaction method requires callback in second parameter if isolation level is supplied.`);
        }
        if (this.queryRunner?.isReleased)
            throw new QueryRunnerProviderAlreadyReleasedError_1.QueryRunnerProviderAlreadyReleasedError();
        // if query runner is already defined in this class, it means this entity manager was already created for a single connection
        // if its not defined we create a new query runner - single connection where we'll execute all our operations
        const queryRunner = this.queryRunner ?? this.dataSource.createQueryRunner();
        try {
            await queryRunner.startTransaction(isolation);
            const result = await runInTransaction(queryRunner.manager);
            await queryRunner.commitTransaction();
            return result;
        }
        catch (err) {
            try {
                // we throw original error even if rollback thrown an error
                await queryRunner.rollbackTransaction();
            }
            catch (rollbackError) { }
            throw err;
        }
        finally {
            if (!this.queryRunner)
                // if we used a new query runner provider then release it
                await queryRunner.release();
        }
    }
    /**
     * Executes raw SQL query and returns raw database results.
     *
     * @param query
     * @param parameters
     * @see [Official docs](https://typeorm.io/docs/Working%20with%20Entity%20Manager/entity-manager-api/) for examples.
     */
    async query(query, parameters) {
        return this.dataSource.query(query, parameters, this.queryRunner);
    }
    /**
     * Tagged template function that executes raw SQL query and returns raw database results.
     * Template expressions are automatically transformed into database parameters.
     * Raw query execution is supported only by relational databases (MongoDB is not supported).
     * Note: Don't call this as a regular function, it is meant to be used with backticks to tag a template literal.
     *
     * @example
     * entityManager.sql`SELECT * FROM table_name WHERE id = ${id}`
     *
     * @param strings
     * @param values
     */
    async sql(strings, ...values) {
        const { query, parameters } = (0, SqlTagUtils_1.buildSqlTag)({
            driver: this.dataSource.driver,
            strings: strings,
            expressions: values,
        });
        return await this.query(query, parameters);
    }
    /**
     * Creates a new query builder that can be used to build a SQL query.
     *
     * @param entityClass
     * @param alias
     * @param queryRunner
     */
    createQueryBuilder(entityClass, alias, queryRunner) {
        if (alias) {
            return this.dataSource.createQueryBuilder(entityClass, alias, queryRunner ?? this.queryRunner);
        }
        else {
            return this.dataSource.createQueryBuilder(entityClass ??
                queryRunner ??
                this.queryRunner);
        }
    }
    /**
     * Checks if entity has an id by its Function type or schema name.
     *
     * @param targetOrEntity
     * @param maybeEntity
     */
    hasId(targetOrEntity, maybeEntity) {
        const target = arguments.length === 2 ? targetOrEntity : targetOrEntity.constructor;
        const entity = arguments.length === 2 ? maybeEntity : targetOrEntity;
        const metadata = this.dataSource.getMetadata(target);
        return metadata.hasId(entity);
    }
    /**
     * Gets entity mixed id.
     *
     * @param targetOrEntity
     * @param maybeEntity
     */
    getId(targetOrEntity, maybeEntity) {
        const target = arguments.length === 2 ? targetOrEntity : targetOrEntity.constructor;
        const entity = arguments.length === 2 ? maybeEntity : targetOrEntity;
        const metadata = this.dataSource.getMetadata(target);
        return metadata.getEntityIdMixedMap(entity);
    }
    /**
     * Creates a new entity instance or instances.
     * Can copy properties from the given object into new entities.
     *
     * @param entityClass
     * @param plainObjectOrObjects
     */
    create(entityClass, plainObjectOrObjects) {
        const metadata = this.dataSource.getMetadata(entityClass);
        if (!plainObjectOrObjects)
            return metadata.create(this.queryRunner);
        if (Array.isArray(plainObjectOrObjects))
            return plainObjectOrObjects.map((plainEntityLike) => this.create(entityClass, plainEntityLike));
        const mergeIntoEntity = metadata.create(this.queryRunner);
        this.plainObjectToEntityTransformer.transform(mergeIntoEntity, plainObjectOrObjects, metadata, true);
        return mergeIntoEntity;
    }
    /**
     * Merges two entities into one new entity.
     *
     * @param entityClass
     * @param mergeIntoEntity
     * @param entityLikes
     */
    merge(entityClass, mergeIntoEntity, ...entityLikes) {
        // todo: throw exception if entity manager is released
        const metadata = this.dataSource.getMetadata(entityClass);
        entityLikes.forEach((object) => this.plainObjectToEntityTransformer.transform(mergeIntoEntity, object, metadata));
        return mergeIntoEntity;
    }
    /**
     * Creates a new entity from the given plain javascript object. If entity already exist in the database, then
     * it loads it (and everything related to it), replaces all values with the new ones from the given object
     * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
     * replaced from the new object.
     *
     * @param entityClass
     * @param entityLike
     */
    async preload(entityClass, entityLike) {
        const metadata = this.dataSource.getMetadata(entityClass);
        const plainObjectToDatabaseEntityTransformer = new PlainObjectToDatabaseEntityTransformer_1.PlainObjectToDatabaseEntityTransformer(this.dataSource.manager);
        const transformedEntity = await plainObjectToDatabaseEntityTransformer.transform(entityLike, metadata);
        if (transformedEntity)
            return this.merge(entityClass, transformedEntity, entityLike);
        return undefined;
    }
    /**
     * Saves a given entity in the database.
     *
     * @param targetOrEntity
     * @param maybeEntityOrOptions
     * @param maybeOptions
     */
    save(targetOrEntity, maybeEntityOrOptions, maybeOptions) {
        // normalize mixed parameters
        let target = arguments.length > 1 &&
            (typeof targetOrEntity === "function" ||
                InstanceChecker_1.InstanceChecker.isEntitySchema(targetOrEntity) ||
                typeof targetOrEntity === "string")
            ? targetOrEntity
            : undefined;
        const entity = target
            ? maybeEntityOrOptions
            : targetOrEntity;
        const options = target
            ? maybeOptions
            : maybeEntityOrOptions;
        if (InstanceChecker_1.InstanceChecker.isEntitySchema(target))
            target = target.options.name;
        // if user passed empty array of entities then we don't need to do anything
        if (Array.isArray(entity) && entity.length === 0)
            return Promise.resolve(entity);
        // execute save operation
        return new EntityPersistExecutor_1.EntityPersistExecutor(this.dataSource, this.queryRunner, "save", target, entity, options)
            .execute()
            .then(() => entity);
    }
    /**
     * Removes a given entity from the database.
     *
     * @param targetOrEntity
     * @param maybeEntityOrOptions
     * @param maybeOptions
     */
    remove(targetOrEntity, maybeEntityOrOptions, maybeOptions) {
        // normalize mixed parameters
        const target = arguments.length > 1 &&
            (typeof targetOrEntity === "function" ||
                InstanceChecker_1.InstanceChecker.isEntitySchema(targetOrEntity) ||
                typeof targetOrEntity === "string")
            ? targetOrEntity
            : undefined;
        const entity = target
            ? maybeEntityOrOptions
            : targetOrEntity;
        const options = target
            ? maybeOptions
            : maybeEntityOrOptions;
        // if user passed empty array of entities then we don't need to do anything
        if (Array.isArray(entity) && entity.length === 0)
            return Promise.resolve(entity);
        // execute save operation
        return new EntityPersistExecutor_1.EntityPersistExecutor(this.dataSource, this.queryRunner, "remove", target, entity, options)
            .execute()
            .then(() => entity);
    }
    /**
     * Records the delete date of one or many given entities.
     *
     * @param targetOrEntity
     * @param maybeEntityOrOptions
     * @param maybeOptions
     */
    softRemove(targetOrEntity, maybeEntityOrOptions, maybeOptions) {
        // normalize mixed parameters
        let target = arguments.length > 1 &&
            (typeof targetOrEntity === "function" ||
                InstanceChecker_1.InstanceChecker.isEntitySchema(targetOrEntity) ||
                typeof targetOrEntity === "string")
            ? targetOrEntity
            : undefined;
        const entity = target
            ? maybeEntityOrOptions
            : targetOrEntity;
        const options = target
            ? maybeOptions
            : maybeEntityOrOptions;
        if (InstanceChecker_1.InstanceChecker.isEntitySchema(target))
            target = target.options.name;
        // if user passed empty array of entities then we don't need to do anything
        if (Array.isArray(entity) && entity.length === 0)
            return Promise.resolve(entity);
        // execute soft-remove operation
        return new EntityPersistExecutor_1.EntityPersistExecutor(this.dataSource, this.queryRunner, "soft-remove", target, entity, options)
            .execute()
            .then(() => entity);
    }
    /**
     * Recovers one or many given entities.
     *
     * @param targetOrEntity
     * @param maybeEntityOrOptions
     * @param maybeOptions
     */
    recover(targetOrEntity, maybeEntityOrOptions, maybeOptions) {
        // normalize mixed parameters
        let target = arguments.length > 1 &&
            (typeof targetOrEntity === "function" ||
                InstanceChecker_1.InstanceChecker.isEntitySchema(targetOrEntity) ||
                typeof targetOrEntity === "string")
            ? targetOrEntity
            : undefined;
        const entity = target
            ? maybeEntityOrOptions
            : targetOrEntity;
        const options = target
            ? maybeOptions
            : maybeEntityOrOptions;
        if (InstanceChecker_1.InstanceChecker.isEntitySchema(target))
            target = target.options.name;
        // if user passed empty array of entities then we don't need to do anything
        if (Array.isArray(entity) && entity.length === 0)
            return Promise.resolve(entity);
        // execute recover operation
        return new EntityPersistExecutor_1.EntityPersistExecutor(this.dataSource, this.queryRunner, "recover", target, entity, options)
            .execute()
            .then(() => entity);
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
        return this.createQueryBuilder()
            .insert()
            .into(target)
            .values(entity)
            .execute();
    }
    async upsert(target, entityOrEntities, conflictPathsOrOptions) {
        const metadata = this.dataSource.getMetadata(target);
        let options;
        if (Array.isArray(conflictPathsOrOptions)) {
            options = {
                conflictPaths: conflictPathsOrOptions,
            };
        }
        else {
            options = conflictPathsOrOptions;
        }
        let entities;
        if (!Array.isArray(entityOrEntities)) {
            entities = [entityOrEntities];
        }
        else {
            entities = entityOrEntities;
        }
        const conflictColumns = metadata.mapPropertyPathsToColumns(Array.isArray(options.conflictPaths)
            ? options.conflictPaths
            : Object.keys(options.conflictPaths));
        const overwriteColumns = metadata.columns.filter((col) => !conflictColumns.includes(col) &&
            col.isUpdate !== false &&
            !col.generatedType &&
            entities.some((entity) => typeof col.getEntityValue(entity) !== "undefined"));
        const upsertType = options.upsertType ?? this.dataSource.driver.supportedUpsertTypes[0];
        const qb = this.createQueryBuilder()
            .insert()
            .into(target)
            .values(entities)
            .orUpdate([...conflictColumns, ...overwriteColumns].map((col) => col.databaseName), conflictColumns.map((col) => col.databaseName), {
            skipUpdateIfNoValuesChanged: options.skipUpdateIfNoValuesChanged,
            indexPredicate: options.indexPredicate,
            upsertType,
        });
        if (options.returning !== undefined) {
            qb.returning(options.returning);
        }
        return qb.execute();
    }
    /**
     * Shared by update/delete/softDelete/restore. Object criteria is normalized
     * via {@link OrmUtils.normalizeWhereCriteria}, then rejected if it would
     * produce no predicate and therefore render as an always-true `WHERE 1=1` —
     * an empty object or array, an empty OR-branch, a bare primitive inside an
     * OR-array, or a keyless object. Primitive id criteria is returned untouched
     * for `whereInIds` (rejected only when wholly empty).
     *
     * @param criteria the raw criteria passed to the operation
     * @param methodName the calling method, used in the error message
     * @returns the criteria to build with, and whether to execute it via
     *   `whereInIds` (primitive) or `where` (object)
     */
    normalizeAndValidateWhereCriteria(criteria, methodName) {
        const rejectEmpty = () => {
            throw new error_1.TypeORMError(`Empty criteria(s) are not allowed for the ${methodName} method.`);
        };
        if (OrmUtils_1.OrmUtils.isPrimitiveCriteria(criteria)) {
            if (OrmUtils_1.OrmUtils.isCriteriaNullOrEmpty(criteria))
                rejectEmpty();
            return { criteria, isPrimitive: true };
        }
        const normalizedCriteria = OrmUtils_1.OrmUtils.normalizeWhereCriteria(criteria, this.dataSource.options.invalidWhereValuesBehavior);
        // On the object-criteria path, `.where()` builds a predicate only from
        // an object's own keys. Anything else yields an empty predicate list
        // that renders as an always-true `1=1`, so a criterion is unsafe unless
        // it is a non-empty object. This must reject:
        //  - primitives (a bare number/string in a mixed OR-array like
        //    `[1, { id: 2 }]` — `.where(1)` produces no predicate),
        //  - empty plain objects (`{}`), empty arrays (`[]`), and
        //  - empty non-plain objects, e.g. an empty entity instance
        //    (`new Post()`), which isCriteriaNullOrEmpty does not catch.
        // Value-type criteria (Date, Buffer) execute via the primitive branch
        // and never reach here.
        const rendersNoPredicate = (value) => value === null ||
            typeof value !== "object" ||
            Object.keys(value).length === 0;
        const isEmpty = Array.isArray(normalizedCriteria)
            ? normalizedCriteria.length === 0 ||
                normalizedCriteria.some(rendersNoPredicate)
            : rendersNoPredicate(normalizedCriteria);
        if (isEmpty)
            rejectEmpty();
        return { criteria: normalizedCriteria, isPrimitive: false };
    }
    /**
     * Updates entity partially. Entity can be found by a given condition(s).
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient UPDATE query.
     * Does not check if entity exist in the database.
     * Condition(s) cannot be empty.
     *
     * @param target
     * @param criteria
     * @param partialEntity
     * @param options
     */
    async update(target, criteria, partialEntity, options) {
        const { criteria: whereCriteria, isPrimitive } = this.normalizeAndValidateWhereCriteria(criteria, "update");
        const qb = this.createQueryBuilder().update(target).set(partialEntity);
        if (isPrimitive) {
            qb.whereInIds(whereCriteria);
        }
        else {
            qb.where(whereCriteria);
        }
        if (options?.returning !== undefined) {
            qb.returning(options.returning);
        }
        return qb.execute();
    }
    /**
     * Updates all entities of target type, setting fields from supplied partial entity.
     * This is a primitive operation without cascades, relations or other operations included.
     * Executes fast and efficient UPDATE query without WHERE clause.
     *
     * WARNING! This method updates ALL rows in the target table.
     *
     * @param target
     * @param partialEntity
     * @param options
     */
    updateAll(target, partialEntity, options) {
        const qb = this.createQueryBuilder().update(target).set(partialEntity);
        if (options?.returning !== undefined) {
            qb.returning(options.returning);
        }
        return qb.execute();
    }
    /**
     * Deletes entities by a given condition(s).
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient DELETE query.
     * Does not check if entity exist in the database.
     * Condition(s) cannot be empty.
     *
     * @param targetOrEntity
     * @param criteria
     */
    async delete(targetOrEntity, criteria) {
        const { criteria: whereCriteria, isPrimitive } = this.normalizeAndValidateWhereCriteria(criteria, "delete");
        const qb = this.createQueryBuilder().delete().from(targetOrEntity);
        return (isPrimitive ? qb.whereInIds(whereCriteria) : qb.where(whereCriteria)).execute();
    }
    /**
     * Deletes all entities of target type.
     * This is a primitive operation without cascades, relations or other operations included.
     * Executes fast and efficient DELETE query without WHERE clause.
     *
     * WARNING! This method deletes ALL rows in the target table.
     *
     * @param targetOrEntity
     */
    deleteAll(targetOrEntity) {
        return this.createQueryBuilder().delete().from(targetOrEntity).execute();
    }
    /**
     * Records the delete date of entities by a given condition(s).
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient UPDATE query.
     * Does not check if entity exist in the database.
     * Condition(s) cannot be empty.
     *
     * @param targetOrEntity
     * @param criteria
     */
    async softDelete(targetOrEntity, criteria) {
        const { criteria: whereCriteria, isPrimitive } = this.normalizeAndValidateWhereCriteria(criteria, "softDelete");
        const qb = this.createQueryBuilder().softDelete().from(targetOrEntity);
        return (isPrimitive ? qb.whereInIds(whereCriteria) : qb.where(whereCriteria)).execute();
    }
    /**
     * Restores entities by a given condition(s).
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient UPDATE query.
     * Does not check if entity exist in the database.
     * Condition(s) cannot be empty.
     *
     * @param targetOrEntity
     * @param criteria
     */
    async restore(targetOrEntity, criteria) {
        const { criteria: whereCriteria, isPrimitive } = this.normalizeAndValidateWhereCriteria(criteria, "restore");
        const qb = this.createQueryBuilder().restore().from(targetOrEntity);
        return (isPrimitive ? qb.whereInIds(whereCriteria) : qb.where(whereCriteria)).execute();
    }
    /**
     * Checks whether any entity exists with the given options.
     *
     * @param entityClass
     * @param options
     */
    async exists(entityClass, options) {
        const metadata = this.dataSource.getMetadata(entityClass);
        return this.createQueryBuilder(entityClass, metadata.name)
            .setFindOptions(options ?? {})
            .getExists();
    }
    /**
     * Checks whether any entity exists with the given conditions.
     *
     * @param entityClass
     * @param where
     */
    async existsBy(entityClass, where) {
        const metadata = this.dataSource.getMetadata(entityClass);
        return this.createQueryBuilder(entityClass, metadata.name)
            .setFindOptions({ where })
            .getExists();
    }
    /**
     * Counts entities that match given options.
     * Useful for pagination.
     *
     * @param entityClass
     * @param options
     */
    async count(entityClass, options) {
        const metadata = this.dataSource.getMetadata(entityClass);
        return this.createQueryBuilder(entityClass, metadata.name)
            .setFindOptions(options ?? {})
            .getCount();
    }
    /**
     * Counts entities that match given conditions.
     * Useful for pagination.
     *
     * @param entityClass
     * @param where
     */
    async countBy(entityClass, where) {
        const metadata = this.dataSource.getMetadata(entityClass);
        return this.createQueryBuilder(entityClass, metadata.name)
            .setFindOptions({ where })
            .getCount();
    }
    /**
     * Return the SUM of a column
     *
     * @param entityClass
     * @param columnName
     * @param where
     */
    sum(entityClass, columnName, where) {
        return this.callAggregateFun(entityClass, "SUM", columnName, where);
    }
    /**
     * Return the AVG of a column
     *
     * @param entityClass
     * @param columnName
     * @param where
     */
    average(entityClass, columnName, where) {
        return this.callAggregateFun(entityClass, "AVG", columnName, where);
    }
    /**
     * Return the MIN of a column
     *
     * @param entityClass
     * @param columnName
     * @param where
     */
    minimum(entityClass, columnName, where) {
        return this.callAggregateFun(entityClass, "MIN", columnName, where);
    }
    /**
     * Return the MAX of a column
     *
     * @param entityClass
     * @param columnName
     * @param where
     */
    maximum(entityClass, columnName, where) {
        return this.callAggregateFun(entityClass, "MAX", columnName, where);
    }
    async callAggregateFun(entityClass, fnName, columnName, where = {}) {
        const metadata = this.dataSource.getMetadata(entityClass);
        const column = metadata.columns.find((item) => item.propertyPath === columnName);
        if (!column) {
            throw new error_1.TypeORMError(`Column "${columnName}" was not found in table "${metadata.name}"`);
        }
        const qb = this.createQueryBuilder(entityClass, metadata.name);
        qb.setFindOptions({ where });
        const alias = qb.alias;
        const result = await qb
            .select(`${fnName}(${this.dataSource.driver.escape(alias)}.${this.dataSource.driver.escape(column.databaseName)})`, fnName)
            .setOption("disable-global-order")
            .getRawOne();
        return result[fnName] === null ? null : parseFloat(result[fnName]);
    }
    /**
     * Finds entities that match given find options.
     *
     * @param entityClass
     * @param options
     */
    async find(entityClass, options) {
        const metadata = this.dataSource.getMetadata(entityClass);
        return this.createQueryBuilder(entityClass, metadata.name)
            .setFindOptions(options ?? {})
            .getMany();
    }
    /**
     * Finds entities that match given find options.
     *
     * @param entityClass
     * @param where
     */
    async findBy(entityClass, where) {
        const metadata = this.dataSource.getMetadata(entityClass);
        return this.createQueryBuilder(entityClass, metadata.name)
            .setFindOptions({ where: where })
            .getMany();
    }
    /**
     * Finds entities that match given find options.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     *
     * @param entityClass
     * @param options
     */
    async findAndCount(entityClass, options) {
        const metadata = this.dataSource.getMetadata(entityClass);
        return this.createQueryBuilder(entityClass, metadata.name)
            .setFindOptions(options ?? {})
            .getManyAndCount();
    }
    /**
     * Finds entities that match given WHERE conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     *
     * @param entityClass
     * @param where
     */
    async findAndCountBy(entityClass, where) {
        const metadata = this.dataSource.getMetadata(entityClass);
        return this.createQueryBuilder(entityClass, metadata.name)
            .setFindOptions({ where })
            .getManyAndCount();
    }
    /**
     * Finds first entity by a given find options.
     * If entity was not found in the database - returns null.
     *
     * @param entityClass
     * @param options
     */
    async findOne(entityClass, options) {
        const metadata = this.dataSource.getMetadata(entityClass);
        if (!options.where) {
            throw new Error(`You must provide selection conditions in order to find a single row.`);
        }
        // create query builder and apply find options
        return this.createQueryBuilder(entityClass, metadata.name)
            .setFindOptions({
            ...options,
            take: 1,
        })
            .getOne();
    }
    /**
     * Finds first entity that matches given where condition.
     * If entity was not found in the database - returns null.
     *
     * @param entityClass
     * @param where
     */
    async findOneBy(entityClass, where) {
        const metadata = this.dataSource.getMetadata(entityClass);
        // create query builder and apply find options
        return this.createQueryBuilder(entityClass, metadata.name)
            .setFindOptions({
            where,
            take: 1,
        })
            .getOne();
    }
    /**
     * Finds first entity by a given find options.
     * If entity was not found in the database - rejects with error.
     *
     * @param entityClass
     * @param options
     */
    async findOneOrFail(entityClass, options) {
        return this.findOne(entityClass, options).then((value) => {
            if (value === null) {
                return Promise.reject(new EntityNotFoundError_1.EntityNotFoundError(entityClass, options));
            }
            return Promise.resolve(value);
        });
    }
    /**
     * Finds first entity that matches given where condition.
     * If entity was not found in the database - rejects with error.
     *
     * @param entityClass
     * @param where
     */
    async findOneByOrFail(entityClass, where) {
        return this.findOneBy(entityClass, where).then((value) => {
            if (value === null) {
                return Promise.reject(new EntityNotFoundError_1.EntityNotFoundError(entityClass, where));
            }
            return Promise.resolve(value);
        });
    }
    /**
     * Clears all the data from the given table (truncates/drops it).
     *
     * Note: this method uses TRUNCATE and may not work as you expect in transactions on some platforms.
     *
     * @param entityClass
     * @param options
     * @param options.cascade
     * @see https://stackoverflow.com/a/5972738/925151
     */
    async clear(entityClass, options) {
        const metadata = this.dataSource.getMetadata(entityClass);
        const queryRunner = this.queryRunner ?? this.dataSource.createQueryRunner();
        try {
            return await queryRunner.clearTable(metadata.tablePath, options);
        }
        finally {
            if (!this.queryRunner)
                await queryRunner.release();
        }
    }
    /**
     * Increments some column by provided value of the entities matched given conditions.
     *
     * @param entityClass
     * @param conditions
     * @param propertyPath
     * @param value
     */
    async increment(entityClass, conditions, propertyPath, value) {
        return this.incrementOrDecrementBy("increment", entityClass, conditions, propertyPath, value);
    }
    /**
     * Decrements some column by provided value of the entities matched given conditions.
     *
     * @param entityClass
     * @param conditions
     * @param propertyPath
     * @param value
     */
    async decrement(entityClass, conditions, propertyPath, value) {
        return this.incrementOrDecrementBy("decrement", entityClass, conditions, propertyPath, value);
    }
    /**
     * Shared implementation of {@link increment} and {@link decrement}: builds a
     * `column = column +/- value` UPDATE and delegates execution to {@link update},
     * so the criteria handling stays aligned with the other write methods.
     */
    incrementOrDecrementBy(operation, entityClass, conditions, propertyPath, value) {
        const metadata = this.dataSource.getMetadata(entityClass);
        const column = metadata.findColumnWithPropertyPath(propertyPath);
        if (!column)
            throw new error_1.TypeORMError(`Column ${propertyPath} was not found in ${metadata.targetName} entity.`);
        if (isNaN(Number(value)))
            throw new error_1.TypeORMError(`Value "${value}" is not a number.`);
        const operator = operation === "increment" ? "+" : "-";
        // convert possible embedded path "social.likes" into object { social: { like: () => value } }
        const values = propertyPath
            .split(".")
            .reduceRight((value, key) => ({ [key]: value }), () => this.dataSource.driver.escape(column.databaseName) +
            ` ${operator} ` +
            value);
        return this.update(entityClass, conditions, values);
    }
    /**
     * Gets repository for the given entity class or name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     *
     * @param target
     */
    getRepository(target) {
        // find already created repository instance and return it if found
        const repoFromMap = this.repositories.get(target);
        if (repoFromMap)
            return repoFromMap;
        // if repository was not found then create it, store its instance and return it
        if (this.dataSource.driver.options.type === "mongodb") {
            const newRepository = new MongoRepository_1.MongoRepository(target, this, this.queryRunner);
            this.repositories.set(target, newRepository);
            return newRepository;
        }
        else {
            const newRepository = new Repository_1.Repository(target, this, this.queryRunner);
            this.repositories.set(target, newRepository);
            return newRepository;
        }
    }
    /**
     * Gets tree repository for the given entity class or name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     *
     * @param target
     */
    getTreeRepository(target) {
        // tree tables aren't supported by some drivers (mongodb)
        if (this.dataSource.driver.treeSupport === false)
            throw new error_1.TreeRepositoryNotSupportedError(this.dataSource.driver);
        // find already created repository instance and return it if found
        const repository = this.treeRepositories.find((repository) => repository.target === target);
        if (repository)
            return repository;
        // check if repository is real tree repository
        const newRepository = new TreeRepository_1.TreeRepository(target, this, this.queryRunner);
        this.treeRepositories.push(newRepository);
        return newRepository;
    }
    /**
     * Gets mongodb repository for the given entity class.
     *
     * @param target
     */
    getMongoRepository(target) {
        return this.dataSource.getMongoRepository(target);
    }
    /**
     * Creates a new repository instance out of a given Repository and
     * sets current EntityManager instance to it. Used to work with custom repositories
     * in transactions.
     *
     * @param repository
     */
    withRepository(repository) {
        const repositoryConstructor = repository.constructor;
        const { target, manager, queryRunner, ...otherRepositoryProperties } = repository;
        return Object.assign(new repositoryConstructor(repository.target, this), {
            ...otherRepositoryProperties,
        });
    }
    /**
     * Releases all resources used by entity manager.
     * This is used when entity manager is created with a single query runner,
     * and this single query runner needs to be released after job with entity manager is done.
     */
    async release() {
        if (!this.queryRunner)
            throw new NoNeedToReleaseEntityManagerError_1.NoNeedToReleaseEntityManagerError();
        return this.queryRunner.release();
    }
}
exports.EntityManager = EntityManager;
//# sourceMappingURL=EntityManager.js.map