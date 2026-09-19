import type { ObjectLiteral } from "../common/ObjectLiteral";
import type { QueryRunner } from "../query-runner/QueryRunner";
import type { QueryExpressionMap } from "./QueryExpressionMap";
import type { ColumnMetadata } from "../metadata/ColumnMetadata";
import type { UpdateResult } from "./result/UpdateResult";
import type { InsertResult } from "./result/InsertResult";
/**
 * Updates entity with returning results in the entity insert and update operations.
 */
export declare class ReturningResultsEntityUpdator {
    protected queryRunner: QueryRunner;
    protected expressionMap: QueryExpressionMap;
    constructor(queryRunner: QueryRunner, expressionMap: QueryExpressionMap);
    /**
     * Updates entities with a special columns after updation query execution.
     *
     * @param updateResult
     * @param entities
     */
    update(updateResult: UpdateResult, entities: ObjectLiteral[]): Promise<void>;
    /**
     * Updates entities with a special columns after insertion query execution.
     *
     * @param insertResult
     * @param entities
     */
    insert(insertResult: InsertResult, entities: ObjectLiteral[]): Promise<void>;
    /**
     * Columns we need to be returned from the database when we update entity.
     */
    getUpdationReturningColumns(): ColumnMetadata[];
    /**
     * Columns we need to be returned from the database when we soft delete and restore entity.
     */
    getSoftDeletionReturningColumns(): ColumnMetadata[];
}
