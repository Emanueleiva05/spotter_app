import type { ObjectLiteral } from "../../common/ObjectLiteral";
import { AbstractSqliteQueryRunner } from "../sqlite-abstract/AbstractSqliteQueryRunner";
import type { ExpoDriver } from "./ExpoDriver";
export declare class ExpoQueryRunner extends AbstractSqliteQueryRunner {
    driver: ExpoDriver;
    constructor(driver: ExpoDriver);
    beforeMigration(): Promise<void>;
    afterMigration(): Promise<void>;
    query(query: string, parameters?: any[] | ObjectLiteral, useStructuredResult?: boolean): Promise<any>;
}
