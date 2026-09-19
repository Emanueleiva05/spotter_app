/**
 * Metadata args utility functions.
 */
export declare class MetadataUtils {
    /**
     * Gets given's entity all inherited classes.
     * Gives in order from parents to children.
     * For example Post extends ContentModel which extends Unit it will give
     * [Unit, ContentModel, Post]
     *
     * @param entity
     */
    static getInheritanceTree(entity: Function): Function[];
    /**
     * Checks if this table is inherited from another table.
     *
     * @param target1
     * @param target2
     */
    static isInherited(target1: Function, target2: Function): boolean;
    /**
     * Filters given array of targets by a given classes.
     * If classes are not given, then it returns array itself.
     *
     * @param array
     * @param classes
     */
    static filterByTarget<T extends {
        target?: any;
    }>(array: T[], classes?: any[]): T[];
}
