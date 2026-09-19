/**
 * Converts string into camelCase.
 *
 * @param str String to be converted.
 * @param firstCapital If true, the first character will be capitalized.
 * @returns camelCase string
 * @see http://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
 */
export declare function camelCase(str: string, firstCapital?: boolean): string;
/**
 * Converts string into snake_case.
 *
 * @param str String to be converted.
 * @returns snake_case string
 */
export declare function snakeCase(str: string): string;
/**
 * Converts string into Title Case.
 *
 * @param str String to be converted.
 * @returns Title Case string
 * @see http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
 */
export declare function titleCase(str: string): string;
export interface IShortenOptions {
    /** String used to split "segments" of the alias/column name */
    separator?: string;
    /** Maximum length of any "segment" */
    segmentLength?: number;
    /** Length of any "term" in a "segment"; "OrderItem" is a segment, "Order" and "Items" are terms */
    termLength?: number;
}
/**
 * Shorten a given `input`. Useful for RDBMS imposing a limit on the
 * maximum length of aliases and column names in SQL queries.
 *
 * @example
 * // returns: "UsShCa__orde__mark__dire"
 * shorten('UserShoppingCart__order__market__director')
 *
 * // returns: "cat_wit_ver_lon_nam_pos_wit_ver_lon_nam_pos_wit_ver_lon_nam"
 * shorten(
 *   'category_with_very_long_name_posts_with_very_long_name_post_with_very_long_name',
 *   { separator: '_', segmentLength: 3 }
 * )
 *
 * // equals: UsShCa__orde__mark_market_id
 * `${shorten('UserShoppingCart__order__market')}_market_id`
 *
 * @param input String to be shortened.
 * @param options Default to `4` for segments length, `2` for terms length, `'__'` as a separator.
 * @returns Shortened `input`.
 */
export declare function shorten(input: string, options?: IShortenOptions): string;
interface IHashOptions {
    length?: number;
}
/**
 * Returns a SHA-1 hex digest for internal IDs/aliases (not for cryptographic security)
 *
 * @param input String to be hashed.
 * @param options - Options object.
 * @param options.length Optionally, shorten the output to desired length.
 * @returns SHA-1 hex digest
 */
export declare function hash(input: string, options?: IHashOptions): string;
export {};
