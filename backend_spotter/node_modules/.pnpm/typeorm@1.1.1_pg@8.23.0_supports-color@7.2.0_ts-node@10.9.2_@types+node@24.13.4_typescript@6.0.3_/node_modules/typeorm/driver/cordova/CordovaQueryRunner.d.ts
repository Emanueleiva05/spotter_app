import type { ObjectLiteral } from "../../common/ObjectLiteral";
import { AbstractSqliteQueryRunner } from "../sqlite-abstract/AbstractSqliteQueryRunner";
import type { CordovaDriver } from "./CordovaDriver";
/**
 * Runs queries on a single sqlite database connection.
 */
export declare class CordovaQueryRunner extends AbstractSqliteQueryRunner {
    /**
     * Database driver used by connection.
     */
    driver: CordovaDriver;
    constructor(driver: CordovaDriver);
    /**
     * Called before migrations are run.
     */
    beforeMigration(): Promise<void>;
    /**
     * Called after migrations are run.
     */
    afterMigration(): Promise<void>;
    /**
     * Executes a given SQL query.
     *
     * @param query
     * @param parameters
     * @param useStructuredResult
     */
    query(query: string, parameters?: any[] | ObjectLiteral, useStructuredResult?: boolean): Promise<any>;
    /**
     * Would start a transaction but this driver does not support transactions.
     */
    startTransaction(): Promise<void>;
    /**
     * Would start a transaction but this driver does not support transactions.
     */
    commitTransaction(): Promise<void>;
    /**
     * Would start a transaction but this driver does not support transactions.
     */
    rollbackTransaction(): Promise<void>;
    /**
     * Removes all tables from the currently connected database.
     * Be careful with using this method and avoid using it in production or migrations
     * (because it can clear all your database).
     */
    clearDatabase(): Promise<void>;
    /**
     * Parametrizes given object of values. Used to create column=value queries.
     *
     * @param objectLiteral
     * @param startIndex
     */
    protected parametrize(objectLiteral: ObjectLiteral, startIndex?: number): string[];
}
