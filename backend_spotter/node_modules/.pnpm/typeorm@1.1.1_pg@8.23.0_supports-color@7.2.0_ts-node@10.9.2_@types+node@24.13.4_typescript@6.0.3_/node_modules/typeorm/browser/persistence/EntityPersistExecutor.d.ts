import type { ObjectLiteral } from "../common/ObjectLiteral";
import type { SaveOptions } from "../repository/SaveOptions";
import type { RemoveOptions } from "../repository/RemoveOptions";
import type { QueryRunner } from "../query-runner/QueryRunner";
import type { DataSource } from "../data-source/DataSource";
/**
 * Persists a single entity or multiple entities - saves or removes them.
 */
export declare class EntityPersistExecutor {
    protected dataSource: DataSource;
    protected queryRunner: QueryRunner | undefined;
    protected mode: "save" | "remove" | "soft-remove" | "recover";
    protected target: Function | string | undefined;
    protected entity: ObjectLiteral | ObjectLiteral[];
    protected options?: (SaveOptions & RemoveOptions) | undefined;
    constructor(dataSource: DataSource, queryRunner: QueryRunner | undefined, mode: "save" | "remove" | "soft-remove" | "recover", target: Function | string | undefined, entity: ObjectLiteral | ObjectLiteral[], options?: (SaveOptions & RemoveOptions) | undefined);
    /**
     * Executes persistence operation ob given entity or entities.
     */
    execute(): Promise<void>;
}
