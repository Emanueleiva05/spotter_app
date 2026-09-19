import { FindOperator } from "../FindOperator";
/**
 * Find Options Operator.
 *
 * @example
 * { someField: ILike("%SOME string%") }
 *
 * @param value
 */
export declare function ILike<T>(value: T | FindOperator<T>): FindOperator<T>;
