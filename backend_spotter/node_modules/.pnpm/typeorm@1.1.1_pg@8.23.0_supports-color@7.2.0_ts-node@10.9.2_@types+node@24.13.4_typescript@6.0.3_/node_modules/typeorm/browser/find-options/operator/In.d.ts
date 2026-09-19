import { FindOperator } from "../FindOperator";
/**
 * Find Options Operator.
 *
 * @example
 * { someField: In([...]) }
 *
 * @param value
 */
export declare function In<T>(value: readonly T[] | FindOperator<T>): FindOperator<any>;
