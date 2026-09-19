import type { Subject } from "../Subject";
import type { QueryRunner } from "../../query-runner/QueryRunner";
/**
 * Executes subject operations for closure entities.
 */
export declare class ClosureSubjectExecutor {
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
    /**
     * Executes operations when subject is being removed.
     *
     * @param subjects
     */
    remove(subjects: Subject | Subject[]): Promise<void>;
    /**
     * Gets escaped table name with schema name if SqlServer or Postgres driver used with custom
     * schema name, otherwise returns escaped table name.
     *
     * @param tablePath
     */
    protected getTableName(tablePath: string): string;
}
