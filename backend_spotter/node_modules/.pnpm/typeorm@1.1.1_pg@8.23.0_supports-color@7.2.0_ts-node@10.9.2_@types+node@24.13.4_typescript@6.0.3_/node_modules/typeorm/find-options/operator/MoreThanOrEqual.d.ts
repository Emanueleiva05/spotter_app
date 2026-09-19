import { FindOperator } from "../FindOperator";
/**
 * Find Options Operator.
 *
 * @example
 * { someField: MoreThanOrEqual(10) }
 *
 * @param value
 */
export declare function MoreThanOrEqual<T>(value: T | FindOperator<T>): FindOperator<T>;
