import { FindOperator } from "../FindOperator";
/**
 * Find Options Operator.
 *
 * @example
 * { someField: LessThan(10) }
 *
 * @param value
 */
export declare function LessThan<T>(value: T | FindOperator<T>): FindOperator<T>;
