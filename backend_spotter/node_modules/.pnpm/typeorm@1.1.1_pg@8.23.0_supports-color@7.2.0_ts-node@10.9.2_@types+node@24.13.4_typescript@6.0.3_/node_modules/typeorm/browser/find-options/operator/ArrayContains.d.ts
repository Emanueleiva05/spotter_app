import { FindOperator } from "../FindOperator";
/**
 * FindOptions Operator.
 *
 * @example
 * { someField: ArrayContains([...]) }
 *
 * @param value
 */
export declare function ArrayContains<T>(value: readonly T[] | FindOperator<T>): FindOperator<any>;
