import type { ObjectLiteral } from "../../common/ObjectLiteral";
import type { ReadStream } from "../../platform/PlatformTools";
import { BaseQueryRunner } from "../../query-runner/BaseQueryRunner";
import type { QueryRunner } from "../../query-runner/QueryRunner";
import { Table } from "../../schema-builder/table/Table";
import { TableCheck } from "../../schema-builder/table/TableCheck";
import { TableColumn } from "../../schema-builder/table/TableColumn";
import type { TableExclusion } from "../../schema-builder/table/TableExclusion";
import { TableForeignKey } from "../../schema-builder/table/TableForeignKey";
import { TableIndex } from "../../schema-builder/table/TableIndex";
import { TableUnique } from "../../schema-builder/table/TableUnique";
import { View } from "../../schema-builder/view/View";
import { Query } from "../Query";
import type { IsolationLevel } from "../types/IsolationLevel";
import type { ReplicationMode } from "../types/ReplicationMode";
import type { MssqlParameter } from "./MssqlParameter";
import type { SqlServerDriver } from "./SqlServerDriver";
/**
 * Runs queries on a single SQL Server database connection.
 */
export declare class SqlServerQueryRunner extends BaseQueryRunner implements QueryRunner {
    /**
     * Database driver used by connection.
     */
    driver: SqlServerDriver;
    private lock;
    constructor(driver: SqlServerDriver, mode: ReplicationMode);
    /**
     * Creates/uses database connection from the connection pool to perform further operations.
     * Returns obtained database connection.
     */
    connect(): Promise<void>;
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
     * Checks if column exist in the table.
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
     * Creates table schema.
     * If database name also specified (e.g. 'dbName.schemaName') schema will be created in specified database.
     *
     * @param schemaPath
     * @param ifNotExists
     */
    createSchema(schemaPath: string, ifNotExists?: boolean): Promise<void>;
    /**
     * Drops table schema.
     * If database name also specified (e.g. 'dbName.schemaName') schema will be dropped in specified database.
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
     * Renames a table.
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
     * Creates a new check constraint.
     *
     * @param tableOrName
     * @param checkConstraint
     */
    createCheckConstraint(tableOrName: Table | string, checkConstraint: TableCheck): Promise<void>;
    /**
     * Creates a new check constraints.
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
     * Drops an index.
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
     * @param tablePath
     * @param options
     * @param options.cascade
     */
    clearTable(tablePath: string, options?: {
        cascade?: boolean;
    }): Promise<void>;
    /**
     * Removes all tables from the currently connected database.
     *
     * @param database
     */
    clearDatabase(database?: string): Promise<void>;
    protected loadViews(viewPaths?: string[]): Promise<View[]>;
    /**
     * Loads all tables (with given names) from the database and creates a Table from them.
     *
     * @param tableNames
     */
    protected loadTables(tableNames?: string[]): Promise<Table[]>;
    /**
     * Builds and returns SQL for create table.
     *
     * @param table
     * @param createForeignKeys
     */
    protected createTableSql(table: Table, createForeignKeys?: boolean): Query;
    /**
     * Builds drop table sql.
     *
     * @param tableOrName
     * @param ifExists
     */
    protected dropTableSql(tableOrName: Table | string, ifExists?: boolean): Query;
    protected createViewSql(view: View): Query;
    protected insertViewDefinitionSql(view: View): Promise<Query>;
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
    protected deleteViewDefinitionSql(viewOrPath: View | string): Promise<Query>;
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
     * @param table
     * @param indexOrName
     */
    protected dropIndexSql(table: Table, indexOrName: TableIndex | string): Query;
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
     */
    protected dropPrimaryKeySql(table: Table): Query;
    /**
     * Builds create unique constraint sql.
     *
     * @param table
     * @param uniqueConstraint
     */
    protected createUniqueConstraintSql(table: Table, uniqueConstraint: TableUnique): Query;
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
     */
    protected dropCheckConstraintSql(table: Table, checkOrName: TableCheck | string): Query;
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
     */
    protected dropForeignKeySql(table: Table, foreignKeyOrName: TableForeignKey | string): Query;
    /**
     * Escapes given table or View path.
     *
     * @param target
     */
    protected escapePath(target: Table | View | string): string;
    /**
     * Concat database name and schema name to the foreign key name.
     * Needs because FK name is relevant to the schema and database.
     *
     * @param fkName
     * @param schemaName
     * @param dbName
     */
    protected buildForeignKeyName(fkName: string, schemaName: string | undefined, dbName: string | undefined): string;
    /**
     * Removes parenthesis around default value.
     * Sql server returns default value with parenthesis around.
     *
     * @example
     * ('My text') // for string
     * ((1)) // for number
     * (newsequentialId()) // for function
     *
     * @param defaultValue
     */
    protected removeParenthesisFromDefault(defaultValue: string): any;
    /**
     * Builds a query for create column.
     *
     * @param table
     * @param column
     * @param skipIdentity
     * @param createDefault
     * @param skipEnum
     */
    protected buildCreateColumnSql(table: Table, column: TableColumn, skipIdentity: boolean, createDefault: boolean, skipEnum?: boolean): string;
    private getEnumExpression;
    protected isEnumCheckConstraint(name: string): boolean;
    /**
     * Converts MssqlParameter into real mssql parameter type.
     *
     * @param parameter
     */
    protected mssqlParameterToNativeParameter(parameter: MssqlParameter): any;
    /**
     * Change table comment.
     *
     * @param tableOrName
     * @param comment
     */
    changeTableComment(tableOrName: Table | string, comment?: string): Promise<void>;
}
