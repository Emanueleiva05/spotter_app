import { Subject } from "../Subject";
import type { RelationMetadata } from "../../metadata/RelationMetadata";
/**
 * Builds operations needs to be executed for one-to-many relations of the given subjects.
 *
 * Note: this class shares lot of things with OneToOneInverseSideOperationBuilder,
 * so when you change this class make sure to reflect changes there as well.
 *
 * @example
 * // Post contains one-to-many relation with Category in the property called "categories".
 * // If user adds categories into the post and saves post we need to bind them.
 * // This operation requires updating the category table since it's the owner of
 * // the relation and contains a join column.
 * \@OneToMany(type => Category, category => category.post) categories: Category[]
 *
 */
export declare class OneToManySubjectBuilder {
    protected subjects: Subject[];
    constructor(subjects: Subject[]);
    /**
     * Builds all required operations.
     */
    build(): void;
    /**
     * Builds operations for a given subject and relation.
     *
     * by example: subject is "post" entity we are saving here and relation is "categories" inside it here.
     *
     * @param subject
     * @param relation
     */
    protected buildForSubjectRelation(subject: Subject, relation: RelationMetadata): void;
}
