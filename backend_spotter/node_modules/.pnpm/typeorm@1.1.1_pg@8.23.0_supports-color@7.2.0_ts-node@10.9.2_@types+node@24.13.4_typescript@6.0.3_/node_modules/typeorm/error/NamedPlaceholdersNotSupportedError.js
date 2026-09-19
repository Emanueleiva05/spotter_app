"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedPlaceholdersNotSupportedError = void 0;
const TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when trying to use named placeholders with an incompatible driver.
 */
class NamedPlaceholdersNotSupportedError extends TypeORMError_1.TypeORMError {
    constructor() {
        super(`Your driver does not support named placeholders.`);
    }
}
exports.NamedPlaceholdersNotSupportedError = NamedPlaceholdersNotSupportedError;
//# sourceMappingURL=NamedPlaceholdersNotSupportedError.js.map