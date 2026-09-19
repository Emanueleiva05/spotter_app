"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindOptionsUtils = void 0;
const error_1 = require("../error");
const DriverUtils_1 = require("../driver/DriverUtils");
const error_2 = require("../error");
/**
 * Utilities to work with FindOptions.
 */
class FindOptionsUtils {
    // -------------------------------------------------------------------------
    // Public Static Methods
    // -------------------------------------------------------------------------
    /**
     * Throws if the removed `join` option is present on a find-options object.
     * This catches untyped/JS callers still passing `join` after its removal in v1.0.
     *
     * @param options
     */
    static rejectJoinOption(options) {
        if (options &&
            typeof options === "object" &&
            "join" in options &&
            options.join != null) {
            throw new error_2.TypeORMError(`"join" option has been removed. Use "relations" for left joins ` +
                `or QueryBuilder for other join types. See the v1 migration guide for details.`);
        }
    }
    /**
     * Throws if the removed string-array `select` syntax is used.
     * This catches untyped/JS callers still passing `select: ["col"]` after its removal in v1.0.
     *
     * @param options
     */
    static rejectStringArraySelect(options) {
        if (options &&
            typeof options === "object" &&
            "select" in options &&
            Array.isArray(options.select)) {
            throw new error_2.TypeORMError(`String-array "select" syntax has been removed. ` +
                `Use object syntax instead, e.g. select: { id: true, name: true }. ` +
                `See the v1 migration guide for details.`);
        }
    }
    /**
     * Throws if the removed string-array `relations` syntax is used.
     * This catches untyped/JS callers still passing `relations: ["rel"]` after its removal in v1.0.
     *
     * @param options
     */
    static rejectStringArrayRelations(options) {
        if (options &&
            typeof options === "object" &&
            "relations" in options &&
            Array.isArray(options.relations)) {
            throw new error_2.TypeORMError(`String-array "relations" syntax has been removed. ` +
                `Use object syntax instead, e.g. relations: { profile: true, posts: true }. ` +
                `See the v1 migration guide for details.`);
        }
    }
    /**
     * Determines the join type for a relation based on nullability,
     * join column ownership, and soft-delete configuration.
     *
     * Uses INNER JOIN only when:
     * - The relation is non-nullable (nullable=false)
     * - The relation owns the join column (ManyToOne or OneToOne owner)
     * - The target entity has no soft-delete column, or withDeleted is enabled
     *
     * @param relation
     * @param withDeleted
     * @param parentJoinType
     */
    static getRelationJoinType(relation, withDeleted, parentJoinType = "inner") {
        // If the parent was LEFT-joined, all descendants must also be LEFT
        // to avoid filtering out rows where the parent alias is NULL
        if (parentJoinType === "left") {
            return "left";
        }
        if (!relation.isNullable && relation.isWithJoinColumn) {
            const hasSoftDelete = relation.inverseEntityMetadata.deleteDateColumn;
            if (!hasSoftDelete || withDeleted) {
                return "inner";
            }
        }
        return "left";
    }
    /**
     * Checks if given object is really instance of FindOneOptions interface.
     *
     * @param obj
     */
    static isFindOneOptions(obj) {
        const possibleOptions = obj;
        return (possibleOptions &&
            (Array.isArray(possibleOptions.select) ||
                Array.isArray(possibleOptions.relations) ||
                typeof possibleOptions.select === "object" ||
                typeof possibleOptions.relations === "object" ||
                typeof possibleOptions.where === "object" ||
                typeof possibleOptions.order === "object" ||
                typeof possibleOptions.cache === "object" ||
                typeof possibleOptions.cache === "boolean" ||
                typeof possibleOptions.cache === "number" ||
                typeof possibleOptions.comment === "string" ||
                typeof possibleOptions.lock === "object" ||
                typeof possibleOptions.loadRelationIds === "object" ||
                typeof possibleOptions.loadRelationIds === "boolean" ||
                typeof possibleOptions.loadEagerRelations === "boolean" ||
                typeof possibleOptions.withDeleted === "boolean" ||
                typeof possibleOptions.relationLoadStrategy === "string" ||
                typeof possibleOptions.transaction === "boolean"));
    }
    /**
     * Checks if given object is really instance of FindManyOptions interface.
     *
     * @param obj
     */
    static isFindManyOptions(obj) {
        const possibleOptions = obj;
        return (possibleOptions &&
            (this.isFindOneOptions(possibleOptions) ||
                typeof possibleOptions.skip ===
                    "number" ||
                typeof possibleOptions.take ===
                    "number" ||
                typeof possibleOptions.skip ===
                    "string" ||
                typeof possibleOptions.take ===
                    "string"));
    }
    static applyOptionsToTreeQueryBuilder(qb, options) {
        if (options?.relations) {
            // Copy because `applyRelationsRecursively` modifies it
            const allRelations = [...options.relations];
            FindOptionsUtils.applyRelationsRecursively(qb, allRelations, qb.expressionMap.mainAlias.name, qb.expressionMap.mainAlias.metadata, "");
            // recursive removes found relations from allRelations array
            // if there are relations left in this array it means those relations were not found in the entity structure
            // so, we give an exception about not found relations
            if (allRelations.length > 0)
                throw new error_1.FindRelationsNotFoundError(allRelations);
        }
        return qb;
    }
    // -------------------------------------------------------------------------
    // Protected Static Methods
    // -------------------------------------------------------------------------
    /**
     * Adds joins for all relations and sub-relations of the given relations provided in the find options.
     *
     * @param qb
     * @param allRelations
     * @param alias
     * @param metadata
     * @param prefix
     */
    static applyRelationsRecursively(qb, allRelations, alias, metadata, prefix) {
        // find all relations that match given prefix
        let matchedBaseRelations;
        if (prefix) {
            const regexp = new RegExp("^" + prefix.replace(".", "\\.") + "\\.");
            matchedBaseRelations = allRelations
                .filter((relation) => relation.match(regexp))
                .map((relation) => metadata.findRelationWithPropertyPath(relation.replace(regexp, "")))
                .filter((entity) => entity);
        }
        else {
            matchedBaseRelations = allRelations
                .map((relation) => metadata.findRelationWithPropertyPath(relation))
                .filter((entity) => entity);
        }
        // go through all matched relations and add join for them
        matchedBaseRelations.forEach((relation) => {
            // generate a relation alias
            const relationAlias = DriverUtils_1.DriverUtils.buildAlias(qb.dataSource.driver, { joiner: "__" }, alias, relation.propertyPath);
            // add a join for the found relation
            const selection = alias + "." + relation.propertyPath;
            if (qb.expressionMap.relationLoadStrategy === "query") {
                qb.concatRelationMetadata(relation);
            }
            else if (this.getRelationJoinType(relation, qb.expressionMap.withDeleted) === "inner") {
                qb.innerJoinAndSelect(selection, relationAlias);
            }
            else {
                qb.leftJoinAndSelect(selection, relationAlias);
            }
            // remove added relations from the allRelations array, this is needed to find all not found relations at the end
            allRelations.splice(allRelations.indexOf(prefix
                ? prefix + "." + relation.propertyPath
                : relation.propertyPath), 1);
            // try to find sub-relations
            let relationMetadata;
            let relationName;
            if (qb.expressionMap.relationLoadStrategy === "query") {
                relationMetadata = relation.inverseEntityMetadata;
                relationName = relationAlias;
            }
            else {
                const join = qb.expressionMap.joinAttributes.find((join) => join.entityOrProperty === selection);
                relationMetadata = join.metadata;
                relationName = join.alias.name;
            }
            if (!relationName || !relationMetadata) {
                throw new error_2.EntityPropertyNotFoundError(relation.propertyPath, metadata);
            }
            this.applyRelationsRecursively(qb, allRelations, relationName, relationMetadata, prefix
                ? prefix + "." + relation.propertyPath
                : relation.propertyPath);
            // join the eager relations of the found relation
            // Only supported for "join" relationLoadStrategy
            if (qb.expressionMap.relationLoadStrategy === "join") {
                const relMetadata = metadata.relations.find((metadata) => metadata.propertyName === relation.propertyPath);
                if (relMetadata) {
                    this.joinEagerRelations(qb, relationAlias, relMetadata.inverseEntityMetadata);
                }
            }
        });
    }
    static joinEagerRelations(qb, alias, metadata, parentJoinType = "inner") {
        metadata.eagerRelations.forEach((relation) => {
            // generate a relation alias
            let relationAlias = DriverUtils_1.DriverUtils.buildAlias(qb.dataSource.driver, { joiner: "__" }, alias, relation.propertyName);
            // add a join for the relation
            // Checking whether the relation wasn't joined yet.
            let addJoin = true;
            for (const join of qb.expressionMap.joinAttributes) {
                if (join.mapToProperty !== undefined ||
                    join.isMappingMany !== undefined ||
                    (join.direction !== "LEFT" && join.direction !== "INNER") ||
                    join.entityOrProperty !==
                        `${alias}.${relation.propertyPath}`) {
                    continue;
                }
                addJoin = false;
                relationAlias = join.alias.name;
                break;
            }
            const joinAlreadyAdded = Boolean(qb.expressionMap.joinAttributes.find((joinAttribute) => joinAttribute.alias.name === relationAlias));
            let joinType = "left";
            if (addJoin && !joinAlreadyAdded) {
                joinType = this.getRelationJoinType(relation, qb.expressionMap.withDeleted, parentJoinType);
                if (joinType === "inner") {
                    qb.innerJoin(alias + "." + relation.propertyPath, relationAlias);
                }
                else {
                    qb.leftJoin(alias + "." + relation.propertyPath, relationAlias);
                }
            }
            else {
                // Derive join type from existing join for propagation
                const existingJoin = qb.expressionMap.joinAttributes.find((j) => j.alias.name === relationAlias);
                if (existingJoin) {
                    joinType =
                        existingJoin.direction === "INNER" ? "inner" : "left";
                }
            }
            // Checking whether the relation wasn't selected yet.
            // This check shall be after the join check to detect relationAlias.
            let addSelect = true;
            for (const select of qb.expressionMap.selects) {
                if (select.aliasName !== undefined ||
                    select.virtual !== undefined ||
                    select.selection !== relationAlias) {
                    continue;
                }
                addSelect = false;
                break;
            }
            if (addSelect) {
                qb.addSelect(relationAlias);
            }
            // (recursive) join the eager relations
            this.joinEagerRelations(qb, relationAlias, relation.inverseEntityMetadata, joinType);
        });
    }
}
exports.FindOptionsUtils = FindOptionsUtils;
//# sourceMappingURL=FindOptionsUtils.js.map