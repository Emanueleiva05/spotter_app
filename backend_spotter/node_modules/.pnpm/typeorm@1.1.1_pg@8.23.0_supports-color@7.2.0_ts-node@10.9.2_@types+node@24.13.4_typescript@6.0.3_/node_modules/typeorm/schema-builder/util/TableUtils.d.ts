import type { TableColumnOptions } from "../options/TableColumnOptions";
import type { ColumnMetadata } from "../../metadata/ColumnMetadata";
import type { Driver } from "../../driver/Driver";
export declare class TableUtils {
    static createTableColumnOptions(columnMetadata: ColumnMetadata, driver: Driver): TableColumnOptions;
}
