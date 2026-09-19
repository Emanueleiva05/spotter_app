import { FindOperator } from "../FindOperator";
/**
 * FindOptions Operator.
 *
 * @example
 * { someField: ArrayOverlap([...]) }
 *
 * @param value
 */
export declare function ArrayOverlap<T>(value: readonly T[] | FindOperator<T>): FindOperator<any>;
