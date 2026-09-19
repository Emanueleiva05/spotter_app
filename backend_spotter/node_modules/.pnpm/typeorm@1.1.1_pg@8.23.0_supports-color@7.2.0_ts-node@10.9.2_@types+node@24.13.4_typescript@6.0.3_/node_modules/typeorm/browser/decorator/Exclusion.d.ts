import type { ExclusionOptions } from "./options/ExclusionOptions";
/**
 * Creates a database exclusion.
 * Can be used on entity.
 * Can create exclusions with composite columns when used on entity.
 *
 * @param expression
 * @param options
 */
export declare function Exclusion(expression: string, options?: ExclusionOptions): ClassDecorator & PropertyDecorator;
/**
 * Creates a database exclusion.
 * Can be used on entity.
 * Can create exclusions with composite columns when used on entity.
 *
 * @param name
 * @param expression
 * @param options
 */
export declare function Exclusion(name: string, expression: string, options?: ExclusionOptions): ClassDecorator & PropertyDecorator;
