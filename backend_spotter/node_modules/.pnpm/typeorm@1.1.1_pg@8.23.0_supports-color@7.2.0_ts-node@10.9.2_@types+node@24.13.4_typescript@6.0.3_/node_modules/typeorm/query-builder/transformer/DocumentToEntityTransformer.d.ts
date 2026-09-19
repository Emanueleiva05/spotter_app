import type { EntityMetadata } from "../../metadata/EntityMetadata";
import type { ObjectLiteral } from "../../common/ObjectLiteral";
/**
 * Transforms raw document into entity object.
 * Entity is constructed based on its entity metadata.
 */
export declare class DocumentToEntityTransformer {
    private readonly enableRelationIdValues;
    constructor(enableRelationIdValues?: boolean);
    transform(document: ObjectLiteral, metadata: EntityMetadata): any;
}
