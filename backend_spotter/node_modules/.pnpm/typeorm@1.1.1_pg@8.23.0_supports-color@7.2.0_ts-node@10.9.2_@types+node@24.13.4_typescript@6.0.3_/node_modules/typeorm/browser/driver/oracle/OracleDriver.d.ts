import type { ObjectLiteral } from "../../common/ObjectLiteral";
import type { DataSource } from "../../data-source/DataSource";
import type { ColumnMetadata } from "../../metadata/ColumnMetadata";
import type { EntityMetadata } from "../../metadata/EntityMetadata";
import type { OnDeleteType } from "../../metadata/types/OnDeleteType";
import type { OnUpdateType } from "../../metadata/types/OnUpdateType";
import { RdbmsSchemaBuilder } from "../../schema-builder/RdbmsSchemaBuilder";
import type { Table } from "../../schema-builder/table/Table";
import type { TableColumn } from "../../schema-builder/table/TableColumn";
import type { TableForeignKey } from "../../schema-builder/table/TableForeignKey";
import type { View } from "../../schema-builder/view/View";
import type { Driver } from "../Driver";
import type { ColumnType } from "../types/ColumnTypes";
import type { CteCapabilities } from "../types/CteCapabilities";
import type { DataTypeDefaults } from "../types/DataTypeDefaults";
import type { MappedColumnTypes } from "../types/MappedColumnTypes";
import type { ReplicationMode } from "../types/ReplicationMode";
import type { ReturningType } from "../types/ReturningType";
import type { IsolationLevel } from "../types/IsolationLevel";
import type { UpsertType } from "../types/UpsertType";
import type { OracleConnectionCredentialsOptions } from "./OracleConnectionCredentialsOptions";
import type { OracleDataSourceOptions } from "./OracleDataSourceOptions";
import { OracleQueryRunner } from "./OracleQueryRunner";
/**
 * Organizes communication with Oracle RDBMS.
 */
export declare class OracleDriver implements Driver {
    /**
     * Transaction isolation levels supported by this driver.
     *
     * @see https://docs.oracle.com/en/database/oracle/oracle-database/23/cncpt/data-concurrency-and-consistency.html
     */
    static readonly supportedIsolationLevels: IsolationLevel[];
    /**
     * DataSource used by the driver.
     */
    dataSource: DataSource;
    /**
     * Isolation levels supported by this driver.
     */
    supportedIsolationLevels: ("READ COMMITTED" | "READ UNCOMMITTED" | "REPEATABLE READ" | "SERIALIZABLE" | "SNAPSHOT")[];
    /**
     * DataSource used by the driver.
     *
     * @deprecated since 1.0.0. Use {@link dataSource} instance instead.
     */
    get connection(): DataSource;
    /**
     * Underlying oracle library.
     */
    oracle: any;
    /**
     * Pool for master database.
     */
    master: any;
    /**
     * Pool for slave databases.
     * Used in replication.
     */
    slaves: any[];
    /**
     * DataSource options.
     */
    options: OracleDataSourceOptions;
    /**
     * Database name used to perform all write queries.
     */
    database?: string;
    /**
     * Schema name used to perform all write queries.
     */
    schema?: string;
    /**
     * Indicates if replication is enabled.
     */
    isReplicated: boolean;
    /**
     * Indicates if tree tables are supported by this driver.
     */
    treeSupport: boolean;
    /**
     * Represent transaction support by this driver
     */
    transactionSupport: "nested";
    /**
     * Gets list of supported column data types by a driver.
     *
     * @see https://www.techonthenet.com/oracle/datatypes.php
     * @see https://docs.oracle.com/cd/B28359_01/server.111/b28318/datatype.htm#CNCPT012
     */
    supportedDataTypes: ColumnType[];
    /**
     * Returns type of upsert supported by driver if any
     */
    supportedUpsertTypes: UpsertType[];
    /**
     * Returns list of supported onDelete types by driver.
     * https://docs.oracle.com/en/database/oracle/oracle-database/21/sqlrf/sql-language-reference.pdf
     * Oracle does not support NO ACTION, but NO ACTION is set by default in EntityMetadata
     */
    supportedOnDeleteTypes: OnDeleteType[];
    /**
     * Returns list of supported onUpdate types by driver.
     * Oracle does not have onUpdate option, but we allow NO ACTION since it is set by default in EntityMetadata
     */
    supportedOnUpdateTypes: OnUpdateType[];
    /**
     * Gets list of spatial column data types.
     */
    spatialTypes: ColumnType[];
    /**
     * Gets list of column data types that support length by a driver.
     */
    withLengthColumnTypes: ColumnType[];
    /**
     * Gets list of column data types that support precision by a driver.
     */
    withPrecisionColumnTypes: ColumnType[];
    /**
     * Gets list of column data types that support scale by a driver.
     */
    withScaleColumnTypes: ColumnType[];
    /**
     * Orm has special columns and we need to know what database column types should be for those types.
     * Column types are driver dependant.
     */
    mappedDataTypes: MappedColumnTypes;
    /**
     * The prefix used for the parameters
     */
    parametersPrefix: string;
    /**
     * Default values of length, precision and scale depends on column data type.
     * Used in the cases when length/precision/scale is not specified by user.
     */
    dataTypeDefaults: DataTypeDefaults;
    /**
     * Max length allowed by Oracle for aliases.
     *
     * @see https://docs.oracle.com/database/121/SQLRF/sql_elements008.htm#SQLRF51129
     * > The following list of rules applies to both quoted and nonquoted identifiers unless otherwise indicated
     * > Names must be from 1 to 30 bytes long with these exceptions:
     * > [...]
     *
     * Since Oracle 12.2 (with a compatible driver/client), the limit has been set to 128.
     * @see https://docs.oracle.com/en/database/oracle/oracle-database/12.2/sqlrf/Database-Object-Names-and-Qualifiers.html
     *
     * > If COMPATIBLE is set to a value of 12.2 or higher, then names must be from 1 to 128 bytes long with these exceptions
     */
    maxAliasLength: number;
    cteCapabilities: CteCapabilities;
    dummyTableName: string;
    constructor(connection: DataSource);
    /**
     * Performs connection to the database.
     * Based on pooling options, it can either create connection immediately,
     * either create a pool and create connection when needed.
     */
    connect(): Promise<void>;
    /**
     * Makes any action after connection (e.g. create extensions in Postgres driver).
     */
    afterConnect(): Promise<void>;
    /**
     * Closes connection with the database.
     */
    disconnect(): Promise<void>;
    /**
     * Creates a schema builder used to build and sync a schema.
     */
    createSchemaBuilder(): RdbmsSchemaBuilder;
    /**
     * Creates a query runner used to execute database queries.
     *
     * @param mode
     */
    createQueryRunner(mode: ReplicationMode): OracleQueryRunner;
    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     *
     * @param sql
     * @param parameters
     */
    escapeQueryWithParameters(sql: string, parameters: ObjectLiteral): [string, any[]];
    /**
     * Escapes a column name.
     *
     * @param columnName
     */
    escape(columnName: string): string;
    /**
     * Build full table name with database name, schema name and table name.
     * Oracle does not support table schemas. One user can have only one schema.
     *
     * @param tableName
     * @param schema
     * @param database
     */
    buildTableName(tableName: string, schema?: string, database?: string): string;
    /**
     * Parse a target table name or other types and return a normalized table definition.
     *
     * @param target
     */
    parseTableName(target: EntityMetadata | Table | View | TableForeignKey | string): {
        database?: string;
        schema?: string;
        tableName: string;
    };
    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     *
     * @param value
     * @param columnMetadata
     */
    preparePersistentValue(value: any, columnMetadata: ColumnMetadata): any;
    /**
     * Prepares given value to a value to be persisted, based on its column type or metadata.
     *
     * @param value
     * @param columnMetadata
     */
    prepareHydratedValue(value: any, columnMetadata: ColumnMetadata): any;
    /**
     * Creates a database type from a given column metadata.
     *
     * @param column
     * @param column.type
     * @param column.length
     * @param column.precision
     * @param column.scale
     * @param column.isArray
     */
    normalizeType(column: {
        type?: ColumnType;
        length?: number | string;
        precision?: number | null;
        scale?: number;
        isArray?: boolean;
    }): string;
    /**
     * Normalizes "default" value of the column.
     *
     * @param columnMetadata
     */
    normalizeDefault(columnMetadata: ColumnMetadata): string | undefined;
    /**
     * Normalizes "isUnique" value of the column.
     *
     * @param column
     */
    normalizeIsUnique(column: ColumnMetadata): boolean;
    /**
     * Calculates column length taking into account the default length values.
     *
     * @param column
     */
    getColumnLength(column: ColumnMetadata | TableColumn): string;
    createFullType(column: TableColumn): string;
    /**
     * Obtains a new database connection to a master server.
     * Used for replication.
     * If replication is not setup then returns default connection's database connection.
     */
    obtainMasterConnection(): Promise<any>;
    /**
     * Obtains a new database connection to a slave server.
     * Used for replication.
     * If replication is not setup then returns master (default) connection's database connection.
     */
    obtainSlaveConnection(): Promise<any>;
    /**
     * Creates generated map of values generated or returned by database after INSERT query.
     *
     * @param metadata
     * @param insertResult
     */
    createGeneratedMap(metadata: EntityMetadata, insertResult: ObjectLiteral): ObjectLiteral | undefined;
    /**
     * Differentiate columns of this table and columns from the given column metadatas columns
     * and returns only changed.
     *
     * @param tableColumns
     * @param columnMetadatas
     */
    findChangedColumns(tableColumns: TableColumn[], columnMetadatas: ColumnMetadata[]): ColumnMetadata[];
    /**
     * Returns true if driver supports RETURNING / OUTPUT statement.
     *
     * @param _returningType
     */
    isReturningSqlSupported(_returningType: ReturningType): boolean;
    /**
     * Returns true if driver supports uuid values generation on its own.
     */
    isUUIDGenerationSupported(): boolean;
    /**
     * Returns true if driver supports fulltext indices.
     */
    isFullTextColumnTypeSupported(): boolean;
    /**
     * Creates an escaped parameter.
     *
     * @param parameterName
     * @param index
     */
    createParameter(parameterName: string, index: number): string;
    /**
     * Converts column type in to native oracle type.
     *
     * @param type
     */
    columnTypeToNativeParameter(type: ColumnType): any;
    /**
     * Loads all driver dependencies.
     */
    protected loadDependencies(): void;
    /**
     * Creates a new connection pool for a given database credentials.
     *
     * @param options
     * @param credentials
     */
    protected createPool(options: OracleDataSourceOptions, credentials: OracleConnectionCredentialsOptions): Promise<any>;
    /**
     * Closes connection pool.
     *
     * @param pool
     */
    protected closePool(pool: any): Promise<void>;
}
