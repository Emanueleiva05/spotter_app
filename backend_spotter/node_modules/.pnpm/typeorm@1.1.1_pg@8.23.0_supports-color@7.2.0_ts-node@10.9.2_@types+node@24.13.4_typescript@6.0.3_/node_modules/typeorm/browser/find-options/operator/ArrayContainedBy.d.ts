import { FindOperator } from "../FindOperator";
/**
 * FindOptions Operator.
 *
 * @example
 * { someField: ArrayContainedBy([...]) }
 *
 * @param value
 */
export declare function ArrayContainedBy<T>(value: readonly T[] | FindOperator<T>): FindOperator<any>;
