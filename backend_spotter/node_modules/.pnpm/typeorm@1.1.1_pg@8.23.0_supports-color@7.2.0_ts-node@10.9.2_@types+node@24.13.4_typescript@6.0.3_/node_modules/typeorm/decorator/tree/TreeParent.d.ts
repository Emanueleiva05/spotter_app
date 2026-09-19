import type { OnDeleteType } from "../../metadata/types/OnDeleteType";
/**
 * Marks an entity property as a parent of the tree.
 * "Tree parent" indicates who owns (is a parent) of this entity in tree structure.
 *
 * @param options
 * @param options.onDelete
 */
export declare function TreeParent(options?: {
    onDelete?: OnDeleteType;
}): PropertyDecorator;
