import type { DeepPartial } from "../common/DeepPartial";
import type { ObjectLiteral } from "../common/ObjectLiteral";
import type { PrimitiveCriteria, SinglePrimitiveCriteria } from "../common/PrimitiveCriteria";
import type { InvalidFindOptionsWhereBehavior } from "../driver/types/InvalidFindOptionsWhereBehavior";
export declare class OrmUtils {
    /**
     * Chunks array into pieces.
     *
     * @param array
     * @param size
     */
    static chunk<T>(array: T[], size: number): T[][];
    static splitClassesAndStrings<T>(classesAndStrings: (string | T)[]): [T[], string[]];
    static groupBy<T, R>(array: T[], propertyCallback: (item: T) => R): {
        id: R;
        items: T[];
    }[];
    static uniq<T>(array: T[], criteria?: (item: T) => unknown): T[];
    static uniq<T, K extends keyof T>(array: T[], property: K): T[];
    /**
     * Deep Object.assign.
     *
     * @param target
     * @param sources
     */
    static mergeDeep<T>(target: T, ...sources: (DeepPartial<T> | undefined)[]): T;
    /**
     * Creates a shallow copy of the object, without invoking the constructor
     *
     * @param object
     */
    static cloneObject<T extends object>(object: T): T;
    /**
     * Deep compare objects.
     *
     * @param args
     * @see http://stackoverflow.com/a/1144249
     */
    static deepCompare<T>(...args: T[]): boolean;
    /**
     * Gets deeper value of object.
     * Returns undefined when the path runs off the end of the object.
     *
     * @param obj
     * @param path
     */
    static deepValue(obj: ObjectLiteral, path: string): any;
    static replaceEmptyObjectsWithBooleans(obj: any): void;
    static propertyPathsToTruthyObject(paths: string[]): any;
    /**
     * Check if two entity-id-maps are the same
     *
     * @param firstId
     * @param secondId
     */
    static compareIds(firstId: ObjectLiteral | undefined, secondId: ObjectLiteral | undefined): boolean;
    /**
     * Transforms given value into boolean value.
     *
     * @param value
     */
    static toBoolean(value: any): boolean;
    /**
     * Checks if two arrays of unique values contain the same values
     *
     * @param arr1
     * @param arr2
     */
    static isArraysEqual<T>(arr1: T[], arr2: T[]): boolean;
    /**
     * Returns items that are missing/extraneous in the second array
     *
     * @param arr1
     * @param arr2
     */
    static getArraysDiff<T>(arr1: T[], arr2: T[]): {
        extraItems: T[];
        missingItems: T[];
    };
    static areMutuallyExclusive<T>(...lists: T[][]): boolean;
    /**
     * Parses the CHECK constraint on the specified column and returns
     * all values allowed by the constraint or undefined if the constraint
     * is not present.
     *
     * @param sql
     * @param columnName
     */
    static parseSqlCheckExpression(sql: string, columnName: string): string[] | undefined;
    /**
     * Checks whether the given criteria is null or wholly empty — `null`,
     * `undefined`, `""`, an empty array, or an empty plain object. Does not
     * recurse into array elements, so it is safe on self-referential/cyclic
     * arrays. Per-element OR-branch emptiness (an array containing an empty
     * element) is handled where object criteria is validated, not here.
     *
     * @param criteria
     */
    static isCriteriaNullOrEmpty(criteria: unknown): boolean;
    /**
     * Checks if given criteria is a primitive value.
     * Primitive values are strings, numbers and dates.
     *
     * @param criteria
     */
    static isSinglePrimitiveCriteria(criteria: unknown): criteria is SinglePrimitiveCriteria;
    /**
     * Checks if given criteria is a primitive value or an array of primitive values.
     *
     * @param criteria
     */
    static isPrimitiveCriteria(criteria: unknown): criteria is PrimitiveCriteria;
    private static compare2Objects;
    private static isPlainObject;
    private static mergeArrayKey;
    private static mergeObjectKey;
    private static merge;
    /**
     * Applies invalidWhereValuesBehavior to a plain-object where criteria: for
     * each own key a null/undefined value is thrown on, skipped, or converted
     * to IsNull() per the configured behavior. A top-level array (OR list) is
     * normalized element by element. Anything else — an entity/class instance,
     * a FindOperator, Date, Buffer, a primitive — is returned untouched.
     *
     * When no behavior is configured, both sub-options default to "throw", so a
     * null/undefined value throws by default — matching the read/find path.
     *
     * @param criteria
     * @param options
     * @param path
     */
    static normalizeWhereCriteria(criteria: any, options?: InvalidFindOptionsWhereBehavior, path?: string): any;
}
