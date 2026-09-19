import { FindOperator } from "../FindOperator";
/**
 * Find Options Operator.
 *
 * @example
 * { someField: Like("%some string%") }
 *
 * @param value
 */
export declare function Like<T>(value: T | FindOperator<T>): FindOperator<T>;
