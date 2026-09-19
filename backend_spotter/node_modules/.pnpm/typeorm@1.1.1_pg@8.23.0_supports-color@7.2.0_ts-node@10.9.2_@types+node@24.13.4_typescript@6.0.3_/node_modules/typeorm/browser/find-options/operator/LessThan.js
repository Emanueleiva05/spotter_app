"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessThan = LessThan;
const FindOperator_1 = require("../FindOperator");
/**
 * Find Options Operator.
 *
 * @example
 * { someField: LessThan(10) }
 *
 * @param value
 */
function LessThan(value) {
    return new FindOperator_1.FindOperator("lessThan", value);
}
//# sourceMappingURL=LessThan.js.map