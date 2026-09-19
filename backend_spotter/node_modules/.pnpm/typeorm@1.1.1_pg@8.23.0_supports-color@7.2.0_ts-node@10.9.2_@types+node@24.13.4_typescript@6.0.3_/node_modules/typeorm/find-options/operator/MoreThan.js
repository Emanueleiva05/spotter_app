"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoreThan = MoreThan;
const FindOperator_1 = require("../FindOperator");
/**
 * Find Options Operator.
 *
 * @example
 * { someField: MoreThan(10) }
 *
 * @param value
 */
function MoreThan(value) {
    return new FindOperator_1.FindOperator("moreThan", value);
}
//# sourceMappingURL=MoreThan.js.map