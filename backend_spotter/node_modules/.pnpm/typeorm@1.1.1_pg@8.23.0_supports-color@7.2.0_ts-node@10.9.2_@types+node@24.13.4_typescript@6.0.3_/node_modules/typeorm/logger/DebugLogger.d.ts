import { AbstractLogger } from "./AbstractLogger";
import type { LogLevel, LogMessage, LogMessageType } from "./Logger";
import type { QueryRunner } from "../query-runner/QueryRunner";
/**
 * Performs logging of the events in TypeORM via debug library.
 */
export declare class DebugLogger extends AbstractLogger {
    /**
     * Object with all debug logger.
     */
    private logger;
    /**
     * Check is logging for level or message type is enabled.
     *
     * @param type
     */
    protected isLogEnabledFor(type?: LogLevel | LogMessageType): boolean;
    /**
     * Write log to specific output.
     *
     * @param level
     * @param logMessage
     * @param queryRunner
     */
    protected writeLog(level: LogLevel, logMessage: LogMessage | LogMessage[], queryRunner?: QueryRunner): void;
}
