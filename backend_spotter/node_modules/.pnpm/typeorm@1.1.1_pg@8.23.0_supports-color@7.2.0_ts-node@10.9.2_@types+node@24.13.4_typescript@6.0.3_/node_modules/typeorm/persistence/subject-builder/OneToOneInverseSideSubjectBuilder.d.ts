import { Subject } from "../Subject";
import type { RelationMetadata } from "../../metadata/RelationMetadata";
/**
 * Builds operations needs to be executed for one-to-one non-owner relations of the given subjects.
 *
 * Note: this class shares lot of things with `OneToManyUpdateBuilder`, so when
 * you change this class make sure to reflect changes there as well.
 *
 * @example
 * // Post contains one-to-one non-owner relation with Category in the property called "category".
 * // If user sets a category into the post and saves post we need to bind them.
 * // This operation requires updating the category table since it's the owner of
 * // the relation and contains a join column.
 * \@OneToOne(type => Category, category => category.post) category: Category
 *
 */
export declare class OneToOneInverseSideSubjectBuilder {
    protected subjects: Subject[];
    constructor(subjects: Subject[]);
    /**
     * Builds all required operations.
     */
    build(): void;
    /**
     * Builds operations for a given subject and relation.
     *
     * by example: subject is "post" entity we are saving here and relation is "category" inside it here.
     *
     * @param subject
     * @param relation
     */
    protected buildForSubjectRelation(subject: Subject, relation: RelationMetadata): void;
}
