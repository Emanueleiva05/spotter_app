import type { Driver } from "../driver/Driver";
import type { Repository } from "../repository/Repository";
import type { EntitySubscriberInterface } from "../subscriber/EntitySubscriberInterface";
import type { EntityTarget } from "../common/EntityTarget";
import type { EntityManager } from "../entity-manager/EntityManager";
import type { TreeRepository } from "../repository/TreeRepository";
import type { NamingStrategyInterface } from "../naming-strategy/NamingStrategyInterface";
import type { EntityMetadata } from "../metadata/EntityMetadata";
import type { Logger } from "../logger/Logger";
import type { MigrationInterface } from "../migration/MigrationInterface";
import type { Migration } from "../migration/Migration";
import type { MongoRepository } from "../repository/MongoRepository";
import type { MongoEntityManager } from "../entity-manager/MongoEntityManager";
import type { DataSourceOptions } from "./DataSourceOptions";
import type { QueryRunner } from "../query-runner/QueryRunner";
import { SelectQueryBuilder } from "../query-builder/SelectQueryBuilder";
import type { QueryResultCache } from "../cache/QueryResultCache";
import type { SqljsEntityManager } from "../entity-manager/SqljsEntityManager";
import { RelationLoader } from "../query-builder/RelationLoader";
import type { IsolationLevel } from "../driver/types/IsolationLevel";
import type { ReplicationMode } from "../driver/types/ReplicationMode";
import { RelationIdLoader } from "../query-builder/RelationIdLoader";
import type { ObjectLiteral } from "../common/ObjectLiteral";
/**
 * DataSource is a pre-defined connection configuration to a specific database.
 * You can have multiple data sources connected (with multiple connections in it),
 * connected to multiple databases in your application.
 *
 * Before, it was called `Connection`, but now `Connection` is deprecated
 * because `Connection` isn't the best name for what it's actually is.
 */
export declare class DataSource {
    readonly "@instanceof": symbol;
    /**
     * DataSource options.
     */
    readonly options: DataSourceOptions;
    /**
     * Indicates if the DataSource is initialized or not.
     */
    readonly isInitialized: boolean;
    /**
     * Database driver used by this connection.
     */
    driver: Driver;
    /**
     * EntityManager of this connection.
     */
    readonly manager: EntityManager;
    /**
     * Naming strategy used in the connection.
     */
    namingStrategy: NamingStrategyInterface;
    /**
     * Name for the metadata table
     */
    readonly metadataTableName: string;
    /**
     * Logger used to log orm events.
     */
    logger: Logger;
    /**
     * Migration instances that are registered for this connection.
     */
    readonly migrations: MigrationInterface[];
    /**
     * Entity subscriber instances that are registered for this connection.
     */
    readonly subscribers: EntitySubscriberInterface<any>[];
    /**
     * All entity metadatas that are registered for this connection.
     */
    readonly entityMetadatas: EntityMetadata[];
    /**
     * All entity metadatas that are registered for this connection.
     * This is a copy of #.entityMetadatas property -> used for more performant searches.
     */
    readonly entityMetadatasMap: Map<EntityTarget<any>, EntityMetadata>;
    /**
     * Used to work with query result cache.
     */
    queryResultCache?: QueryResultCache;
    /**
     * Used to load relations and work with lazy relations.
     */
    readonly relationLoader: RelationLoader;
    readonly relationIdLoader: RelationIdLoader;
    constructor(options: DataSourceOptions);
    /**
     * Gets the mongodb entity manager that allows to perform mongodb-specific repository operations
     * with any entity in this connection.
     *
     * Available only in mongodb connections.
     *
     * @returns the mongodb entity manager
     */
    get mongoManager(): MongoEntityManager;
    /**
     * Gets a sql.js specific Entity Manager that allows to perform special load and save operations
     *
     * Available only in connection with the sqljs driver.
     *
     * @returns an sqljs specific Entity Manager
     */
    get sqljsManager(): SqljsEntityManager;
    /**
     * Updates current connection options with provided options.
     *
     * @param options
     */
    setOptions(options: Partial<DataSourceOptions>): this;
    /**
     * Performs connection to the database.
     * This method should be called once on application bootstrap.
     * This method not necessarily creates database connection (depend on database type),
     * but it also can setup a connection pool with database to use.
     */
    initialize(): Promise<this>;
    /**
     * Closes connection with the database.
     * Once connection is closed, you cannot use repositories or perform any operations except opening connection again.
     */
    destroy(): Promise<void>;
    /**
     * Creates database schema for all entities registered in this connection.
     * Can be used only after connection to the database is established.
     *
     * @param dropBeforeSync If set to true then it drops the database with all its tables and data
     */
    synchronize(dropBeforeSync?: boolean): Promise<void>;
    /**
     * Drops the database and all its data.
     * Be careful with this method on production since this method will erase all your database tables and their data.
     * Can be used only after connection to the database is established.
     */
    dropDatabase(): Promise<void>;
    /**
     * Runs all pending migrations.
     * Can be used only after connection to the database is established.
     *
     * @param options
     * @param options.transaction
     * @param options.fake
     */
    runMigrations(options?: {
        transaction?: "all" | "none" | "each";
        fake?: boolean;
    }): Promise<Migration[]>;
    /**
     * Reverts last executed migration.
     * Can be used only after connection to the database is established.
     *
     * @param options
     * @param options.transaction
     * @param options.fake
     */
    undoLastMigration(options?: {
        transaction?: "all" | "none" | "each";
        fake?: boolean;
    }): Promise<void>;
    /**
     * Lists all migrations and whether they have been run.
     * Returns true if there are pending migrations
     */
    showMigrations(): Promise<boolean>;
    /**
     * Checks if entity metadata exist for the given entity class, target name or table name.
     *
     * @param target
     */
    hasMetadata(target: EntityTarget<any>): boolean;
    /**
     * Gets entity metadata for the given entity class or schema name.
     *
     * @param target
     */
    getMetadata(target: EntityTarget<any>): EntityMetadata;
    /**
     * Gets repository for the given entity.
     *
     * @param target
     */
    getRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Repository<Entity>;
    /**
     * Gets tree repository for the given entity class or name.
     * Only tree-type entities can have a TreeRepository, like ones decorated with `@Tree` decorator.
     *
     * @param target
     */
    getTreeRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): TreeRepository<Entity>;
    /**
     * Gets mongodb-specific repository for the given entity class or name.
     * Works only if connection is mongodb-specific.
     *
     * @param target
     */
    getMongoRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): MongoRepository<Entity>;
    /**
     * Wraps given function execution (and all operations made there) into a transaction.
     * All database operations must be executed using provided entity manager.
     */
    transaction<T>(runInTransaction: (entityManager: EntityManager) => Promise<T>): Promise<T>;
    transaction<T>(isolationLevel: IsolationLevel, runInTransaction: (entityManager: EntityManager) => Promise<T>): Promise<T>;
    /**
     * Executes raw SQL query and returns raw database results.
     *
     * @param query
     * @param parameters
     * @param queryRunner
     * @returns a raw response from the database client
     * @see {@link https://typeorm.io/data-source-api | Official docs} for examples.
     */
    query<T = any>(query: string, parameters?: any[] | ObjectLiteral, queryRunner?: QueryRunner): Promise<T>;
    /**
     * Tagged template function that executes raw SQL query and returns raw database results.
     * Template expressions are automatically transformed into database parameters.
     * Raw query execution is supported only by relational databases (MongoDB is not supported).
     * Note: Don't call this as a regular function, it is meant to be used with backticks to tag a template literal.
     *
     * @example
     * dataSource.sql`SELECT * FROM table_name WHERE id = ${id}`
     *
     * @param strings
     * @param values
     * @returns a raw response from the database client
     */
    sql<T = any>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T>;
    /**
     * Creates a new query builder that can be used to build a SQL query.
     */
    createQueryBuilder<Entity extends ObjectLiteral>(entityClass: EntityTarget<Entity>, alias: string, queryRunner?: QueryRunner): SelectQueryBuilder<Entity>;
    /**
     * Creates a new query builder that can be used to build a SQL query.
     */
    createQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<any>;
    /**
     * Creates a query runner used for perform queries on a single database connection.
     * Using query runners you can control your queries to execute using single database connection and
     * manually control your database transaction.
     *
     * Mode is used in replication mode and indicates whatever you want to connect
     * to master database or any of slave databases.
     * If you perform writes you must use master database,
     * if you perform reads you can use slave databases.
     *
     * @param mode
     */
    createQueryRunner(mode?: ReplicationMode): QueryRunner;
    /**
     * Gets entity metadata of the junction table (many-to-many table).
     *
     * @param entityTarget
     * @param relationPropertyPath
     */
    getManyToManyMetadata(entityTarget: EntityTarget<any>, relationPropertyPath: string): EntityMetadata | undefined;
    /**
     * Creates an Entity Manager for the current connection with the help of the EntityManagerFactory.
     *
     * @param queryRunner
     */
    createEntityManager(queryRunner?: QueryRunner): EntityManager;
    /**
     * Finds exist entity metadata by the given entity class, target name or table name.
     *
     * @param target
     */
    protected findMetadata(target: EntityTarget<any>): EntityMetadata | undefined;
    /**
     * Builds metadatas for all registered classes inside this connection.
     */
    protected buildMetadatas(): Promise<void>;
    /**
     * Get the replication mode SELECT queries should use for this datasource by default
     */
    defaultReplicationModeForReads(): ReplicationMode;
}
