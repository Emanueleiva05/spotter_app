"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exclusion = Exclusion;
const globals_1 = require("../globals");
const error_1 = require("../error");
/**
 * Creates a database exclusion.
 * Can be used on entity.
 * Can create exclusions with composite columns when used on entity.
 *
 * @param nameOrExpression
 * @param expressionOrOptions
 * @param maybeOptions
 */
function Exclusion(nameOrExpression, expressionOrOptions, maybeOptions) {
    const hasName = typeof expressionOrOptions === "string";
    const name = hasName ? nameOrExpression : undefined;
    const expression = hasName ? expressionOrOptions : nameOrExpression;
    const options = hasName ? maybeOptions : expressionOrOptions;
    if (!expression)
        throw new error_1.TypeORMError(`Exclusion expression is required`);
    return function (clsOrObject, propertyName) {
        (0, globals_1.getMetadataArgsStorage)().exclusions.push({
            target: propertyName
                ? clsOrObject.constructor
                : clsOrObject,
            name: name,
            expression: expression,
            deferrable: options ? options.deferrable : undefined,
        });
    };
}
//# sourceMappingURL=Exclusion.js.map