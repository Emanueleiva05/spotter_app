import type { RelationIdAttribute } from "./RelationIdAttribute";
import type { DataSource } from "../../data-source/DataSource";
import type { RelationIdLoadResult } from "./RelationIdLoadResult";
import type { QueryRunner } from "../../query-runner/QueryRunner";
export declare class RelationIdLoader {
    protected dataSource: DataSource;
    protected queryRunner: QueryRunner | undefined;
    protected relationIdAttributes: RelationIdAttribute[];
    protected withDeleted: boolean;
    constructor(dataSource: DataSource, queryRunner: QueryRunner | undefined, relationIdAttributes: RelationIdAttribute[], withDeleted?: boolean);
    load(rawEntities: any[]): Promise<RelationIdLoadResult[]>;
}
