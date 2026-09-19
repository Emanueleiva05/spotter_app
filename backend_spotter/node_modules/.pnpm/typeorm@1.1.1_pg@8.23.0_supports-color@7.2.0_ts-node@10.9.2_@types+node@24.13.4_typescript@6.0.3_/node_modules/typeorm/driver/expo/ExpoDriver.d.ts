import type { DataSource } from "../../data-source/DataSource";
import type { QueryRunner } from "../../query-runner/QueryRunner";
import { AbstractSqliteDriver } from "../sqlite-abstract/AbstractSqliteDriver";
import type { ExpoDataSourceOptions } from "./ExpoDataSourceOptions";
export declare class ExpoDriver extends AbstractSqliteDriver {
    options: ExpoDataSourceOptions;
    constructor(dataSource: DataSource);
    disconnect(): Promise<void>;
    createQueryRunner(): QueryRunner;
    protected createDatabaseConnection(): Promise<any>;
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    protected loadDependencies(): void;
}
