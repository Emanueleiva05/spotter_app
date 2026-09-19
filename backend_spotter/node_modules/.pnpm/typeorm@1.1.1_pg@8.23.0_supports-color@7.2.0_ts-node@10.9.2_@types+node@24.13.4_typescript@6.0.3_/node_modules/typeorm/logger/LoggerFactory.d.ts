import type { Logger } from "./Logger";
import type { LoggerOptions } from "./LoggerOptions";
/**
 * Helps to create logger instances.
 */
export declare class LoggerFactory {
    /**
     * Creates a new logger depend on a given connection's driver.
     *
     * @param logger
     * @param options
     */
    create(logger?: "advanced-console" | "simple-console" | "formatted-console" | "file" | "debug" | Logger, options?: LoggerOptions): Logger;
}
