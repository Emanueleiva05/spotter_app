import type { EntityMetadata } from "../metadata/EntityMetadata";
import type { Driver } from "../driver/Driver";
/**
 * Validates built entity metadatas.
 */
export declare class EntityMetadataValidator {
    /**
     * Validates all given entity metadatas.
     *
     * @param entityMetadatas
     * @param driver
     */
    validateMany(entityMetadatas: EntityMetadata[], driver: Driver): void;
    /**
     * Validates given entity metadata.
     *
     * @param entityMetadata
     * @param allEntityMetadatas
     * @param driver
     */
    validate(entityMetadata: EntityMetadata, allEntityMetadatas: EntityMetadata[], driver: Driver): void;
    /**
     * Validates dependencies of the entity metadatas.
     *
     * @param entityMetadatas
     */
    protected validateDependencies(entityMetadatas: EntityMetadata[]): void;
    /**
     * Validates eager relations to prevent circular dependency in them.
     *
     * @param entityMetadatas
     */
    protected validateEagerRelations(entityMetadatas: EntityMetadata[]): void;
}
