import type { DataSource } from "../../data-source/DataSource";
import type { QueryRunner } from "../../query-runner/QueryRunner";
import { AbstractSqliteDriver } from "../sqlite-abstract/AbstractSqliteDriver";
import type { IsolationLevel } from "../types/IsolationLevel";
import type { ReplicationMode } from "../types/ReplicationMode";
import type { CordovaDataSourceOptions } from "./CordovaDataSourceOptions";
export declare class CordovaDriver extends AbstractSqliteDriver {
    options: CordovaDataSourceOptions;
    /** Cordova does not support transactions. */
    static readonly supportedIsolationLevels: IsolationLevel[];
    /** Isolation levels supported by this driver. */
    supportedIsolationLevels: ("READ COMMITTED" | "READ UNCOMMITTED" | "REPEATABLE READ" | "SERIALIZABLE" | "SNAPSHOT")[];
    transactionSupport: "none";
    constructor(dataSource: DataSource);
    /**
     * Closes connection with database.
     */
    disconnect(): Promise<void>;
    /**
     * Creates a query runner used to execute database queries.
     *
     * @param mode
     */
    createQueryRunner(mode: ReplicationMode): QueryRunner;
    /**
     * Creates connection with the database.
     */
    protected createDatabaseConnection(): Promise<any>;
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    protected loadDependencies(): void;
}
