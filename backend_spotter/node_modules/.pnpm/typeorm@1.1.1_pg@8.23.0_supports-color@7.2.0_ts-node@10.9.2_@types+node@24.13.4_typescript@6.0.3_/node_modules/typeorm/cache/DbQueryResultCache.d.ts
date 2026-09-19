import type { DataSource } from "../data-source/DataSource";
import type { QueryRunner } from "../query-runner/QueryRunner";
import type { QueryResultCache } from "./QueryResultCache";
import type { QueryResultCacheOptions } from "./QueryResultCacheOptions";
/**
 * Caches query result into current database, into separate table called "query-result-cache".
 */
export declare class DbQueryResultCache implements QueryResultCache {
    protected dataSource: DataSource;
    private queryResultCacheTable;
    private queryResultCacheDatabase?;
    private queryResultCacheSchema?;
    constructor(dataSource: DataSource);
    /**
     * Creates a connection with given cache provider.
     */
    connect(): Promise<void>;
    /**
     * Disconnects with given cache provider.
     */
    disconnect(): Promise<void>;
    /**
     * Creates table for storing cache if it does not exist yet.
     *
     * @param queryRunner
     */
    synchronize(queryRunner?: QueryRunner): Promise<void>;
    /**
     * Get data from cache.
     * Returns cache result if found.
     * Returns undefined if result is not cached.
     *
     * @param options
     * @param queryRunner
     */
    getFromCache(options: QueryResultCacheOptions, queryRunner?: QueryRunner): Promise<QueryResultCacheOptions | undefined>;
    /**
     * Checks if cache is expired or not.
     *
     * @param savedCache
     */
    isExpired(savedCache: QueryResultCacheOptions): boolean;
    /**
     * Stores given query result in the cache.
     *
     * @param options
     * @param savedCache
     * @param queryRunner
     */
    storeInCache(options: QueryResultCacheOptions, savedCache: QueryResultCacheOptions | undefined, queryRunner?: QueryRunner): Promise<void>;
    /**
     * Clears everything stored in the cache.
     *
     * @param queryRunner
     */
    clear(queryRunner?: QueryRunner): Promise<void>;
    /**
     * Removes all cached results by given identifiers from cache.
     *
     * @param identifiers
     * @param queryRunner
     */
    remove(identifiers: string[], queryRunner?: QueryRunner): Promise<void>;
    /**
     * Gets a query runner to work with.
     *
     * @param queryRunner
     */
    protected getQueryRunner(queryRunner?: QueryRunner): QueryRunner;
}
