import type { Subject } from "./Subject";
/**
 * Finds what columns are changed in the subject entities.
 */
export declare class SubjectChangedColumnsComputer {
    /**
     * Finds what columns are changed in the subject entities.
     *
     * @param subjects List of subjects for which to compute changed columns.
     */
    compute(subjects: Subject[]): void;
    /**
     * Differentiate columns from the updated entity and entity stored in the database.
     *
     * @param subject Subject for which to compute differentiated columns.
     */
    protected computeDiffColumns(subject: Subject): void;
    /**
     * Difference columns of the owning one-to-one and many-to-one columns.
     *
     * @param allSubjects List of all subjects in the current operation.
     * @param subject Subject for which to compute differentiated relational columns.
     */
    protected computeDiffRelationalColumns(allSubjects: Subject[], subject: Subject): void;
}
