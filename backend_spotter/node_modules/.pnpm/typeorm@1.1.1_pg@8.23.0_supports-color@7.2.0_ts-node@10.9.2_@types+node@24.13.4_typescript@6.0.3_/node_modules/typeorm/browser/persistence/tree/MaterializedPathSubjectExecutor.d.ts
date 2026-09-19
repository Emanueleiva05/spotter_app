import type { Subject } from "../Subject";
import type { QueryRunner } from "../../query-runner/QueryRunner";
/**
 * Executes subject operations for materialized-path tree entities.
 */
export declare class MaterializedPathSubjectExecutor {
    protected queryRunner: QueryRunner;
    constructor(queryRunner: QueryRunner);
    /**
     * Executes operations when subject is being inserted.
     *
     * @param subject
     */
    insert(subject: Subject): Promise<void>;
    /**
     * Executes operations when subject is being updated.
     *
     * @param subject
     */
    update(subject: Subject): Promise<void>;
    private getEntityParentReferencedColumnMap;
    private getEntityPath;
}
