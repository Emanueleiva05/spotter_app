import type { FindManyOptions } from "./FindManyOptions";
import type { FindOneOptions } from "./FindOneOptions";
import type { SelectQueryBuilder } from "../query-builder/SelectQueryBuilder";
import type { EntityMetadata } from "../metadata/EntityMetadata";
import type { FindTreeOptions } from "./FindTreeOptions";
import type { ObjectLiteral } from "../common/ObjectLiteral";
import type { RelationMetadata } from "../metadata/RelationMetadata";
/**
 * Utilities to work with FindOptions.
 */
export declare class FindOptionsUtils {
    /**
     * Throws if the removed `join` option is present on a find-options object.
     * This catches untyped/JS callers still passing `join` after its removal in v1.0.
     *
     * @param options
     */
    static rejectJoinOption(options: unknown): void;
    /**
     * Throws if the removed string-array `select` syntax is used.
     * This catches untyped/JS callers still passing `select: ["col"]` after its removal in v1.0.
     *
     * @param options
     */
    static rejectStringArraySelect(options: unknown): void;
    /**
     * Throws if the removed string-array `relations` syntax is used.
     * This catches untyped/JS callers still passing `relations: ["rel"]` after its removal in v1.0.
     *
     * @param options
     */
    static rejectStringArrayRelations(options: unknown): void;
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
    static getRelationJoinType(relation: RelationMetadata, withDeleted: boolean, parentJoinType?: "inner" | "left"): "inner" | "left";
    /**
     * Checks if given object is really instance of FindOneOptions interface.
     *
     * @param obj
     */
    static isFindOneOptions<Entity = any>(obj: any): obj is FindOneOptions<Entity>;
    /**
     * Checks if given object is really instance of FindManyOptions interface.
     *
     * @param obj
     */
    static isFindManyOptions<Entity = any>(obj: any): obj is FindManyOptions<Entity>;
    static applyOptionsToTreeQueryBuilder<T extends ObjectLiteral>(qb: SelectQueryBuilder<T>, options?: FindTreeOptions): SelectQueryBuilder<T>;
    /**
     * Adds joins for all relations and sub-relations of the given relations provided in the find options.
     *
     * @param qb
     * @param allRelations
     * @param alias
     * @param metadata
     * @param prefix
     */
    static applyRelationsRecursively(qb: SelectQueryBuilder<any>, allRelations: string[], alias: string, metadata: EntityMetadata, prefix: string): void;
    static joinEagerRelations(qb: SelectQueryBuilder<any>, alias: string, metadata: EntityMetadata, parentJoinType?: "inner" | "left"): void;
}
