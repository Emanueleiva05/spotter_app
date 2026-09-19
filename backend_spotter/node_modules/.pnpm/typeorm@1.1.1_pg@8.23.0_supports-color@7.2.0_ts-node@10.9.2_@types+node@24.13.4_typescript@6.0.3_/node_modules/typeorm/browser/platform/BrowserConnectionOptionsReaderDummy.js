"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionOptionsReader = exports.ConnectionOptionsYmlReader = exports.ConnectionOptionsXmlReader = void 0;
/**
 * Dummy class for replacement via `package.json` in browser builds.
 *
 * If we don't include these functions typeorm will throw an error on runtime
 * as well as during webpack builds.
 */
class ConnectionOptionsXmlReader {
    async read(path) {
        throw new Error(`Cannot read connection options in a browser context.`);
    }
}
exports.ConnectionOptionsXmlReader = ConnectionOptionsXmlReader;
/**
 * Dummy class for replacement via `package.json` in browser builds.
 *
 * If we don't include these functions typeorm will throw an error on runtime
 * as well as during webpack builds.
 */
class ConnectionOptionsYmlReader {
    async read(path) {
        throw new Error(`Cannot read connection options in a browser context.`);
    }
}
exports.ConnectionOptionsYmlReader = ConnectionOptionsYmlReader;
/**
 * Dummy class for replacement via `package.json` in browser builds.
 *
 * If we don't include these functions typeorm will throw an error on runtime
 * as well as during webpack builds.
 */
class ConnectionOptionsReader {
    async get() {
        throw new Error(`Cannot read connection options in a browser context.`);
    }
}
exports.ConnectionOptionsReader = ConnectionOptionsReader;
//# sourceMappingURL=BrowserConnectionOptionsReaderDummy.js.map