import type { DataSource } from "../data-source/DataSource";
import type { ObjectLiteral } from "../common/ObjectLiteral";
import type { QueryRunner } from "../query-runner/QueryRunner";
import type { RelationMetadata } from "../metadata/RelationMetadata";
import type { SelectQueryBuilder } from "./SelectQueryBuilder";
/**
 * Loads relation data for entities and provides lazy-load wrappers
 * via getters/setters.
 */
export declare class RelationLoader {
    private dataSource;
    constructor(dataSource: DataSource);
    /**
     * Loads relation data for the given entity and its relation.
     *
     * @param relation
     * @param entityOrEntities
     * @param queryRunner
     * @param queryBuilder
     * @param loadEagerRelations
     */
    load(relation: RelationMetadata, entityOrEntities: ObjectLiteral | ObjectLiteral[], queryRunner?: QueryRunner, queryBuilder?: SelectQueryBuilder<any>, loadEagerRelations?: boolean): Promise<any[]>;
    /**
     * Loads data for many-to-one and one-to-one owner relations.
     *
     * (ow) post.category<=>category.post
     * loaded: category from post
     *
     * @example
     * SELECT category.id AS category_id, category.name AS category_name FROM category category
     *     INNER JOIN post Post ON Post.category=category.id WHERE Post.id=1
     *
     * @param relation
     * @param entityOrEntities
     * @param queryRunner
     * @param queryBuilder
     * @param loadEagerRelations
     */
    loadManyToOneOrOneToOneOwner(relation: RelationMetadata, entityOrEntities: ObjectLiteral | ObjectLiteral[], queryRunner?: QueryRunner, queryBuilder?: SelectQueryBuilder<any>, loadEagerRelations?: boolean): Promise<any>;
    /**
     * Loads data for one-to-many and one-to-one not owner relations.
     *
     * SELECT post
     * FROM post post
     * WHERE post.[joinColumn.name] = entity[joinColumn.referencedColumn]
     *
     * @param relation
     * @param entityOrEntities
     * @param queryRunner
     * @param queryBuilder
     * @param loadEagerRelations
     */
    loadOneToManyOrOneToOneNotOwner(relation: RelationMetadata, entityOrEntities: ObjectLiteral | ObjectLiteral[], queryRunner?: QueryRunner, queryBuilder?: SelectQueryBuilder<any>, loadEagerRelations?: boolean): Promise<any>;
    /**
     * Loads data for many-to-many owner relations.
     *
     * SELECT category
     * FROM category category
     * INNER JOIN post_categories post_categories
     * ON post_categories.postId = :postId
     * AND post_categories.categoryId = category.id
     *
     * @param relation
     * @param entityOrEntities
     * @param queryRunner
     * @param queryBuilder
     * @param loadEagerRelations
     */
    loadManyToManyOwner(relation: RelationMetadata, entityOrEntities: ObjectLiteral | ObjectLiteral[], queryRunner?: QueryRunner, queryBuilder?: SelectQueryBuilder<any>, loadEagerRelations?: boolean): Promise<any>;
    /**
     * Loads data for many-to-many not owner relations.
     *
     * SELECT post
     * FROM post post
     * INNER JOIN post_categories post_categories
     * ON post_categories.postId = post.id
     * AND post_categories.categoryId = post_categories.categoryId
     *
     * @param relation
     * @param entityOrEntities
     * @param queryRunner
     * @param queryBuilder
     * @param loadEagerRelations
     */
    loadManyToManyNotOwner(relation: RelationMetadata, entityOrEntities: ObjectLiteral | ObjectLiteral[], queryRunner?: QueryRunner, queryBuilder?: SelectQueryBuilder<any>, loadEagerRelations?: boolean): Promise<any>;
    /**
     * Applies eager relation loading to the given query builder based on the
     * configured relation load strategy.
     *
     * @param qb
     * @param loadEagerRelations
     */
    private applyEagerRelations;
    /**
     * Wraps given entity and creates getters/setters for its given relation
     * to be able to lazily load data when accessing this relation.
     *
     * @param relation
     * @param entity
     * @param queryRunner
     */
    enableLazyLoad(relation: RelationMetadata, entity: ObjectLiteral, queryRunner?: QueryRunner): void;
}
