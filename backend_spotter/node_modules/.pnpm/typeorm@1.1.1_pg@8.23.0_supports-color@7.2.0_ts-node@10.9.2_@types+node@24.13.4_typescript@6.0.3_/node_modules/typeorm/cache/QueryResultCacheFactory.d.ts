import type { QueryResultCache } from "./QueryResultCache";
import type { DataSource } from "../data-source/DataSource";
/**
 * Caches query result into Redis database.
 */
export declare class QueryResultCacheFactory {
    protected dataSource: DataSource;
    constructor(dataSource: DataSource);
    /**
     * Creates a new query result cache based on connection options.
     */
    create(): QueryResultCache;
}
