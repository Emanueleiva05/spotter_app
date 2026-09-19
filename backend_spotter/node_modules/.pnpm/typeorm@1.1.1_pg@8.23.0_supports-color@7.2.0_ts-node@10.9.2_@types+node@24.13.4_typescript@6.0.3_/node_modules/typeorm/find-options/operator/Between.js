"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Between = Between;
const FindOperator_1 = require("../FindOperator");
/**
 * Find Options Operator.
 *
 * @example
 * { someField: Between(x, y) }
 *
 * @param from
 * @param to
 */
function Between(from, to) {
    return new FindOperator_1.FindOperator("between", [from, to], true, true);
}
//# sourceMappingURL=Between.js.map