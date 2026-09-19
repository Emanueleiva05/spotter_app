import type { Logger, LogLevel, LogMessage, LogMessageType, PrepareLogMessagesOptions } from "./Logger";
import type { QueryRunner } from "../query-runner/QueryRunner";
import type { LoggerOptions } from "./LoggerOptions";
import type { ObjectLiteral } from "../common/ObjectLiteral";
export declare abstract class AbstractLogger implements Logger {
    protected options?: LoggerOptions | undefined;
    constructor(options?: LoggerOptions | undefined);
    /**
     * Logs query and parameters used in it.
     *
     * @param query
     * @param parameters
     * @param queryRunner
     */
    logQuery(query: string, parameters?: any[] | ObjectLiteral, queryRunner?: QueryRunner): void;
    /**
     * Logs query that is failed.
     *
     * @param error
     * @param query
     * @param parameters
     * @param queryRunner
     */
    logQueryError(error: string, query: string, parameters?: any[] | ObjectLiteral, queryRunner?: QueryRunner): void;
    /**
     * Logs query that is slow.
     *
     * @param time
     * @param query
     * @param parameters
     * @param queryRunner
     */
    logQuerySlow(time: number, query: string, parameters?: any[] | ObjectLiteral, queryRunner?: QueryRunner): void;
    /**
     * Logs events from the schema build process.
     *
     * @param message
     * @param queryRunner
     */
    logSchemaBuild(message: string, queryRunner?: QueryRunner): void;
    /**
     * Logs events from the migration run process.
     *
     * @param message
     * @param queryRunner
     */
    logMigration(message: string, queryRunner?: QueryRunner): void;
    /**
     * Perform logging using given logger, or by default to the console.
     * Log has its own level and message.
     *
     * @param level
     * @param message
     * @param queryRunner
     */
    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner): void;
    /**
     * Check is logging for level or message type is enabled.
     *
     * @param type
     */
    protected isLogEnabledFor(type?: LogLevel | LogMessageType): boolean;
    /**
     * Write log to specific output.
     */
    protected abstract writeLog(level: LogLevel, message: LogMessage | string | number | (LogMessage | string | number)[], queryRunner?: QueryRunner): void;
    /**
     * Prepare and format log messages
     *
     * @param logMessage
     * @param options
     * @param queryRunner
     */
    protected prepareLogMessages(logMessage: LogMessage | string | number | (LogMessage | string | number)[], options?: Partial<PrepareLogMessagesOptions>, queryRunner?: QueryRunner): LogMessage[];
    /**
     * Converts parameters to a string.
     * Sometimes parameters can have circular objects and therefor we are handle this case too.
     *
     * @param parameters
     */
    protected stringifyParams(parameters: any[] | ObjectLiteral): string | any[] | ObjectLiteral;
}
