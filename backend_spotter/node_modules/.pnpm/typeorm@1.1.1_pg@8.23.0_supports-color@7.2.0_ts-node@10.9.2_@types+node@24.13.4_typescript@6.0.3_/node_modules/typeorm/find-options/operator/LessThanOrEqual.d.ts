import { FindOperator } from "../FindOperator";
/**
 * Find Options Operator.
 *
 * @example
 * { someField: LessThanOrEqual(10) }
 *
 * @param value
 */
export declare function LessThanOrEqual<T>(value: T | FindOperator<T>): FindOperator<T>;
