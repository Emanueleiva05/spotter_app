import type { ObjectLiteral } from "../../common/ObjectLiteral";
import type { DataSource } from "../../data-source/DataSource";
import type { ColumnMetadata } from "../../metadata/ColumnMetadata";
import type { EntityMetadata } from "../../metadata/EntityMetadata";
import type { IndexMetadata } from "../../metadata/IndexMetadata";
import type { QueryRunner } from "../../query-runner/QueryRunner";
import type { TableIndexTypes } from "../../schema-builder/options/TableIndexTypes";
import { RdbmsSchemaBuilder } from "../../schema-builder/RdbmsSchemaBuilder";
import type { Table } from "../../schema-builder/table/Table";
import type { TableColumn } from "../../schema-builder/table/TableColumn";
import type { TableForeignKey } from "../../schema-builder/table/TableForeignKey";
import type { TableIndex } from "../../schema-builder/table/TableIndex";
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
import type { PostgresConnectionCredentialsOptions } from "./PostgresConnectionCredentialsOptions";
import type { PostgresDataSourceOptions } from "./PostgresDataSourceOptions";
import { PostgresQueryRunner } from "./PostgresQueryRunner";
/**
 * Organizes communication with PostgreSQL DBMS.
 */
export declare class PostgresDriver implements Driver {
    /**
     * Transaction isolation levels supported by this driver.
     *
     * @see https://www.postgresql.org/docs/current/transaction-iso.html
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
     * Postgres underlying library.
     */
    postgres: any;
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
     * We store all created query runners because we need to release them.
     */
    connectedQueryRunners: QueryRunner[];
    /**
     * DataSource options.
     */
    options: PostgresDataSourceOptions;
    /**
     * Version of Postgres. Requires a SQL query to the DB, so it is set on the first
     * connection attempt.
     */
    version?: string;
    /**
     * Database name used to perform all write queries.
     */
    database?: string;
    /**
     * Schema name used to perform all write queries.
     */
    schema?: string;
    /**
     * Schema that's used internally by Postgres for object resolution.
     *
     * Because we never set this we have to track it in separately from the `schema` so
     * we know when we have to specify the full schema or not.
     *
     * In most cases this will be `public`.
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
    transactionSupport: "nested";
    /**
     * Gets list of supported column data types by a driver.
     *
     * @see https://www.postgresql.org/docs/current/datatype.html
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
     * Table indices supported
     */
    supportedIndexTypes: TableIndexTypes[];
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
     * Max length allowed by Postgres for aliases.
     *
     * @see https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS
     */
    maxAliasLength: number;
    isGeneratedColumnsSupported: boolean;
    cteCapabilities: CteCapabilities;
    constructor(dataSource?: DataSource);
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
    protected getAvailableExtensions(connection: any): Promise<Set<string>>;
    protected enableExtensions(extensionsMetadata: any, connection: any): Promise<void>;
    protected enableCustomExtensions(availableExtensions: Set<string>, extensionsToInstall: string[], connection: any): Promise<void>;
    protected checkMetadataForExtensions(): Promise<{
        hasUuidColumns: boolean;
        hasCitextColumns: boolean;
        hasHstoreColumns: boolean;
        hasCubeColumns: boolean;
        hasGeometryColumns: boolean;
        hasLtreeColumns: boolean;
        hasVectorColumns: boolean;
        hasExclusionConstraints: boolean;
        hasExtensions: boolean;
    }>;
    /**
     * Closes connection with database.
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
    createQueryRunner(mode: ReplicationMode): PostgresQueryRunner;
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
     * Build full table name with schema name and table name.
     * E.g. myDB.mySchema.myTable
     *
     * @param tableName
     * @param schema
     */
    buildTableName(tableName: string, schema?: string): string;
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
     * Compares "default" value of the column.
     *
     * @param columnMetadata
     * @param tableColumn
     */
    private defaultEqual;
    /**
     * Compares json/jsonb default values of the column.
     *
     * @param columnMetadata
     * @param tableColumn
     */
    private compareJsonDefaults;
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
    getColumnLength(column: ColumnMetadata): string;
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
    obtainMasterConnection(): Promise<[any, Function]>;
    /**
     * Obtains a new database connection to a slave server.
     * Used for replication.
     * If replication is not setup then returns master (default) connection's database connection.
     */
    obtainSlaveConnection(): Promise<[any, Function]>;
    /**
     * Creates generated map of values generated or returned by database after INSERT query.
     *
     * todo: slow. optimize Object.keys(), OrmUtils.mergeDeep and column.createValueMap parts
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
    private lowerDefaultValueIfNecessary;
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
    get uuidGenerator(): string;
    /**
     * Creates an escaped parameter.
     *
     * @param parameterName
     * @param index
     */
    createParameter(parameterName: string, index: number): string;
    compareTableIndexTypes: (indexA: IndexMetadata, indexB: TableIndex) => boolean;
    /**
     * Loads postgres query stream package.
     */
    loadStreamDependency(): any;
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    protected loadDependencies(): void;
    /**
     * Creates a new connection pool for a given database credentials.
     *
     * @param options
     * @param credentials
     */
    protected createPool(options: PostgresDataSourceOptions, credentials: PostgresConnectionCredentialsOptions): Promise<any>;
    /**
     * Closes connection pool.
     *
     * @param pool
     */
    protected closePool(pool: any): Promise<void>;
    /**
     * Executes given query.
     *
     * @param connection
     * @param query
     */
    protected executeQuery(connection: any, query: string): Promise<unknown>;
    /**
     * If parameter is a datetime function, e.g. "CURRENT_TIMESTAMP", normalizes it.
     * Otherwise returns original input.
     *
     * @param value
     */
    protected normalizeDatetimeFunction(value: string): string;
    /**
     * Escapes a given comment.
     *
     * @param comment
     */
    protected escapeComment(comment?: string): string | undefined;
}
