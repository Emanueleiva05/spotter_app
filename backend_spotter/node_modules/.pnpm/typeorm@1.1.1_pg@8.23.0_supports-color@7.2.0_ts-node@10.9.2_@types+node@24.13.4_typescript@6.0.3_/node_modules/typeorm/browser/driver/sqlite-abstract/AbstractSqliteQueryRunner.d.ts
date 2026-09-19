import type { QueryRunner } from "../../query-runner/QueryRunner";
import { TableColumn } from "../../schema-builder/table/TableColumn";
import { Table } from "../../schema-builder/table/Table";
import { TableIndex } from "../../schema-builder/table/TableIndex";
import { TableForeignKey } from "../../schema-builder/table/TableForeignKey";
import { View } from "../../schema-builder/view/View";
import { Query } from "../Query";
import type { AbstractSqliteDriver } from "./AbstractSqliteDriver";
import type { ReadStream } from "../../platform/PlatformTools";
import { TableUnique } from "../../schema-builder/table/TableUnique";
import { BaseQueryRunner } from "../../query-runner/BaseQueryRunner";
import { TableCheck } from "../../schema-builder/table/TableCheck";
import type { IsolationLevel } from "../types/IsolationLevel";
import type { TableExclusion } from "../../schema-builder/table/TableExclusion";
/**
 * Runs queries on a single sqlite database connection.
 */
export declare abstract class AbstractSqliteQueryRunner extends BaseQueryRunner implements QueryRunner {
    /**
     * Database driver used by connection.
     */
    driver: AbstractSqliteDriver;
    protected transactionPromise: Promise<any> | null;
    constructor();
    /**
     * Creates/uses database connection from the connection pool to perform further operations.
     * Returns obtained database connection.
     */
    connect(): Promise<any>;
    /**
     * Releases used database connection.
     * We just clear loaded tables and sql in memory, because sqlite do not support multiple connections thus query runners.
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
    getCurrentDatabase(): Promise<undefined>;
    /**
     * Checks if schema with the given name exist.
     *
     * @param schema
     */
    hasSchema(schema: string): Promise<boolean>;
    /**
     * Loads currently using database schema
     */
    getCurrentSchema(): Promise<undefined>;
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
     */
    dropSchema(schemaPath: string, ifExists?: boolean): Promise<void>;
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
     * @param tableOrName
     * @param ifExists
     * @param dropForeignKeys
     * @param dropIndices
     */
    dropTable(tableOrName: Table | string, ifExists?: boolean, dropForeignKeys?: boolean, dropIndices?: boolean): Promise<void>;
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
     * Changed column looses all its keys in the db.
     *
     * @param tableOrName
     * @param changedColumns
     */
    changeColumns(tableOrName: Table | string, changedColumns: {
        oldColumn: TableColumn;
        newColumn: TableColumn;
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
     */
    createPrimaryKey(tableOrName: Table | string, columnNames: string[]): Promise<void>;
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
     * Creates a new unique constraint.
     *
     * @param tableOrName
     * @param uniqueConstraint
     */
    createUniqueConstraint(tableOrName: Table | string, uniqueConstraint: TableUnique): Promise<void>;
    /**
     * Creates a new unique constraints.
     *
     * @param tableOrName
     * @param uniqueConstraints
     */
    createUniqueConstraints(tableOrName: Table | string, uniqueConstraints: TableUnique[]): Promise<void>;
    /**
     * Drops a unique constraint.
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
     * Creates a new exclusion constraint.
     *
     * @param tableOrName
     * @param exclusionConstraint
     */
    createExclusionConstraint(tableOrName: Table | string, exclusionConstraint: TableExclusion): Promise<void>;
    /**
     * Creates a new exclusion constraints.
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
     *
     * @param database
     */
    clearDatabase(database?: string): Promise<void>;
    protected loadViews(viewNames?: string[]): Promise<View[]>;
    protected loadTableRecords(tablePath: string, tableOrIndex: "table" | "index"): Promise<any>;
    protected loadPragmaRecords(tablePath: string, pragma: string): Promise<any>;
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
     * @param temporaryTable
     */
    protected createTableSql(table: Table, createForeignKeys?: boolean, temporaryTable?: boolean): Query;
    /**
     * Builds drop table sql.
     *
     * @param tableOrName
     * @param ifExists
     */
    protected dropTableSql(tableOrName: Table | string, ifExists?: boolean): Query;
    protected createViewSql(view: View): Query;
    protected insertViewDefinitionSql(view: View): Query;
    /**
     * Builds drop view sql.
     *
     * @param viewOrPath
     * @param ifExists
     */
    protected dropViewSql(viewOrPath: View | string, ifExists?: boolean): Query;
    /**
     * Builds remove view sql.
     *
     * @param viewOrPath
     */
    protected deleteViewDefinitionSql(viewOrPath: View | string): Query;
    /**
     * Builds create index sql.
     *
     * @param table
     * @param index
     */
    protected createIndexSql(table: Table, index: TableIndex): Query;
    /**
     * Builds drop index sql.
     *
     * @param indexOrName
     * @param ifExists
     */
    protected dropIndexSql(indexOrName: TableIndex | string, ifExists?: boolean): Query;
    /**
     * Builds a query for create column.
     *
     * @param column
     * @param skipPrimary
     */
    protected buildCreateColumnSql(column: TableColumn, skipPrimary?: boolean): string;
    protected recreateTable(newTable: Table, oldTable: Table, migrateData?: boolean): Promise<void>;
    /**
     * tablePath e.g. "myDB.myTable", "myTable"
     *
     * @param tablePath
     */
    protected splitTablePath(tablePath: string): [string | undefined, string];
    /**
     * Escapes given table or view path. Tolerates leading/trailing dots
     *
     * @param target
     * @param disableEscape
     */
    protected escapePath(target: Table | View | string, disableEscape?: boolean): string;
    /**
     * Change table comment.
     *
     * @param tableOrName
     * @param comment
     */
    changeTableComment(tableOrName: Table | string, comment?: string): Promise<void>;
}
