import { FindOperator } from "../FindOperator";
/**
 * Find Options Operator.
 *
 * @example
 * { someField: Any([...]) }
 *
 * @param value
 */
export declare function Any<T>(value: readonly T[] | FindOperator<T>): FindOperator<T>;
