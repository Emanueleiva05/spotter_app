import type { Driver } from "../driver/Driver";
interface BuildSqlTagParams {
    driver: Driver;
    strings: TemplateStringsArray;
    expressions: unknown[];
}
/**
 *
 * @param root0
 * @param root0.driver
 * @param root0.strings
 * @param root0.expressions
 */
export declare function buildSqlTag({ driver, strings, expressions, }: BuildSqlTagParams): {
    query: string;
    parameters: unknown[];
};
export {};
