import type { UniqueOptions } from "./options/UniqueOptions";
/**
 * Composite unique constraint must be set on entity classes and must specify entity's fields to be unique.
 *
 * @param name
 * @param fields
 * @param options
 */
export declare function Unique(name: string, fields: string[], options?: UniqueOptions): ClassDecorator & PropertyDecorator;
/**
 * Composite unique constraint must be set on entity classes and must specify entity's fields to be unique.
 *
 * @param fields
 * @param options
 */
export declare function Unique(fields: string[], options?: UniqueOptions): ClassDecorator & PropertyDecorator;
/**
 * Composite unique constraint must be set on entity classes and must specify entity's fields to be unique.
 *
 * @param fields
 * @param options
 */
export declare function Unique(fields: (object?: any) => any[] | {
    [key: string]: number;
}, options?: UniqueOptions): ClassDecorator & PropertyDecorator;
/**
 * Composite unique constraint must be set on entity classes and must specify entity's fields to be unique.
 *
 * @param name
 * @param fields
 * @param options
 */
export declare function Unique(name: string, fields: (object?: any) => any[] | {
    [key: string]: number;
}, options?: UniqueOptions): ClassDecorator & PropertyDecorator;
