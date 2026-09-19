import type { ColumnOptions } from "../options/ColumnOptions";
/**
 * Sets for entity to use table inheritance pattern.
 *
 * @param options
 * @param options.pattern
 * @param options.column
 */
export declare function TableInheritance(options?: {
    pattern?: "STI";
    column?: string | ColumnOptions;
}): ClassDecorator;
