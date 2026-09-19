"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessThanOrEqual = LessThanOrEqual;
const FindOperator_1 = require("../FindOperator");
/**
 * Find Options Operator.
 *
 * @example
 * { someField: LessThanOrEqual(10) }
 *
 * @param value
 */
function LessThanOrEqual(value) {
    return new FindOperator_1.FindOperator("lessThanOrEqual", value);
}
//# sourceMappingURL=LessThanOrEqual.js.map