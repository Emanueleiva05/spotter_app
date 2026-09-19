import type { TreeType } from "../../metadata/types/TreeTypes";
import type { ClosureTreeOptions } from "../../metadata/types/ClosureTreeOptions";
/**
 * Marks entity to work like a tree.
 * Tree pattern that will be used for the tree entity should be specified.
 *
 * @param type
 * @param options
 * `@TreeParent` decorator must be used in tree entities.
 * `TreeRepository` can be used to manipulate tree entities.
 */
export declare function Tree(type: TreeType, options?: ClosureTreeOptions): ClassDecorator;
