"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileLogger = exports.DummyLogger = void 0;
/**
 * Performs logging of the events in TypeORM.
 * This version of logger logs everything into ormlogs.log file.
 */
class DummyLogger {
    /**
     * Logs query and parameters used in it.
     */
    logQuery() {
        throw new Error('This logger is not applicable in a browser context');
    }
    /**
     * Logs query that is failed.
     */
    logQueryError() {
        throw new Error('This logger is not applicable in a browser context');
    }
    /**
     * Logs query that is slow.
     */
    logQuerySlow() {
        throw new Error('This logger is not applicable in a browser context');
    }
    /**
     * Logs events from the schema build process.
     */
    logSchemaBuild() {
        throw new Error('This logger is not applicable in a browser context');
    }
    /**
     * Logs events from the migrations run process.
     */
    logMigration() {
        throw new Error('This logger is not applicable in a browser context');
    }
    /**
     * Perform logging using given logger, or by default to the console.
     * Log has its own level and message.
     */
    log() {
        throw new Error('This logger is not applicable in a browser context');
    }
}
exports.DummyLogger = DummyLogger;
class FileLogger extends DummyLogger {
}
exports.FileLogger = FileLogger;
//# sourceMappingURL=BrowserFileLoggerDummy.js.map