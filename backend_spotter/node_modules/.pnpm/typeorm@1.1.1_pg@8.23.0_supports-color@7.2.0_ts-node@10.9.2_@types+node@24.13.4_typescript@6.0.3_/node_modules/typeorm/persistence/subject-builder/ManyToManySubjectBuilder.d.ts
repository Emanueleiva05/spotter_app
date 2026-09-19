import { Subject } from "../Subject";
import type { ObjectLiteral } from "../../common/ObjectLiteral";
import type { RelationMetadata } from "../../metadata/RelationMetadata";
/**
 * Builds operations needs to be executed for many-to-many relations of the given subjects.
 *
 * @example
 * // Post owns a many-to-many relation with Category in the property called "categories".
 * // If the user adds categories into the post and saves post we need to bind them.
 * // This operation requires updating the junction table.
 * \@ManyToMany(type => Category, category => category.posts) categories: Category[]
 *
 */
export declare class ManyToManySubjectBuilder {
    protected subjects: Subject[];
    constructor(subjects: Subject[]);
    /**
     * Builds operations for any changes in the many-to-many relations of the subjects.
     */
    build(): void;
    /**
     * Builds operations for removal of all many-to-many records of all many-to-many relations of the given subject.
     *
     * @param subject
     */
    buildForAllRemoval(subject: Subject): void;
    /**
     * Builds operations for a given subject and relation.
     *
     * by example: subject is "post" entity we are saving here and relation is "categories" inside it here.
     *
     * @param subject
     * @param relation
     */
    protected buildForSubjectRelation(subject: Subject, relation: RelationMetadata): void;
    /**
     * Creates identifiers for junction table.
     *
     * @example
     * { postId: 1, categoryId: 2 }
     *
     * @param subject
     * @param relation
     * @param relationId
     */
    protected buildJunctionIdentifier(subject: Subject, relation: RelationMetadata, relationId: ObjectLiteral): ObjectLiteral;
}
