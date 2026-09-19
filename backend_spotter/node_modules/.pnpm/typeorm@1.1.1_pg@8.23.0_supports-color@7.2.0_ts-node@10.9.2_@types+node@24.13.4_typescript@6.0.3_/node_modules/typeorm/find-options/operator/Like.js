"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = Like;
const FindOperator_1 = require("../FindOperator");
/**
 * Find Options Operator.
 *
 * @example
 * { someField: Like("%some string%") }
 *
 * @param value
 */
function Like(value) {
    return new FindOperator_1.FindOperator("like", value);
}
//# sourceMappingURL=Like.js.map