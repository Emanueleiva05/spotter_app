import type { NamingStrategyInterface } from "./NamingStrategyInterface";
import type { Table } from "../schema-builder/table/Table";
/**
 * Naming strategy that is used by default.
 */
export declare class DefaultNamingStrategy implements NamingStrategyInterface {
    materializedPathColumnName: string;
    nestedSetColumnNames: {
        left: string;
        right: string;
    };
    tableName(targetName: string, userSpecifiedName: string | undefined): string;
    closureJunctionTableName(originalClosureTableName: string): string;
    columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string;
    relationName(propertyName: string): string;
    primaryKeyName(tableOrName: Table | string, columnNames: string[]): string;
    uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string;
    relationConstraintName(tableOrName: Table | string, columnNames: string[], where?: string): string;
    defaultConstraintName(tableOrName: Table | string, columnName: string): string;
    foreignKeyName(tableOrName: Table | string, columnNames: string[], _referencedTablePath?: string, _referencedColumnNames?: string[]): string;
    indexName(tableOrName: Table | string, columnNames: string[], where?: string): string;
    checkConstraintName(tableOrName: Table | string, expression: string, isEnum?: boolean): string;
    exclusionConstraintName(tableOrName: Table | string, expression: string): string;
    joinColumnName(relationName: string, referencedColumnName: string): string;
    joinTableName(firstTableName: string, secondTableName: string, firstPropertyName: string, secondPropertyName: string): string;
    joinTableColumnDuplicationPrefix(columnName: string, index: number): string;
    joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string;
    joinTableInverseColumnName(tableName: string, propertyName: string, columnName?: string): string;
    prefixTableName(prefix: string, tableName: string): string;
    protected getTableName(tableOrName: Table | string): string;
    protected hash(input: string): string;
}
