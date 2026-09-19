/**
 * Helper utility functions for QueryBuilder.
 */
export declare class QueryBuilderUtils {
    /**
     * Checks if given value is a string representation of alias property,
     * e.g. "post.category" or "post.id".
     *
     * @param str
     */
    static isAliasProperty(str: any): str is string;
}
