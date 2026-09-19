"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableExclusion = void 0;
/**
 * Database's table exclusion constraint stored in this class.
 */
class TableExclusion {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(options) {
        this["@instanceof"] = Symbol.for("TableExclusion");
        this.name = options.name;
        this.expression = options.expression;
        this.deferrable = options.deferrable;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new copy of this constraint with exactly same properties.
     */
    clone() {
        return new TableExclusion({
            name: this.name,
            expression: this.expression,
            deferrable: this.deferrable,
        });
    }
    // -------------------------------------------------------------------------
    // Static Methods
    // -------------------------------------------------------------------------
    /**
     * Creates exclusions from the exclusion metadata object.
     *
     * @param exclusionMetadata
     */
    static create(exclusionMetadata) {
        return new TableExclusion({
            name: exclusionMetadata.name,
            expression: exclusionMetadata.expression,
            deferrable: exclusionMetadata.deferrable,
        });
    }
}
exports.TableExclusion = TableExclusion;
//# sourceMappingURL=TableExclusion.js.map