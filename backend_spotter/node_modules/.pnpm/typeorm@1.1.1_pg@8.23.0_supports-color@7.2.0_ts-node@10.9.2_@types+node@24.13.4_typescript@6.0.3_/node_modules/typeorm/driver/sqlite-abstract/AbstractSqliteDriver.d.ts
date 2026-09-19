import type { ObjectLiteral } from "../../common/ObjectLiteral";
import type { BaseDataSourceOptions } from "../../data-source/BaseDataSourceOptions";
import type { DataSource } from "../../data-source/DataSource";
import type { ColumnMetadata } from "../../metadata/ColumnMetadata";
import type { EntityMetadata } from "../../metadata/EntityMetadata";
import type { QueryRunner } from "../../query-runner/QueryRunner";
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
import type { IsolationLevel } from "../types/IsolationLevel";
import type { UpsertType } from "../types/UpsertType";
type DatabasesMap = Record<string, {
    attachFilepathAbsolute: string;
    attachFilepathRelative: string;
    attachHandle: string;
}>;
/**
 * Organizes communication with sqlite DBMS.
 */
export declare abstract class AbstractSqliteDriver implements Driver {
    /**
     * Transaction isolation levels supported by this driver.
     *
     * @see https://www.sqlite.org/isolation.html
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
     * Sqlite has a single QueryRunner because it works on a single database connection.
     */
    queryRunner?: QueryRunner;
    /**
     * Real database connection with sqlite database.
     */
    databaseConnection: any;
    /**
     * DataSource options.
     */
    options: BaseDataSourceOptions;
    /**
     * Master database used to perform all write queries.
     */
    database?: string;
    /**
     * Indicates if replication is enabled.
     */
    isReplicated: boolean;
    /**
     * SQLite underlying library.
     */
    sqlite: any;
    /**
     * Indicates if tree tables are supported by this driver.
     */
    treeSupport: boolean;
    /**
     * Represent transaction support by this driver
     */
    transactionSupport: "simple" | "nested" | "none";
    /**
     * Gets list of supported column data types by a driver.
     *
     * @see https://www.tutorialspoint.com/sqlite/sqlite_data_types.htm
     * @see https://sqlite.org/datatype3.html
     */
    supportedDataTypes: ColumnType[];
    /**
     * Returns type of upsert supported by driver if any
     */
    supportedUpsertTypes: UpsertType[];
    /**
     * Gets list of column data types that support length by a driver.
     */
    withLengthColumnTypes: ColumnType[];
    /**
     * Gets list of spatial column data types.
     */
    spatialTypes: ColumnType[];
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
     * Default values of length, precision and scale depends on column data type.
     * Used in the cases when length/precision/scale is not specified by user.
     */
    dataTypeDefaults: DataTypeDefaults;
    /**
     * No documentation specifying a maximum length for identifiers could be found
     * for SQLite.
     */
    maxAliasLength?: number;
    cteCapabilities: CteCapabilities;
    /**
     * Any attached databases (excepting default 'main')
     */
    attachedDatabases: DatabasesMap;
    constructor(dataSource: DataSource);
    /**
     * Creates a query runner used to execute database queries.
     */
    abstract createQueryRunner(mode: ReplicationMode): QueryRunner;
    /**
     * Performs connection to the database.
     */
    connect(): Promise<void>;
    /**
     * Makes any action after connection (e.g. create extensions in Postgres driver).
     */
    afterConnect(): Promise<void>;
    /**
     * Closes connection with database.
     */
    disconnect(): Promise<void>;
    hasAttachedDatabases(): boolean;
    getAttachedDatabaseHandleByRelativePath(path: string): string | undefined;
    getAttachedDatabasePathRelativeByHandle(handle: string): string | undefined;
    /**
     * Creates a schema builder used to build and sync a schema.
     */
    createSchemaBuilder(): RdbmsSchemaBuilder;
    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     *
     * @param value
     * @param columnMetadata
     */
    preparePersistentValue(value: any, columnMetadata: ColumnMetadata): any;
    /**
     * Prepares given value to a value to be hydrated, based on its column type or metadata.
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
     * Build full table name with database name, schema name and table name.
     * E.g. myDB.mySchema.myTable
     *
     * Returns only simple table name because all inherited drivers does not supports schema and database.
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
     * Calculates column length taking into account the default length values.
     *
     * @param column
     */
    getColumnLength(column: ColumnMetadata): string;
    /**
     * Normalizes "default" value of the column.
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
     * @param entityIndex
     * @param entityNum
     */
    createGeneratedMap(metadata: EntityMetadata, insertResult: any, entityIndex: number, entityNum: number): ObjectLiteral | undefined;
    /**
     * Compares json/jsonb default values of the column.
     *
     * @param columnMetadata
     * @param tableColumn
     */
    private compareJsonDefaults;
    /**
     * Compares "default" value of the column.
     *
     * @param columnMetadata
     * @param tableColumn
     */
    private defaultEqual;
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
     */
    isReturningSqlSupported(): boolean;
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
     * Wraps key with json/jsonb function if required.
     *
     * @param value
     * @param column
     * @param jsonb
     */
    wrapWithJsonFunction(value: string, column: ColumnMetadata, jsonb?: boolean): string;
    /**
     * Creates connection with the database.
     */
    protected createDatabaseConnection(): Promise<any>;
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    protected loadDependencies(): void;
}
export {};
