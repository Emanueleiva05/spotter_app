import type { ObjectLiteral } from "../../common/ObjectLiteral";
import { AbstractSqliteQueryRunner } from "../sqlite-abstract/AbstractSqliteQueryRunner";
import type { CapacitorDriver } from "./CapacitorDriver";
/**
 * Runs queries on a single sqlite database connection.
 */
export declare class CapacitorQueryRunner extends AbstractSqliteQueryRunner {
    /**
     * Database driver used by connection.
     */
    driver: CapacitorDriver;
    constructor(driver: CapacitorDriver);
    /**
     * Called before migrations are run.
     */
    beforeMigration(): Promise<void>;
    /**
     * Called after migrations are run.
     */
    afterMigration(): Promise<void>;
    executeSet(set: {
        statement: string;
        values?: any[];
    }[]): Promise<any>;
    /**
     * Executes a given SQL query.
     *
     * @param query
     * @param parameters
     * @param useStructuredResult
     */
    query(query: string, parameters?: any[] | ObjectLiteral, useStructuredResult?: boolean): Promise<any>;
    /**
     * Parametrizes given object of values. Used to create column=value queries.
     *
     * @param objectLiteral
     */
    protected parametrize(objectLiteral: ObjectLiteral): string[];
}
