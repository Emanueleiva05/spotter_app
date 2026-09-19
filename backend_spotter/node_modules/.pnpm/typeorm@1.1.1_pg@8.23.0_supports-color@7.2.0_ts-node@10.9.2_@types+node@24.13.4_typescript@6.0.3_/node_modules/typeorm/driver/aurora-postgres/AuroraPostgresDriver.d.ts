import type { DataSource } from "../../data-source/DataSource";
import type { ColumnMetadata } from "../../metadata/ColumnMetadata";
import { PostgresDriver } from "../postgres/PostgresDriver";
import type { IsolationLevel } from "../types/IsolationLevel";
import type { ReplicationMode } from "../types/ReplicationMode";
import type { AuroraPostgresDataSourceOptions } from "./AuroraPostgresDataSourceOptions";
import { AuroraPostgresQueryRunner } from "./AuroraPostgresQueryRunner";
declare abstract class PostgresWrapper extends PostgresDriver {
    options: any;
    abstract createQueryRunner(mode: ReplicationMode): any;
}
export declare class AuroraPostgresDriver extends PostgresWrapper {
    /**
     * Transaction isolation levels supported by this driver.
     *
     * @see https://www.postgresql.org/docs/current/transaction-iso.html
     */
    static readonly supportedIsolationLevels: IsolationLevel[];
    /** Isolation levels supported by this driver. */
    supportedIsolationLevels: ("READ COMMITTED" | "READ UNCOMMITTED" | "REPEATABLE READ" | "SERIALIZABLE" | "SNAPSHOT")[];
    /**
     * Aurora Data API underlying library.
     */
    DataApiDriver: any;
    client: any;
    /**
     * Represent transaction support by this driver
     */
    transactionSupport: "nested";
    /**
     * DataSource options.
     */
    options: AuroraPostgresDataSourceOptions;
    /**
     * Master database used to perform all write queries.
     */
    database?: string;
    constructor(dataSource: DataSource);
    /**
     * Performs connection to the database.
     * Based on pooling options, it can either create connection immediately,
     * either create a pool and create connection when needed.
     */
    connect(): Promise<void>;
    /**
     * Closes connection with database.
     */
    disconnect(): Promise<void>;
    /**
     * Creates a query runner used to execute database queries.
     *
     * @param mode
     */
    createQueryRunner(mode: ReplicationMode): AuroraPostgresQueryRunner;
    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     *
     * @param value
     * @param columnMetadata
     */
    preparePersistentValue(value: any, columnMetadata: ColumnMetadata): any;
    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     *
     * @param value
     * @param columnMetadata
     */
    prepareHydratedValue(value: any, columnMetadata: ColumnMetadata): any;
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    protected loadDependencies(): void;
    /**
     * Executes given query.
     *
     * @param connection
     * @param query
     */
    protected executeQuery(connection: any, query: string): Promise<any>;
    /**
     * Makes any action after connection (e.g. create extensions in Postgres driver).
     */
    afterConnect(): Promise<void>;
}
export {};
