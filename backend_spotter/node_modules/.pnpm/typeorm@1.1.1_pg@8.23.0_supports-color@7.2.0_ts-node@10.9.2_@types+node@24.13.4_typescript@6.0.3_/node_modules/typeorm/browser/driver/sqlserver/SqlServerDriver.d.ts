import type { ObjectLiteral } from "../../common/ObjectLiteral";
import type { DataSource } from "../../data-source/DataSource";
import { FindOperator } from "../../find-options/FindOperator";
import type { ColumnMetadata } from "../../metadata/ColumnMetadata";
import type { EntityMetadata } from "../../metadata/EntityMetadata";
import { RdbmsSchemaBuilder } from "../../schema-builder/RdbmsSchemaBuilder";
import type { Table } from "../../schema-builder/table/Table";
import { TableColumn } from "../../schema-builder/table/TableColumn";
import type { TableForeignKey } from "../../schema-builder/table/TableForeignKey";
import type { View } from "../../schema-builder/view/View";
import type { Driver } from "../Driver";
import type { ColumnType } from "../types/ColumnTypes";
import type { CteCapabilities } from "../types/CteCapabilities";
import type { DataTypeDefaults } from "../types/DataTypeDefaults";
import type { IsolationLevel } from "../types/IsolationLevel";
import type { MappedColumnTypes } from "../types/MappedColumnTypes";
import type { ReplicationMode } from "../types/ReplicationMode";
import type { ReturningType } from "../types/ReturningType";
import type { UpsertType } from "../types/UpsertType";
import { MssqlParameter } from "./MssqlParameter";
import type { SqlServerConnectionCredentialsOptions } from "./SqlServerConnectionCredentialsOptions";
import type { SqlServerDataSourceOptions } from "./SqlServerDataSourceOptions";
import { SqlServerQueryRunner } from "./SqlServerQueryRunner";
/**
 * Organizes communication with SQL Server DBMS.
 */
export declare class SqlServerDriver implements Driver {
    /**
     * Transaction isolation levels supported by this driver.
     *
     * @see https://learn.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql
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
     * SQL Server library.
     */
    mssql: any;
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
    options: SqlServerDataSourceOptions;
    /**
     * Database name used to perform all write queries.
     */
    database?: string;
    /**
     * Schema name used to perform all write queries.
     */
    schema?: string;
    /**
     * Schema that's used internally by SQL Server for object resolution.
     *
     * Because we never set this we have to track it in separately from the `schema` so
     * we know when we have to specify the full schema or not.
     *
     * In most cases this will be `dbo`.
     */
    searchSchema?: string;
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
    transactionSupport: "simple";
    /**
     * Gets list of supported column data types by a driver.
     *
     * @see https://docs.microsoft.com/en-us/sql/t-sql/data-types/data-types-transact-sql
     */
    supportedDataTypes: ColumnType[];
    /**
     * Returns type of upsert supported by driver if any
     */
    supportedUpsertTypes: UpsertType[];
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
    cteCapabilities: CteCapabilities;
    /**
     * Max length allowed by MSSQL Server for aliases (identifiers).
     *
     * @see https://docs.microsoft.com/en-us/sql/sql-server/maximum-capacity-specifications-for-sql-server
     */
    maxAliasLength: number;
    constructor(dataSource: DataSource);
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
     * Closes connection pool.
     *
     * @param pool
     */
    protected closePool(pool: any): Promise<void>;
    /**
     * Creates a schema builder used to build and sync a schema.
     */
    createSchemaBuilder(): RdbmsSchemaBuilder;
    /**
     * Creates a query runner used to execute database queries.
     *
     * @param mode
     */
    createQueryRunner(mode: ReplicationMode): SqlServerQueryRunner;
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
     * E.g. myDB.mySchema.myTable
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
     */
    normalizeType(column: {
        type?: ColumnType;
        length?: number | string;
        precision?: number | null;
        scale?: number;
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
     * Returns default column lengths, which is required on column creation.
     *
     * @param column
     */
    getColumnLength(column: ColumnMetadata | TableColumn): string;
    /**
     * Creates column type definition including length, precision and scale
     *
     * @param column
     */
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
     * @param returningType
     */
    isReturningSqlSupported(returningType: ReturningType): boolean;
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
     * Sql server's parameters needs to be wrapped into special object with type information about this value.
     * This method wraps given value into MssqlParameter based on its column definition.
     *
     * @param column
     * @param value
     */
    parametrizeValue(column: ColumnMetadata, value: any): MssqlParameter;
    /**
     * Recursively wraps values (including those inside FindOperators) into MssqlParameter instances,
     * ensuring correct type metadata is passed to the SQL Server driver.
     *
     * - If the value is a FindOperator containing an array, all elements are individually parametrized.
     * - If the value is a non-raw FindOperator, a transformation is applied to its internal value.
     * - Otherwise, the value is passed directly to parametrizeValue for wrapping.
     *
     * This ensures SQL Server receives properly typed parameters for queries involving operators like
     * In, MoreThan, Between, etc.
     *
     * @param column
     * @param value
     */
    parametrizeValues(column: ColumnMetadata, value: any): FindOperator<any> | MssqlParameter;
    /**
     * Sql server's parameters needs to be wrapped into special object with type information about this value.
     * This method wraps all values of the given object into MssqlParameter based on their column definitions in the given table.
     *
     * @param tablePath
     * @param map
     */
    parametrizeMap(tablePath: string, map: ObjectLiteral): ObjectLiteral;
    buildTableVariableDeclaration(identifier: string, columns: ColumnMetadata[]): string;
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    protected loadDependencies(): void;
    protected compareColumnType(tableColumn: TableColumn, columnMetadata: ColumnMetadata): boolean;
    protected compareColumnLength(tableColumn: TableColumn, columnMetadata: ColumnMetadata): boolean;
    protected lowerDefaultValueIfNecessary(value: string | undefined): string | undefined;
    /**
     * Creates a new connection pool for a given database credentials.
     *
     * @param options
     * @param credentials
     */
    protected createPool(options: SqlServerDataSourceOptions, credentials: SqlServerConnectionCredentialsOptions): Promise<any>;
    /**
     * Converts string literal of isolation level to enum.
     * The underlying mssql driver requires an enum for the isolation level.
     *
     * @param isolation
     */
    convertIsolationLevel(isolation: IsolationLevel): number;
}
