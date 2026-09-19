import type { DataSource as dataSource } from "../data-source/DataSource";
import { EntityManager } from "./EntityManager";
import type { QueryRunner } from "../query-runner/QueryRunner";
/**
 * Helps to create entity managers.
 */
export declare class EntityManagerFactory {
    /**
     * Creates a new entity manager depend on a given connection's driver.
     *
     * @param dataSource
     * @param queryRunner
     * @returns an EntityManager specialized for the driver
     */
    create(dataSource: dataSource, queryRunner?: QueryRunner): EntityManager;
}
