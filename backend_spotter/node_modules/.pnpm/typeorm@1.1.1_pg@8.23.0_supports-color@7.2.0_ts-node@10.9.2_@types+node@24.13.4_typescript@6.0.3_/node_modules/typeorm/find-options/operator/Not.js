"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Not = Not;
const FindOperator_1 = require("../FindOperator");
/**
 * Find Options Operator.
 * Used to negate expression.
 *
 * @example
 * { title: Not("hello") }
 *
 * @param value
 */
function Not(value) {
    return new FindOperator_1.FindOperator("not", value);
}
//# sourceMappingURL=Not.js.map