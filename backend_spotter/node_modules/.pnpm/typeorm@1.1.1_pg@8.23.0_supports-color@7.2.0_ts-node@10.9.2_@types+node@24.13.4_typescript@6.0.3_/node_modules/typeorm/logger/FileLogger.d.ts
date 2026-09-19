import type { QueryRunner } from "../query-runner/QueryRunner";
import { AbstractLogger } from "./AbstractLogger";
import type { LogLevel, LogMessage } from "./Logger";
import type { LoggerOptions } from "./LoggerOptions";
/**
 * File logging option.
 */
export type FileLoggerOptions = {
    /**
     * Specify custom path for the log file
     */
    logPath: string;
};
/**
 * Performs logging of the events in TypeORM.
 * This version of logger logs everything into ormlogs.log file.
 */
export declare class FileLogger extends AbstractLogger {
    private fileLoggerOptions?;
    constructor(options?: LoggerOptions, fileLoggerOptions?: FileLoggerOptions | undefined);
    /**
     * Write log to specific output.
     *
     * @param level
     * @param logMessage
     * @param queryRunner
     */
    protected writeLog(level: LogLevel, logMessage: LogMessage | LogMessage[], queryRunner?: QueryRunner): void;
    /**
     * Writes given strings into the log file.
     *
     * @param strings
     */
    protected write(strings: string | string[]): void;
}
