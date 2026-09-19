import type { ObjectLiteral } from "../../common/ObjectLiteral";
import type { DataSource } from "../../data-source";
import type { ColumnMetadata } from "../../metadata/ColumnMetadata";
import { EntityMetadata } from "../../metadata/EntityMetadata";
import { RdbmsSchemaBuilder } from "../../schema-builder/RdbmsSchemaBuilder";
import { Table } from "../../schema-builder/table/Table";
import type { TableColumn } from "../../schema-builder/table/TableColumn";
import { TableForeignKey } from "../../schema-builder/table/TableForeignKey";
import { View } from "../../schema-builder/view/View";
import type { Driver } from "../Driver";
import type { ColumnType } from "../types/ColumnTypes";
import type { CteCapabilities } from "../types/CteCapabilities";
import type { DataTypeDefaults } from "../types/DataTypeDefaults";
import type { IsolationLevel } from "../types/IsolationLevel";
import type { MappedColumnTypes } from "../types/MappedColumnTypes";
import type { ReplicationMode } from "../types/ReplicationMode";
import type { ReturningType } from "../types/ReturningType";
import type { UpsertType } from "../types/UpsertType";
import type { SpannerDataSourceOptions } from "./SpannerDataSourceOptions";
import { SpannerQueryRunner } from "./SpannerQueryRunner";
/**
 * Organizes communication with Spanner DBMS.
 */
export declare class SpannerDriver implements Driver {
    /**
     * Transaction isolation levels supported by this driver.
     *
     * @see https://cloud.google.com/spanner/docs/isolation-levels
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
     * Cloud Spanner underlying library.
     */
    spanner: any;
    /**
     * Cloud Spanner instance.
     */
    instance: any;
    /**
     * Cloud Spanner database.
     */
    instanceDatabase: any;
    /**
     * Database name.
     */
    database?: string;
    /**
     * DataSource options.
     */
    options: SpannerDataSourceOptions;
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
    transactionSupport: "none";
    /**
     * Gets list of supported column data types by a driver.
     *
     * @see https://cloud.google.com/spanner/docs/reference/standard-sql/data-types
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
     * The prefix used for the parameters
     */
    parametersPrefix: string;
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
    createQueryRunner(mode: ReplicationMode): SpannerQueryRunner;
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
     * Spanner does not support default values.
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
     * Loads all driver dependencies.
     */
    protected loadDependencies(): void;
    compareNullableValues(columnMetadata: ColumnMetadata, tableColumn: TableColumn): boolean;
    /**
     * Checks if "DEFAULT" values in the column metadata and in the database are equal.
     *
     * @param columnMetadataValue
     * @param databaseValue
     */
    protected compareDefaultValues(columnMetadataValue: string | undefined, databaseValue: string | undefined): boolean;
    /**
     * Escapes a given comment.
     *
     * @param comment
     */
    protected escapeComment(comment?: string): string | undefined;
}
