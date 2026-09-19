"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExclusionMetadata = void 0;
/**
 * Exclusion metadata contains all information about table's exclusion constraints.
 */
class ExclusionMetadata {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    constructor(options) {
        this.entityMetadata = options.entityMetadata;
        if (options.args) {
            this.target = options.args.target;
            this.expression = options.args.expression;
            this.givenName = options.args.name;
            this.deferrable = options.args.deferrable;
        }
    }
    // ---------------------------------------------------------------------
    // Public Build Methods
    // ---------------------------------------------------------------------
    /**
     * Builds some depend exclusion constraint properties.
     * Must be called after all entity metadata's properties map, columns and relations are built.
     *
     * @param namingStrategy
     */
    build(namingStrategy) {
        this.name =
            this.givenName ??
                namingStrategy.exclusionConstraintName(this.entityMetadata.tableName, this.expression);
        return this;
    }
}
exports.ExclusionMetadata = ExclusionMetadata;
//# sourceMappingURL=ExclusionMetadata.js.map