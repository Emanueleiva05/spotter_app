import { TableColumn } from "./TableColumn";
import { TableIndex } from "./TableIndex";
import { TableForeignKey } from "./TableForeignKey";
import type { Driver } from "../../driver/Driver";
import type { TableOptions } from "../options/TableOptions";
import type { EntityMetadata } from "../../metadata/EntityMetadata";
import { TableUnique } from "./TableUnique";
import { TableCheck } from "./TableCheck";
import { TableExclusion } from "./TableExclusion";
/**
 * Table in the database represented in this class.
 */
export declare class Table {
    readonly "@instanceof": symbol;
    /**
     * Database name that this table resides in if it applies.
     */
    database?: string;
    /**
     * Schema name that this table resides in if it applies.
     */
    schema?: string;
    /**
     * May contain database name, schema name and table name, unless they're the current database.
     *
     * E.g. myDB.mySchema.myTable
     */
    name: string;
    /**
     * Table columns.
     */
    columns: TableColumn[];
    /**
     * Table indices.
     */
    indices: TableIndex[];
    /**
     * Table foreign keys.
     */
    foreignKeys: TableForeignKey[];
    /**
     * Table unique constraints.
     */
    uniques: TableUnique[];
    /**
     * Table check constraints.
     */
    checks: TableCheck[];
    /**
     * Table exclusion constraints.
     */
    exclusions: TableExclusion[];
    /**
     * Indicates if table was just created.
     * This is needed, for example to check if we need to skip primary keys creation
     * for new tables.
     */
    justCreated: boolean;
    /**
     * Enables Sqlite "WITHOUT ROWID" modifier for the "CREATE TABLE" statement
     */
    withoutRowid?: boolean;
    /**
     * Table engine.
     */
    engine?: string;
    /**
     * Table comment. Not supported by all database types.
     */
    comment?: string;
    constructor(options?: TableOptions);
    get primaryColumns(): TableColumn[];
    /**
     * Clones this table to a new table with all properties cloned.
     */
    clone(): Table;
    /**
     * Add column and creates its constraints.
     *
     * @param column
     */
    addColumn(column: TableColumn): void;
    /**
     * Remove column and its constraints.
     *
     * @param column
     */
    removeColumn(column: TableColumn): void;
    /**
     * Adds unique constraint.
     *
     * @param uniqueConstraint
     */
    addUniqueConstraint(uniqueConstraint: TableUnique): void;
    /**
     * Removes unique constraint.
     *
     * @param removedUnique
     */
    removeUniqueConstraint(removedUnique: TableUnique): void;
    /**
     * Adds check constraint.
     *
     * @param checkConstraint
     */
    addCheckConstraint(checkConstraint: TableCheck): void;
    /**
     * Removes check constraint.
     *
     * @param removedCheck
     */
    removeCheckConstraint(removedCheck: TableCheck): void;
    /**
     * Adds exclusion constraint.
     *
     * @param exclusionConstraint
     */
    addExclusionConstraint(exclusionConstraint: TableExclusion): void;
    /**
     * Removes exclusion constraint.
     *
     * @param removedExclusion
     */
    removeExclusionConstraint(removedExclusion: TableExclusion): void;
    /**
     * Adds foreign keys.
     *
     * @param foreignKey
     */
    addForeignKey(foreignKey: TableForeignKey): void;
    /**
     * Removes foreign key.
     *
     * @param removedForeignKey
     */
    removeForeignKey(removedForeignKey: TableForeignKey): void;
    /**
     * Adds index.
     *
     * @param index
     * @param isMysql
     */
    addIndex(index: TableIndex, isMysql?: boolean): void;
    /**
     * Removes index.
     *
     * @param tableIndex
     * @param isMysql
     */
    removeIndex(tableIndex: TableIndex, isMysql?: boolean): void;
    findColumnByName(name: string): TableColumn | undefined;
    /**
     * Returns all column indices.
     *
     * @param column
     */
    findColumnIndices(column: TableColumn): TableIndex[];
    /**
     * Returns all column foreign keys.
     *
     * @param column
     */
    findColumnForeignKeys(column: TableColumn): TableForeignKey[];
    /**
     * Returns all column uniques.
     *
     * @param column
     */
    findColumnUniques(column: TableColumn): TableUnique[];
    /**
     * Returns all column checks.
     *
     * @param column
     */
    findColumnChecks(column: TableColumn): TableCheck[];
    /**
     * Creates table from a given entity metadata.
     *
     * @param entityMetadata
     * @param driver
     */
    static create(entityMetadata: EntityMetadata, driver: Driver): Table;
}
