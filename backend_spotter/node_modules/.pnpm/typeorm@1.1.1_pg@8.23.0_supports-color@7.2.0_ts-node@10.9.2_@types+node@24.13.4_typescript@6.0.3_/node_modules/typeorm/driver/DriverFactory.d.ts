import type { DataSource } from "../data-source/DataSource";
import type { Driver } from "./Driver";
/**
 * Helps to create drivers.
 */
export declare class DriverFactory {
    /**
     * Creates a new driver depend on a given connection's driver type.
     *
     * @param dataSource DataSource instance.
     * @returns Driver
     */
    create(dataSource: DataSource): Driver;
}
