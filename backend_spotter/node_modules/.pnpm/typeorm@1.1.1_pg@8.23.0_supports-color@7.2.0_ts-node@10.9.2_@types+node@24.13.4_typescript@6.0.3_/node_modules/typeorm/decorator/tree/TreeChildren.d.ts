/**
 * Marks an entity property as a children of the tree.
 * "Tree children" will contain all children (bind) of this entity.
 *
 * @param options
 * @param options.cascade
 */
export declare function TreeChildren(options?: {
    cascade?: boolean | ("insert" | "update" | "remove" | "soft-remove" | "recover")[];
}): PropertyDecorator;
