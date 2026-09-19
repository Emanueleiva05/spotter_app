import type { ObjectLiteral } from "../../common/ObjectLiteral";
import type { DataSource } from "../../data-source/DataSource";
import type { DataSourceOptions } from "../../data-source/DataSourceOptions";
import type { ColumnMetadata } from "../../metadata/ColumnMetadata";
import type { EntityMetadata } from "../../metadata/EntityMetadata";
import { MongoSchemaBuilder } from "../../schema-builder/MongoSchemaBuilder";
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
import type { MongoDataSourceOptions } from "./MongoDataSourceOptions";
import { MongoQueryRunner } from "./MongoQueryRunner";
/**
 * Organizes communication with MongoDB.
 */
export declare class MongoDriver implements Driver {
    protected dataSource: DataSource;
    /**
     * Transaction isolation levels supported by this driver.
     */
    static readonly supportedIsolationLevels: IsolationLevel[];
    /**
     * Isolation levels supported by this driver.
     */
    supportedIsolationLevels: ("READ COMMITTED" | "READ UNCOMMITTED" | "REPEATABLE READ" | "SERIALIZABLE" | "SNAPSHOT")[];
    /**
     * Underlying mongodb library.
     */
    mongodb: any;
    /**
     * Mongodb does not require to dynamically create query runner each time,
     * because it does not have a regular connection pool as RDBMS systems have.
     */
    queryRunner?: MongoQueryRunner;
    /**
     * DataSource options.
     */
    options: MongoDataSourceOptions;
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
    transactionSupport: "none";
    /**
     * Mongodb does not need to have column types because they are not used in schema sync.
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
     * Mongodb does not need to have a strong defined mapped column types because they are not used in schema sync.
     */
    mappedDataTypes: MappedColumnTypes;
    /**
     * Default values of length, precision and scale depends on column data type.
     * Used in the cases when length/precision/scale is not specified by user.
     */
    dataTypeDefaults: DataTypeDefaults;
    /**
     * No documentation specifying a maximum length for identifiers could be found
     * for MongoDB.
     */
    maxAliasLength?: number;
    cteCapabilities: CteCapabilities;
    /**
     * Valid mongo connection options
     * NOTE: Keep in sync with MongoConnectionOptions
     */
    protected validOptionNames: string[];
    constructor(dataSource: DataSource);
    /**
     * Performs connection to the database.
     */
    connect(): Promise<void>;
    afterConnect(): Promise<void>;
    /**
     * Closes connection with the database.
     */
    disconnect(): Promise<void>;
    /**
     * Creates a schema builder used to build and sync a schema.
     */
    createSchemaBuilder(): MongoSchemaBuilder;
    /**
     * Creates a query runner used to execute database queries.
     *
     * @param mode
     */
    createQueryRunner(mode: ReplicationMode): MongoQueryRunner;
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
        tableName: string;
        schema?: string;
        database?: string;
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
     * @param insertedId
     */
    createGeneratedMap(metadata: EntityMetadata, insertedId: any): ObjectLiteral;
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
     * Validate driver options to make sure everything is correct and driver will be able to establish connection.
     *
     * @param options
     */
    protected validateOptions(options: DataSourceOptions): void;
    /**
     * Loads all driver dependencies.
     */
    protected loadDependencies(): any;
    /**
     * Builds connection url that is passed to underlying driver to perform connection to the mongodb database.
     */
    protected buildConnectionUrl(options: {
        [key: string]: any;
    }): string;
    /**
     * Build connection options from MongoConnectionOptions
     */
    protected buildConnectionOptions(options: {
        [key: string]: any;
    }): any;
}
