import { EntityMetadata } from "../metadata/EntityMetadata";
import { EmbeddedMetadata } from "../metadata/EmbeddedMetadata";
import type { MetadataArgsStorage } from "../metadata-args/MetadataArgsStorage";
import type { EmbeddedMetadataArgs } from "../metadata-args/EmbeddedMetadataArgs";
import type { TableMetadataArgs } from "../metadata-args/TableMetadataArgs";
import { JunctionEntityMetadataBuilder } from "./JunctionEntityMetadataBuilder";
import { ClosureJunctionEntityMetadataBuilder } from "./ClosureJunctionEntityMetadataBuilder";
import { RelationJoinColumnBuilder } from "./RelationJoinColumnBuilder";
import type { DataSource } from "../data-source/DataSource";
/**
 * Builds EntityMetadata objects and all its sub-metadatas.
 */
export declare class EntityMetadataBuilder {
    private dataSource;
    private metadataArgsStorage;
    /**
     * Used to build entity metadatas of the junction entities.
     */
    protected junctionEntityMetadataBuilder: JunctionEntityMetadataBuilder;
    /**
     * Used to build entity metadatas of the closure junction entities.
     */
    protected closureJunctionEntityMetadataBuilder: ClosureJunctionEntityMetadataBuilder;
    /**
     * Used to build join columns of the relations.
     */
    protected relationJoinColumnBuilder: RelationJoinColumnBuilder;
    constructor(dataSource: DataSource, metadataArgsStorage: MetadataArgsStorage);
    /**
     * Builds a complete entity metadatas for the given entity classes.
     *
     * @param entityClasses
     */
    build(entityClasses?: Function[]): EntityMetadata[];
    /**
     * Creates entity metadata from the given table args.
     * Creates column, relation, etc. metadatas for everything this entity metadata owns.
     *
     * @param tableArgs
     */
    protected createEntityMetadata(tableArgs: TableMetadataArgs): EntityMetadata;
    protected computeParentEntityMetadata(allEntityMetadatas: EntityMetadata[], entityMetadata: EntityMetadata): void;
    protected computeEntityMetadataStep1(allEntityMetadatas: EntityMetadata[], entityMetadata: EntityMetadata): void;
    /**
     * Creates from the given embedded metadata args real embedded metadatas with its columns and relations,
     * and does the same for all its sub-embeddeds (goes recursively).
     *
     * @param entityMetadata
     * @param embeddedArgs
     */
    protected createEmbeddedsRecursively(entityMetadata: EntityMetadata, embeddedArgs: EmbeddedMetadataArgs[]): EmbeddedMetadata[];
    /**
     * Computes all entity metadata's computed properties, and all its sub-metadatas (relations, columns, embeds, etc).
     *
     * @param entityMetadata
     */
    protected computeEntityMetadataStep2(entityMetadata: EntityMetadata): void;
    /**
     * Computes entity metadata's relations inverse side properties.
     *
     * @param entityMetadata
     * @param entityMetadatas
     */
    protected computeInverseProperties(entityMetadata: EntityMetadata, entityMetadatas: EntityMetadata[]): void;
    /**
     * Creates indices for the table of single table inheritance.
     *
     * @param entityMetadata
     */
    protected createKeysForTableInheritance(entityMetadata: EntityMetadata): void;
    /**
     * Creates from the given foreign key metadata args real foreign key metadatas.
     *
     * @param entityMetadata
     * @param entityMetadatas
     */
    protected createForeignKeys(entityMetadata: EntityMetadata, entityMetadatas: EntityMetadata[]): void;
}
