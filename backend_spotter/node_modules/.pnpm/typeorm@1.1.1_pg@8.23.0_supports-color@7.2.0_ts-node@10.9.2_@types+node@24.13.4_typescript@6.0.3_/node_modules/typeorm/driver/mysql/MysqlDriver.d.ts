import type { ObjectLiteral } from "../../common/ObjectLiteral";
import type { DataSource } from "../../data-source/DataSource";
import type { ColumnMetadata } from "../../metadata/ColumnMetadata";
import type { EntityMetadata } from "../../metadata/EntityMetadata";
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
import type { MysqlConnectionCredentialsOptions } from "./MysqlConnectionCredentialsOptions";
import type { MysqlDataSourceOptions } from "./MysqlDataSourceOptions";
import { MysqlQueryRunner } from "./MysqlQueryRunner";
/**
 * Organizes communication with MySQL DBMS.
 */
export declare class MysqlDriver implements Driver {
    /**
     * Transaction isolation levels supported by this driver.
     *
     * @see https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html
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
     * Mysql underlying library.
     */
    mysql: any;
    /**
     * Connection pool.
     * Used in non-replication mode.
     */
    pool: any;
    /**
     * Pool cluster used in replication mode.
     */
    poolCluster: any;
    /**
     * DataSource options.
     */
    options: MysqlDataSourceOptions;
    /**
     * Version of MySQL. Requires a SQL query to the DB, so it is not always set
     */
    version?: string;
    /**
     * Master database used to perform all write queries.
     */
    database?: string;
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
     * @see https://www.tutorialspoint.com/mysql/mysql-data-types.htm
     * @see https://dev.mysql.com/doc/refman/8.0/en/data-types.html
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
     * Gets list of column data types that supports scale by a driver.
     */
    withScaleColumnTypes: ColumnType[];
    /**
     * ORM has special columns and we need to know what database column types should be for those columns.
     * Column types are driver dependant.
     */
    mappedDataTypes: MappedColumnTypes;
    /**
     * Default values of length, precision and scale depends on column data type.
     * Used in the cases when length/precision/scale is not specified by user.
     */
    dataTypeDefaults: DataTypeDefaults;
    /**
     * Max length allowed by MySQL for aliases.
     *
     * @see https://dev.mysql.com/doc/refman/5.5/en/identifiers.html
     */
    maxAliasLength: number;
    cteCapabilities: CteCapabilities;
    /**
     * Supported returning types
     */
    private readonly _isReturningSqlSupported;
    /** MariaDB supports uuid type for version 10.7.0 and up */
    private uuidColumnTypeSuported;
    constructor(dataSource: DataSource);
    /**
     * Performs connection to the database.
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
    createQueryRunner(mode: ReplicationMode): MysqlQueryRunner;
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
        type: ColumnType;
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
     * @param entityIndex
     */
    createGeneratedMap(metadata: EntityMetadata, insertResult: any, entityIndex: number): ObjectLiteral | undefined;
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
     * Loads all driver dependencies.
     */
    protected loadDependencies(): void;
    /**
     * Creates a new connection pool for a given database credentials.
     *
     * @param options
     * @param credentials
     */
    protected createConnectionOptions(options: MysqlDataSourceOptions, credentials: MysqlConnectionCredentialsOptions): Promise<any>;
    /**
     * Creates a new connection pool for a given database credentials.
     *
     * @param connectionOptions
     */
    protected createPool(connectionOptions: any): Promise<any>;
    /**
     * Attaches all required base handlers to a database connection, such as the unhandled error handler.
     *
     * @param connection
     */
    private prepareDbConnection;
    /**
     * Checks if "DEFAULT" values in the column metadata and in the database are equal.
     *
     * @param columnMetadataValue
     * @param databaseValue
     */
    protected compareDefaultValues(columnMetadataValue: string | undefined, databaseValue: string | undefined): boolean;
    compareNullableValues(columnMetadata: ColumnMetadata, tableColumn: TableColumn): boolean;
    /**
     * If parameter is a datetime function, e.g. "CURRENT_TIMESTAMP", normalizes it.
     * Otherwise returns original input.
     *
     * @param value
     */
    protected normalizeDatetimeFunction(value?: string): string | undefined;
    /**
     * Escapes a given comment.
     *
     * @param comment
     */
    protected escapeComment(comment?: string): string | undefined;
    /**
     * A helper to check if column data types have changed
     * This can be used to manage checking any types the
     * database may alias
     *
     * @param tableColumn
     * @param columnMetadata
     */
    private isColumnDataTypeChanged;
}
