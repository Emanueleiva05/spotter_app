import { FindOperator } from "../FindOperator";
/**
 * Find Options Operator.
 *
 * @example
 * { someField: MoreThan(10) }
 *
 * @param value
 */
export declare function MoreThan<T>(value: T | FindOperator<T>): FindOperator<T>;
