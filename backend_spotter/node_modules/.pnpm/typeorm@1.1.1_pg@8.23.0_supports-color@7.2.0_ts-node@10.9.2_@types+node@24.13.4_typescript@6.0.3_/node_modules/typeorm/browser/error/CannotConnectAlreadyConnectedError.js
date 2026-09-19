"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotConnectAlreadyConnectedError = void 0;
const TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when consumer tries to connect when he already connected.
 */
class CannotConnectAlreadyConnectedError extends TypeORMError_1.TypeORMError {
    constructor() {
        super(`Cannot initialize DataSource because it is already connected to the database.`);
    }
}
exports.CannotConnectAlreadyConnectedError = CannotConnectAlreadyConnectedError;
//# sourceMappingURL=CannotConnectAlreadyConnectedError.js.map