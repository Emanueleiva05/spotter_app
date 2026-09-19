import { FindOperator } from "../FindOperator";
import type { ObjectLiteral } from "../../common/ObjectLiteral";
/**
 * Find Options Operator.
 *
 * @example
 * { someField: Raw("12") }
 *
 * @param value
 */
export declare function Raw<T>(value: string): FindOperator<any>;
/**
 * Find Options Operator.
 *
 * @example
 * { someField: Raw((columnAlias) => `${columnAlias} = 5`) }
 *
 * @param sqlGenerator
 */
export declare function Raw<T>(sqlGenerator: (columnAlias: string) => string): FindOperator<any>;
/**
 * Find Options Operator.
 * For escaping parameters use next syntax:
 *
 * @example
 * { someField: Raw((columnAlias) => `${columnAlias} = :value`, { value: 5 }) }
 *
 * @param sqlGenerator
 * @param parameters
 */
export declare function Raw<T>(sqlGenerator: (columnAlias: string) => string, parameters: ObjectLiteral): FindOperator<any>;
