import { FindOperator } from "../FindOperator";
/**
 * Find Options Operator.
 *
 * @example
 * { someField: Between(x, y) }
 *
 * @param from
 * @param to
 */
export declare function Between<T>(from: T | FindOperator<T>, to: T | FindOperator<T>): FindOperator<T>;
