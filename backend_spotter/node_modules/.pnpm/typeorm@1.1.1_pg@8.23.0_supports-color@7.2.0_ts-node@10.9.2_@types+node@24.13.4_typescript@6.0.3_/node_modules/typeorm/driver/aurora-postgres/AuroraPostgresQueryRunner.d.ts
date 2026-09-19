import type { QueryRunner } from "../../query-runner/QueryRunner";
import type { IsolationLevel } from "../types/IsolationLevel";
import type { AuroraPostgresDriver } from "./AuroraPostgresDriver";
import { PostgresQueryRunner } from "../postgres/PostgresQueryRunner";
import type { ReplicationMode } from "../types/ReplicationMode";
import type { Table } from "../../schema-builder/table/Table";
import type { ObjectLiteral } from "../../common/ObjectLiteral";
declare class PostgresQueryRunnerWrapper extends PostgresQueryRunner {
    driver: any;
    constructor(driver: any, mode: ReplicationMode);
}
/**
 * Runs queries on a single postgres database connection.
 */
export declare class AuroraPostgresQueryRunner extends PostgresQueryRunnerWrapper implements QueryRunner {
    /**
     * Database driver used by connection.
     */
    driver: AuroraPostgresDriver;
    protected client: any;
    constructor(driver: AuroraPostgresDriver, client: any, mode: ReplicationMode);
    /**
     * Creates/uses database connection from the connection pool to perform further operations.
     * Returns obtained database connection.
     */
    connect(): Promise<any>;
    /**
     * Starts transaction on the current connection.
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
     * Change table comment.
     *
     * @param tableOrName
     * @param comment
     */
    changeTableComment(tableOrName: Table | string, comment?: string): Promise<void>;
}
export {};
