import { AbstractLogger } from "./AbstractLogger";
import type { LogLevel, LogMessage } from "./Logger";
import type { QueryRunner } from "../query-runner/QueryRunner";
/**
 * Performs logging of the events in TypeORM.
 * This version of logger uses console to log events and use syntax highlighting.
 */
export declare class AdvancedConsoleLogger extends AbstractLogger {
    /**
     * Write log to specific output.
     *
     * @param level
     * @param logMessage
     * @param queryRunner
     */
    protected writeLog(level: LogLevel, logMessage: LogMessage | LogMessage[], queryRunner?: QueryRunner): void;
}
