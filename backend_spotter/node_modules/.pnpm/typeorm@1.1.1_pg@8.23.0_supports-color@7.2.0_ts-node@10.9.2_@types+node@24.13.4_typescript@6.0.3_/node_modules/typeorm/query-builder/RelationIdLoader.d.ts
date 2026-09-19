import type { RelationMetadata } from "../metadata/RelationMetadata";
import type { DataSource } from "../data-source/DataSource";
import type { ObjectLiteral } from "../common/ObjectLiteral";
import type { SelectQueryBuilder } from "./SelectQueryBuilder";
import type { QueryRunner } from "../query-runner/QueryRunner";
/**
 * Loads relation ids for the given entities.
 */
export declare class RelationIdLoader {
    private dataSource;
    protected queryRunner?: QueryRunner | undefined;
    private readonly loadEagerRelations?;
    constructor(dataSource: DataSource, queryRunner?: QueryRunner | undefined, loadEagerRelations?: boolean | undefined);
    /**
     * Loads relation ids of the given entity or entities.
     *
     * @param relation
     * @param entityOrEntities
     * @param relatedEntityOrRelatedEntities
     */
    load(relation: RelationMetadata, entityOrEntities: ObjectLiteral | ObjectLiteral[], relatedEntityOrRelatedEntities?: ObjectLiteral | ObjectLiteral[]): Promise<any[]>;
    /**
     * Loads relation ids of the given entities and groups them into the object with parent and children.
     *
     * todo: extract this method?
     *
     * @param relation
     * @param entitiesOrEntities
     * @param relatedEntityOrEntities
     * @param queryBuilder
     */
    loadManyToManyRelationIdsAndGroup<E1 extends ObjectLiteral, E2 extends ObjectLiteral>(relation: RelationMetadata, entitiesOrEntities: E1 | E1[], relatedEntityOrEntities?: E2 | E2[], queryBuilder?: SelectQueryBuilder<any>): Promise<{
        entity: E1;
        related?: E2 | E2[];
    }[]>;
    /**
     * Loads relation ids for the many-to-many relation.
     *
     * @param relation
     * @param entities
     * @param relatedEntities
     */
    protected loadForManyToMany(relation: RelationMetadata, entities: ObjectLiteral[], relatedEntities?: ObjectLiteral[]): Promise<ObjectLiteral[]>;
    /**
     * Loads relation ids for the many-to-one and one-to-one owner relations.
     *
     * @param relation
     * @param entities
     * @param relatedEntities
     */
    protected loadForManyToOneAndOneToOneOwner(relation: RelationMetadata, entities: ObjectLiteral[], relatedEntities?: ObjectLiteral[]): Promise<ObjectLiteral[]>;
    /**
     * Loads relation ids for the one-to-many and one-to-one not owner relations.
     *
     * @param relation
     * @param entities
     * @param relatedEntities
     */
    protected loadForOneToManyAndOneToOneNotOwner(relation: RelationMetadata, entities: ObjectLiteral[], relatedEntities?: ObjectLiteral[]): Promise<ObjectLiteral[]>;
    /**
     * Executes a raw query and hydrates the results using driver-specific
     * value preparation based on the column metadata.
     *
     * @param qb
     * @param target
     * @param mainAlias
     * @param condition
     * @param fieldsToMetadata
     */
    private executeAndHydrateRaw;
}
