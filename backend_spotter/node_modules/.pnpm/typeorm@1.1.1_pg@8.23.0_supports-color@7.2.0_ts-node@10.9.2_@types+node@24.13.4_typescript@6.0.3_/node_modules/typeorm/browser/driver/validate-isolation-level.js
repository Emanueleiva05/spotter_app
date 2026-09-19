"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIsolationLevel = void 0;
const TypeORMError_1 = require("../error/TypeORMError");
/**
 * Validates that the given isolation level is in the provided list of supported levels.
 * Throws a TypeORMError if not supported.
 *
 * @param supported
 * @param isolationLevel
 */
const validateIsolationLevel = (supported, isolationLevel) => {
    if (!isolationLevel)
        return;
    if (!supported || !Array.isArray(supported)) {
        throw new TypeORMError_1.TypeORMError(`Driver must define supportedIsolationLevels to use isolationLevel option`);
    }
    if (!supported.includes(isolationLevel)) {
        throw new TypeORMError_1.TypeORMError(`${isolationLevel} isolation level is not supported`);
    }
};
exports.validateIsolationLevel = validateIsolationLevel;
//# sourceMappingURL=validate-isolation-level.js.map