"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoConnectionForRepositoryError = void 0;
const TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when consumer tries to access repository before connection is established.
 */
class NoConnectionForRepositoryError extends TypeORMError_1.TypeORMError {
    constructor(dataSourceName) {
        super(`Cannot get a Repository for the "${dataSourceName}" DataSource, because connection with the database ` +
            `is not established yet. Call dataSource#initialize method to establish connection.`);
    }
}
exports.NoConnectionForRepositoryError = NoConnectionForRepositoryError;
//# sourceMappingURL=NoConnectionForRepositoryError.js.map