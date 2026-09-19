import type { Subject } from "../Subject";
import type { QueryRunner } from "../../query-runner/QueryRunner";
import type { ObjectLiteral } from "../../common/ObjectLiteral";
import type { EntityMetadata } from "../../metadata/EntityMetadata";
declare class NestedSetIds {
    left: number;
    right: number;
}
/**
 * Executes subject operations for nested set tree entities.
 */
export declare class NestedSetSubjectExecutor {
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
     * Get the nested set ids for a given entity
     *
     * @param metadata
     * @param ids
     */
    protected getNestedSetIds(metadata: EntityMetadata, ids: ObjectLiteral | ObjectLiteral[]): Promise<NestedSetIds[]>;
    private isUniqueRootEntity;
    /**
     * Gets escaped table name with schema name if SqlServer or Postgres driver used with custom
     * schema name, otherwise returns escaped table name.
     *
     * @param tablePath
     */
    protected getTableName(tablePath: string): string;
}
export {};
