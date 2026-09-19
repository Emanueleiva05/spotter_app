import type { DataSource } from "../../data-source";
import type { Driver } from "../../driver/Driver";
import type { EntityMetadata } from "../../metadata/EntityMetadata";
import type { SelectQueryBuilder } from "../../query-builder/SelectQueryBuilder";
import type { ViewOptions } from "../options/ViewOptions";
import type { TableIndex } from "../table/TableIndex";
/**
 * View in the database represented in this class.
 */
export declare class View {
    readonly "@instanceof": symbol;
    /**
     * Database name that this view resides in if it applies.
     */
    database?: string;
    /**
     * Schema name that this view resides in if it applies.
     */
    schema?: string;
    /**
     * View name
     */
    name: string;
    /**
     * Indicates if view is materialized.
     */
    materialized: boolean;
    /**
     * View Indices
     */
    indices: TableIndex[];
    /**
     * View definition.
     */
    expression: string | ((dataSource: DataSource) => SelectQueryBuilder<any>);
    constructor(options?: ViewOptions);
    /**
     * Clones this table to a new table with all properties cloned.
     */
    clone(): View;
    /**
     * Add index
     *
     * @param index
     */
    addIndex(index: TableIndex): void;
    /**
     * Remove index
     *
     * @param viewIndex
     */
    removeIndex(viewIndex: TableIndex): void;
    /**
     * Creates view from a given entity metadata.
     *
     * @param entityMetadata
     * @param driver
     */
    static create(entityMetadata: EntityMetadata, driver: Driver): View;
}
