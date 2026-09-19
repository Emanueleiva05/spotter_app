"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultNamingStrategy = void 0;
const StringUtils_1 = require("../util/StringUtils");
/**
 * Naming strategy that is used by default.
 */
class DefaultNamingStrategy {
    constructor() {
        this.materializedPathColumnName = "mpath";
        this.nestedSetColumnNames = { left: "nsleft", right: "nsright" };
    }
    tableName(targetName, userSpecifiedName) {
        return userSpecifiedName ?? (0, StringUtils_1.snakeCase)(targetName);
    }
    closureJunctionTableName(originalClosureTableName) {
        return originalClosureTableName + "_closure";
    }
    columnName(propertyName, customName, embeddedPrefixes) {
        const name = customName || propertyName;
        if (embeddedPrefixes.length)
            return (0, StringUtils_1.camelCase)(embeddedPrefixes.join("_")) + (0, StringUtils_1.titleCase)(name);
        return name;
    }
    relationName(propertyName) {
        return propertyName;
    }
    primaryKeyName(tableOrName, columnNames) {
        // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
        const clonedColumnNames = [...columnNames];
        clonedColumnNames.sort();
        const tableName = this.getTableName(tableOrName);
        const replacedTableName = tableName.replace(".", "_");
        const key = `${replacedTableName}_${clonedColumnNames.join("_")}`;
        return "PK_" + this.hash(key).slice(0, 27);
    }
    uniqueConstraintName(tableOrName, columnNames) {
        // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
        const clonedColumnNames = [...columnNames];
        clonedColumnNames.sort();
        const tableName = this.getTableName(tableOrName);
        const replacedTableName = tableName.replace(".", "_");
        const key = `${replacedTableName}_${clonedColumnNames.join("_")}`;
        return "UQ_" + this.hash(key).slice(0, 27);
    }
    relationConstraintName(tableOrName, columnNames, where) {
        // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
        const clonedColumnNames = [...columnNames];
        clonedColumnNames.sort();
        const tableName = this.getTableName(tableOrName);
        const replacedTableName = tableName.replace(".", "_");
        let key = `${replacedTableName}_${clonedColumnNames.join("_")}`;
        if (where)
            key += `_${where}`;
        return "REL_" + this.hash(key).slice(0, 26);
    }
    defaultConstraintName(tableOrName, columnName) {
        const tableName = this.getTableName(tableOrName);
        const replacedTableName = tableName.replace(".", "_");
        const key = `${replacedTableName}_${columnName}`;
        return "DF_" + this.hash(key).slice(0, 27);
    }
    foreignKeyName(tableOrName, columnNames, _referencedTablePath, _referencedColumnNames) {
        // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
        const clonedColumnNames = [...columnNames];
        clonedColumnNames.sort();
        const tableName = this.getTableName(tableOrName);
        const replacedTableName = tableName.replace(".", "_");
        const key = `${replacedTableName}_${clonedColumnNames.join("_")}`;
        return "FK_" + this.hash(key).slice(0, 27);
    }
    indexName(tableOrName, columnNames, where) {
        // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
        const clonedColumnNames = [...columnNames];
        clonedColumnNames.sort();
        const tableName = this.getTableName(tableOrName);
        const replacedTableName = tableName.replace(".", "_");
        let key = `${replacedTableName}_${clonedColumnNames.join("_")}`;
        if (where)
            key += `_${where}`;
        return "IDX_" + this.hash(key).slice(0, 26);
    }
    checkConstraintName(tableOrName, expression, isEnum) {
        const tableName = this.getTableName(tableOrName);
        const replacedTableName = tableName.replace(".", "_");
        const key = `${replacedTableName}_${expression}`;
        const name = "CHK_" + this.hash(key).slice(0, 26);
        return isEnum ? `${name}_ENUM` : name;
    }
    exclusionConstraintName(tableOrName, expression) {
        const tableName = this.getTableName(tableOrName);
        const replacedTableName = tableName.replace(".", "_");
        const key = `${replacedTableName}_${expression}`;
        return "XCL_" + this.hash(key).slice(0, 26);
    }
    joinColumnName(relationName, referencedColumnName) {
        return (0, StringUtils_1.camelCase)(relationName + "_" + referencedColumnName);
    }
    joinTableName(firstTableName, secondTableName, firstPropertyName, secondPropertyName) {
        return (0, StringUtils_1.snakeCase)(firstTableName +
            "_" +
            firstPropertyName.replaceAll(/\./gi, "_") +
            "_" +
            secondTableName);
    }
    joinTableColumnDuplicationPrefix(columnName, index) {
        return columnName + "_" + index;
    }
    joinTableColumnName(tableName, propertyName, columnName) {
        return (0, StringUtils_1.camelCase)(tableName + "_" + (columnName ?? propertyName));
    }
    joinTableInverseColumnName(tableName, propertyName, columnName) {
        return this.joinTableColumnName(tableName, propertyName, columnName);
    }
    prefixTableName(prefix, tableName) {
        return prefix + tableName;
    }
    getTableName(tableOrName) {
        if (typeof tableOrName !== "string") {
            tableOrName = tableOrName.name;
        }
        return tableOrName.split(".").pop();
    }
    hash(input) {
        return (0, StringUtils_1.hash)(input);
    }
}
exports.DefaultNamingStrategy = DefaultNamingStrategy;
//# sourceMappingURL=DefaultNamingStrategy.js.map