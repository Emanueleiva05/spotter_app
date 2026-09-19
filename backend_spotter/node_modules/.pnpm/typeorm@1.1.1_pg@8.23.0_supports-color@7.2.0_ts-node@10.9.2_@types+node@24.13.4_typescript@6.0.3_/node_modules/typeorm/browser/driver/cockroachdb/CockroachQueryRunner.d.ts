import type { ObjectLiteral } from "../../common/ObjectLiteral";
import type { ReadStream } from "../../platform/PlatformTools";
import { BaseQueryRunner } from "../../query-runner/BaseQueryRunner";
import type { QueryRunner } from "../../query-runner/QueryRunner";
import { Table } from "../../schema-builder/table/Table";
import { TableCheck } from "../../schema-builder/table/TableCheck";
import { TableColumn } from "../../schema-builder/table/TableColumn";
import { TableExclusion } from "../../schema-builder/table/TableExclusion";
import { TableForeignKey } from "../../schema-builder/table/TableForeignKey";
import { TableIndex } from "../../schema-builder/table/TableIndex";
import { TableUnique } from "../../schema-builder/table/TableUnique";
import { View } from "../../schema-builder/view/View";
import { Query } from "../Query";
import type { IsolationLevel } from "../types/IsolationLevel";
import type { ReplicationMode } from "../types/ReplicationMode";
import type { CockroachDriver } from "./CockroachDriver";
/**
 * Runs queries on a single postgres database connection.
 */
export declare class CockroachQueryRunner extends BaseQueryRunner implements QueryRunner {
    /**
     * Database driver used by connection.
     */
    driver: CockroachDriver;
    /**
     * Promise used to obtain a database connection for a first time.
     */
    protected databaseConnectionPromise: Promise<any>;
    /**
     * Special callback provided by a driver used to release a created connection.
     */
    protected releaseCallback?: (err: any) => void;
    /**
     * Stores all executed queries to be able to run them again if transaction fails.
     */
    protected queries: {
        query: string;
        parameters?: any[];
        useStructuredResult: boolean;
    }[];
    /**
     * Indicates if running queries must be stored
     */
    protected storeQueries: boolean;
    /**
     * Current number of transaction retries in case of 40001 error.
     */
    protected transactionRetries: number;
    constructor(driver: CockroachDriver, mode: ReplicationMode);
    /**
     * Creates/uses database connection from the connection pool to perform further operations.
     * Returns obtained database connection.
     */
    connect(): Promise<any>;
    /**
     * Release a connection back to the pool, optionally specifying an Error to release with.
     * Per pg-pool documentation this will prevent the pool from re-using the broken connection.
     *
     * @param err
     */
    private releaseConnection;
    /**
     * Releases used database connection.
     * You cannot use query runner methods once its released.
     */
    release(): Promise<void>;
    /**
     * Starts transaction.
     *
     * @param isolationLevel
     */
    startTransaction(isolationLevel?: IsolationLevel): Promise<void>;
    /**
     * Commits transaction.
     * Error will be thrown if transaction was not started.
     */
    commitTransaction(): Promise<void>;
    /**
     * Rollbacks transaction.
     * Error will be thrown if transaction was not started.
     */
    rollbackTransaction(): Promise<void>;
    /**
     * Executes a given SQL query.
     *
     * @param query
     * @param parameters
     * @param useStructuredResult
     */
    query(query: string, parameters?: any[] | ObjectLiteral, useStructuredResult?: boolean): Promise<any>;
    /**
     * Returns raw data stream.
     *
     * @param query
     * @param parameters
     * @param onEnd
     * @param onError
     */
    stream(query: string, parameters?: any[], onEnd?: Function, onError?: Function): Promise<ReadStream>;
    /**
     * Returns all available database names including system databases.
     */
    getDatabases(): Promise<string[]>;
    /**
     * Returns all available schema names including system schemas.
     * If database parameter specified, returns schemas of that database.
     *
     * @param database
     */
    getSchemas(database?: string): Promise<string[]>;
    /**
     * Checks if database with the given name exist.
     *
     * @param database
     */
    hasDatabase(database: string): Promise<boolean>;
    /**
     * Loads currently using database
     */
    getCurrentDatabase(): Promise<string>;
    /**
     * Checks if schema with the given name exist.
     *
     * @param schema
     */
    hasSchema(schema: string): Promise<boolean>;
    /**
     * Loads currently using database schema
     */
    getCurrentSchema(): Promise<string>;
    /**
     * Checks if table with the given name exist in the database.
     *
     * @param tableOrName
     */
    hasTable(tableOrName: Table | string): Promise<boolean>;
    /**
     * Checks if column with the given name exist in the given table.
     *
     * @param tableOrName
     * @param columnName
     */
    hasColumn(tableOrName: Table | string, columnName: string): Promise<boolean>;
    /**
     * Creates a new database.
     *
     * @param database
     * @param ifNotExists
     */
    createDatabase(database: string, ifNotExists?: boolean): Promise<void>;
    /**
     * Drops database.
     *
     * @param database
     * @param ifExists
     */
    dropDatabase(database: string, ifExists?: boolean): Promise<void>;
    /**
     * Creates a new table schema.
     *
     * @param schemaPath
     * @param ifNotExists
     */
    createSchema(schemaPath: string, ifNotExists?: boolean): Promise<void>;
    /**
     * Drops table schema.
     *
     * @param schemaPath
     * @param ifExists
     * @param isCascade
     */
    dropSchema(schemaPath: string, ifExists?: boolean, isCascade?: boolean): Promise<void>;
    /**
     * Creates a new table.
     *
     * @param table
     * @param ifNotExists
     * @param createForeignKeys
     * @param createIndices
     */
    createTable(table: Table, ifNotExists?: boolean, createForeignKeys?: boolean, createIndices?: boolean): Promise<void>;
    /**
     * Drops the table.
     *
     * @param target
     * @param ifExists
     * @param dropForeignKeys
     * @param dropIndices
     */
    dropTable(target: Table | string, ifExists?: boolean, dropForeignKeys?: boolean, dropIndices?: boolean): Promise<void>;
    /**
     * Creates a new view.
     *
     * @param view
     * @param syncWithMetadata
     */
    createView(view: View, syncWithMetadata?: boolean): Promise<void>;
    /**
     * Drops the view.
     *
     * @param target
     * @param ifExists
     */
    dropView(target: View | string, ifExists?: boolean): Promise<void>;
    /**
     * Renames the given table.
     *
     * @param oldTableOrName
     * @param newTableName
     */
    renameTable(oldTableOrName: Table | string, newTableName: string): Promise<void>;
    /**
     * Creates a new column from the column in the table.
     *
     * @param tableOrName
     * @param column
     */
    addColumn(tableOrName: Table | string, column: TableColumn): Promise<void>;
    /**
     * Creates a new columns from the column in the table.
     *
     * @param tableOrName
     * @param columns
     */
    addColumns(tableOrName: Table | string, columns: TableColumn[]): Promise<void>;
    /**
     * Renames column in the given table.
     *
     * @param tableOrName
     * @param oldTableColumnOrName
     * @param newTableColumnOrName
     */
    renameColumn(tableOrName: Table | string, oldTableColumnOrName: TableColumn | string, newTableColumnOrName: TableColumn | string): Promise<void>;
    /**
     * Changes a column in the table.
     *
     * @param tableOrName
     * @param oldTableColumnOrName
     * @param newColumn
     */
    changeColumn(tableOrName: Table | string, oldTableColumnOrName: TableColumn | string, newColumn: TableColumn): Promise<void>;
    /**
     * Changes a column in the table.
     *
     * @param tableOrName
     * @param changedColumns
     */
    changeColumns(tableOrName: Table | string, changedColumns: {
        newColumn: TableColumn;
        oldColumn: TableColumn;
    }[]): Promise<void>;
    /**
     * Drops column in the table.
     *
     * @param tableOrName
     * @param columnOrName
     * @param ifExists
     */
    dropColumn(tableOrName: Table | string, columnOrName: TableColumn | string, ifExists?: boolean): Promise<void>;
    /**
     * Drops the columns in the table.
     *
     * @param tableOrName
     * @param columns
     * @param ifExists
     */
    dropColumns(tableOrName: Table | string, columns: TableColumn[] | string[], ifExists?: boolean): Promise<void>;
    /**
     * Creates a new primary key.
     *
     * @param tableOrName
     * @param columnNames
     * @param constraintName
     */
    createPrimaryKey(tableOrName: Table | string, columnNames: string[], constraintName?: string): Promise<void>;
    /**
     * Updates composite primary keys.
     *
     * @param tableOrName
     * @param columns
     */
    updatePrimaryKeys(tableOrName: Table | string, columns: TableColumn[]): Promise<void>;
    /**
     * Drops a primary key.
     *
     * @param tableOrName
     * @param constraintName
     * @param ifExists
     */
    dropPrimaryKey(tableOrName: Table | string, constraintName?: string, ifExists?: boolean): Promise<void>;
    /**
     * Creates new unique constraint.
     *
     * @param tableOrName
     * @param uniqueConstraint
     */
    createUniqueConstraint(tableOrName: Table | string, uniqueConstraint: TableUnique): Promise<void>;
    /**
     * Creates new unique constraints.
     *
     * @param tableOrName
     * @param uniqueConstraints
     */
    createUniqueConstraints(tableOrName: Table | string, uniqueConstraints: TableUnique[]): Promise<void>;
    /**
     * Drops unique constraint.
     *
     * @param tableOrName
     * @param uniqueOrName
     * @param ifExists
     */
    dropUniqueConstraint(tableOrName: Table | string, uniqueOrName: TableUnique | string, ifExists?: boolean): Promise<void>;
    /**
     * Drops unique constraints.
     *
     * @param tableOrName
     * @param uniqueConstraints
     * @param ifExists
     */
    dropUniqueConstraints(tableOrName: Table | string, uniqueConstraints: TableUnique[], ifExists?: boolean): Promise<void>;
    /**
     * Creates new check constraint.
     *
     * @param tableOrName
     * @param checkConstraint
     */
    createCheckConstraint(tableOrName: Table | string, checkConstraint: TableCheck): Promise<void>;
    /**
     * Creates new check constraints.
     *
     * @param tableOrName
     * @param checkConstraints
     */
    createCheckConstraints(tableOrName: Table | string, checkConstraints: TableCheck[]): Promise<void>;
    /**
     * Drops check constraint.
     *
     * @param tableOrName
     * @param checkOrName
     * @param ifExists
     */
    dropCheckConstraint(tableOrName: Table | string, checkOrName: TableCheck | string, ifExists?: boolean): Promise<void>;
    /**
     * Drops check constraints.
     *
     * @param tableOrName
     * @param checkConstraints
     * @param ifExists
     */
    dropCheckConstraints(tableOrName: Table | string, checkConstraints: TableCheck[], ifExists?: boolean): Promise<void>;
    /**
     * Creates new exclusion constraint.
     *
     * @param tableOrName
     * @param exclusionConstraint
     */
    createExclusionConstraint(tableOrName: Table | string, exclusionConstraint: TableExclusion): Promise<void>;
    /**
     * Creates new exclusion constraints.
     *
     * @param tableOrName
     * @param exclusionConstraints
     */
    createExclusionConstraints(tableOrName: Table | string, exclusionConstraints: TableExclusion[]): Promise<void>;
    /**
     * Drops exclusion constraint.
     *
     * @param tableOrName
     * @param exclusionOrName
     * @param ifExists
     */
    dropExclusionConstraint(tableOrName: Table | string, exclusionOrName: TableExclusion | string, ifExists?: boolean): Promise<void>;
    /**
     * Drops exclusion constraints.
     *
     * @param tableOrName
     * @param exclusionConstraints
     * @param ifExists
     */
    dropExclusionConstraints(tableOrName: Table | string, exclusionConstraints: TableExclusion[], ifExists?: boolean): Promise<void>;
    /**
     * Creates a new foreign key.
     *
     * @param tableOrName
     * @param foreignKey
     */
    createForeignKey(tableOrName: Table | string, foreignKey: TableForeignKey): Promise<void>;
    /**
     * Creates a new foreign keys.
     *
     * @param tableOrName
     * @param foreignKeys
     */
    createForeignKeys(tableOrName: Table | string, foreignKeys: TableForeignKey[]): Promise<void>;
    /**
     * Drops a foreign key from the table.
     *
     * @param tableOrName
     * @param foreignKeyOrName
     * @param ifExists
     */
    dropForeignKey(tableOrName: Table | string, foreignKeyOrName: TableForeignKey | string, ifExists?: boolean): Promise<void>;
    /**
     * Drops a foreign keys from the table.
     *
     * @param tableOrName
     * @param foreignKeys
     * @param ifExists
     */
    dropForeignKeys(tableOrName: Table | string, foreignKeys: TableForeignKey[], ifExists?: boolean): Promise<void>;
    /**
     * Creates a new index.
     *
     * @param tableOrName
     * @param index
     */
    createIndex(tableOrName: Table | string, index: TableIndex): Promise<void>;
    /**
     * Creates a new indices
     *
     * @param tableOrName
     * @param indices
     */
    createIndices(tableOrName: Table | string, indices: TableIndex[]): Promise<void>;
    /**
     * Drops an index from the table.
     *
     * @param tableOrName
     * @param indexOrName
     * @param ifExists
     */
    dropIndex(tableOrName: Table | string, indexOrName: TableIndex | string, ifExists?: boolean): Promise<void>;
    /**
     * Drops an indices from the table.
     *
     * @param tableOrName
     * @param indices
     * @param ifExists
     */
    dropIndices(tableOrName: Table | string, indices: TableIndex[], ifExists?: boolean): Promise<void>;
    /**
     * Clears all table contents.
     * Note: this operation uses SQL's TRUNCATE query which cannot be reverted in transactions.
     *
     * @param tableName
     * @param options
     * @param options.cascade
     */
    clearTable(tableName: string, options?: {
        cascade?: boolean;
    }): Promise<void>;
    /**
     * Removes all tables from the currently connected database.
     */
    clearDatabase(): Promise<void>;
    protected loadViews(viewNames?: string[]): Promise<View[]>;
    /**
     * Loads all tables (with given names) from the database and creates a Table from them.
     *
     * @param tableNames
     */
    protected loadTables(tableNames?: string[]): Promise<Table[]>;
    /**
     * Builds create table sql.
     *
     * @param table
     * @param createForeignKeys
     */
    protected createTableSql(table: Table, createForeignKeys?: boolean): Query;
    /**
     * Loads Cockroachdb version.
     */
    getVersion(): Promise<string>;
    /**
     * Builds drop table sql.
     *
     * @param tableOrPath
     */
    protected dropTableSql(tableOrPath: Table | string): Query;
    protected createViewSql(view: View): Query;
    protected insertViewDefinitionSql(view: View): Promise<Query>;
    /**
     * Builds drop view sql.
     *
     * @param viewOrPath
     */
    protected dropViewSql(viewOrPath: View | string): Query;
    /**
     * Builds remove view sql.
     *
     * @param viewOrPath
     */
    protected deleteViewDefinitionSql(viewOrPath: View | string): Promise<Query>;
    /**
     * Drops ENUM type from given schemas.
     *
     * @param schemaNames
     */
    protected dropEnumTypes(schemaNames: string[]): Promise<void>;
    /**
     * Checks if enum with the given name exist in the database.
     *
     * @param table
     * @param column
     */
    protected hasEnumType(table: Table, column: TableColumn): Promise<boolean>;
    /**
     * Builds create ENUM type sql.
     *
     * @param table
     * @param column
     * @param enumName
     */
    protected createEnumTypeSql(table: Table, column: TableColumn, enumName?: string): Query;
    /**
     * Builds create ENUM type sql.
     *
     * @param table
     * @param column
     * @param enumName
     */
    protected dropEnumTypeSql(table: Table, column: TableColumn, enumName?: string): Query;
    /**
     * Builds create index sql.
     * UNIQUE indices creates as UNIQUE constraints.
     *
     * @param table
     * @param index
     */
    protected createIndexSql(table: Table, index: TableIndex): Query;
    /**
     * Builds drop index sql.
     *
     * @param table
     * @param indexOrName
     * @param ifExists
     */
    protected dropIndexSql(table: Table, indexOrName: TableIndex | TableUnique | string, ifExists?: boolean): Query;
    /**
     * Builds create primary key sql.
     *
     * @param table
     * @param columnNames
     * @param constraintName
     */
    protected createPrimaryKeySql(table: Table, columnNames: string[], constraintName?: string): Query;
    /**
     * Builds drop primary key sql.
     *
     * @param table
     * @param ifExists
     */
    protected dropPrimaryKeySql(table: Table, ifExists?: boolean): Query;
    /**
     * Builds create unique constraint sql.
     *
     * @param table
     * @param uniqueConstraint
     */
    protected createUniqueConstraintSql(table: Table, uniqueConstraint: TableUnique | TableIndex): Query;
    /**
     * Builds drop unique constraint sql.
     *
     * @param table
     * @param uniqueOrName
     */
    protected dropUniqueConstraintSql(table: Table, uniqueOrName: TableUnique | string): Query;
    /**
     * Builds create check constraint sql.
     *
     * @param table
     * @param checkConstraint
     */
    protected createCheckConstraintSql(table: Table, checkConstraint: TableCheck): Query;
    /**
     * Builds drop check constraint sql.
     *
     * @param table
     * @param checkOrName
     * @param ifExists
     */
    protected dropCheckConstraintSql(table: Table, checkOrName: TableCheck | string, ifExists?: boolean): Query;
    /**
     * Builds create foreign key sql.
     *
     * @param table
     * @param foreignKey
     */
    protected createForeignKeySql(table: Table, foreignKey: TableForeignKey): Query;
    /**
     * Builds drop foreign key sql.
     *
     * @param table
     * @param foreignKeyOrName
     * @param ifExists
     */
    protected dropForeignKeySql(table: Table, foreignKeyOrName: TableForeignKey | string, ifExists?: boolean): Query;
    /**
     * Builds sequence name from given table and column.
     *
     * @param table
     * @param columnOrName
     */
    protected buildSequenceName(table: Table, columnOrName: TableColumn | string): string;
    protected buildSequencePath(table: Table, columnOrName: TableColumn | string): string;
    /**
     * Builds ENUM type name from given table and column.
     *
     * @param table
     * @param column
     * @param withSchema
     * @param disableEscape
     * @param toOld
     */
    protected buildEnumName(table: Table, column: TableColumn, withSchema?: boolean, disableEscape?: boolean, toOld?: boolean): string;
    protected getUserDefinedTypeName(table: Table, column: TableColumn): Promise<{
        schema: any;
        name: any;
    }>;
    /**
     * Escapes a given comment so it's safe to include in a query.
     *
     * @param comment
     */
    protected escapeComment(comment?: string): string;
    /**
     * Escapes given table or view path.
     *
     * @param target
     */
    protected escapePath(target: Table | View | string): string;
    /**
     * Builds a query for create column.
     *
     * @param table
     * @param column
     */
    protected buildCreateColumnSql(table: Table, column: TableColumn): string;
    /**
     * Change table comment.
     *
     * @param tableOrName
     * @param comment
     */
    changeTableComment(tableOrName: Table | string, comment?: string): Promise<void>;
}
