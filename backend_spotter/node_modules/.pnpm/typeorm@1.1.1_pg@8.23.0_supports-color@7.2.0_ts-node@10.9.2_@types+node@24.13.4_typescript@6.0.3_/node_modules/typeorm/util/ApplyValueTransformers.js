"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyValueTransformers = void 0;
const InstanceChecker_1 = require("./InstanceChecker");
class ApplyValueTransformers {
    static transformFrom(transformer, databaseValue) {
        if (Array.isArray(transformer)) {
            const reverseTransformers = transformer.slice().reverse();
            return reverseTransformers.reduce((transformedValue, _transformer) => {
                return _transformer.from(transformedValue);
            }, databaseValue);
        }
        return transformer.from(databaseValue);
    }
    static transformTo(transformer, entityValue) {
        if (InstanceChecker_1.InstanceChecker.isFindOperator(entityValue)) {
            entityValue.transformValue(transformer);
            return entityValue;
        }
        if (Array.isArray(transformer)) {
            return transformer.reduce((transformedValue, _transformer) => {
                return _transformer.to(transformedValue);
            }, entityValue);
        }
        return transformer.to(entityValue);
    }
}
exports.ApplyValueTransformers = ApplyValueTransformers;
//# sourceMappingURL=ApplyValueTransformers.js.map