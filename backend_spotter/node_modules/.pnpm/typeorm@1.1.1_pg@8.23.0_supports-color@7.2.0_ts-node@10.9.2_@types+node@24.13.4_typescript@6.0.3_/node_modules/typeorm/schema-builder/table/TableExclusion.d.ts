import type { TableExclusionOptions } from "../options/TableExclusionOptions";
import type { ExclusionMetadata } from "../../metadata/ExclusionMetadata";
/**
 * Database's table exclusion constraint stored in this class.
 */
export declare class TableExclusion {
    readonly "@instanceof": symbol;
    /**
     * Constraint name.
     */
    name?: string;
    /**
     * Exclusion expression.
     */
    expression?: string;
    /**
     * Set this exclusion constraint as "DEFERRABLE" e.g. check constraints at start
     * or at the end of a transaction
     */
    deferrable?: string;
    constructor(options: TableExclusionOptions);
    /**
     * Creates a new copy of this constraint with exactly same properties.
     */
    clone(): TableExclusion;
    /**
     * Creates exclusions from the exclusion metadata object.
     *
     * @param exclusionMetadata
     */
    static create(exclusionMetadata: ExclusionMetadata): TableExclusion;
}
