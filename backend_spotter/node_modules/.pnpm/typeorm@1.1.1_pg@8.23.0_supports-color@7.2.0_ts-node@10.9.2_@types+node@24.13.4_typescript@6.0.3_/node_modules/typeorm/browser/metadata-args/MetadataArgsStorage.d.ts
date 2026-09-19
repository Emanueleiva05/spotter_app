import type { RelationMetadataArgs } from "./RelationMetadataArgs";
import type { ColumnMetadataArgs } from "./ColumnMetadataArgs";
import type { IndexMetadataArgs } from "./IndexMetadataArgs";
import type { EntityListenerMetadataArgs } from "./EntityListenerMetadataArgs";
import type { TableMetadataArgs } from "./TableMetadataArgs";
import type { NamingStrategyMetadataArgs } from "./NamingStrategyMetadataArgs";
import type { JoinTableMetadataArgs } from "./JoinTableMetadataArgs";
import type { JoinColumnMetadataArgs } from "./JoinColumnMetadataArgs";
import type { EmbeddedMetadataArgs } from "./EmbeddedMetadataArgs";
import type { EntitySubscriberMetadataArgs } from "./EntitySubscriberMetadataArgs";
import type { RelationIdMetadataArgs } from "./RelationIdMetadataArgs";
import type { InheritanceMetadataArgs } from "./InheritanceMetadataArgs";
import type { DiscriminatorValueMetadataArgs } from "./DiscriminatorValueMetadataArgs";
import type { TransactionEntityMetadataArgs } from "./TransactionEntityMetadataArgs";
import type { TransactionRepositoryMetadataArgs } from "./TransactionRepositoryMetadataArgs";
import type { GeneratedMetadataArgs } from "./GeneratedMetadataArgs";
import type { TreeMetadataArgs } from "./TreeMetadataArgs";
import type { UniqueMetadataArgs } from "./UniqueMetadataArgs";
import type { CheckMetadataArgs } from "./CheckMetadataArgs";
import type { ExclusionMetadataArgs } from "./ExclusionMetadataArgs";
import type { ForeignKeyMetadataArgs } from "./ForeignKeyMetadataArgs";
/**
 * Storage all metadatas args of all available types: tables, columns, subscribers, relations, etc.
 * Each metadata args represents some specifications of what it represents.
 * MetadataArgs used to create a real Metadata objects.
 */
export declare class MetadataArgsStorage {
    readonly tables: TableMetadataArgs[];
    readonly trees: TreeMetadataArgs[];
    readonly transactionEntityManagers: TransactionEntityMetadataArgs[];
    readonly transactionRepositories: TransactionRepositoryMetadataArgs[];
    readonly namingStrategies: NamingStrategyMetadataArgs[];
    readonly entitySubscribers: EntitySubscriberMetadataArgs[];
    readonly indices: IndexMetadataArgs[];
    readonly foreignKeys: ForeignKeyMetadataArgs[];
    readonly uniques: UniqueMetadataArgs[];
    readonly checks: CheckMetadataArgs[];
    readonly exclusions: ExclusionMetadataArgs[];
    readonly columns: ColumnMetadataArgs[];
    readonly generations: GeneratedMetadataArgs[];
    readonly relations: RelationMetadataArgs[];
    readonly joinColumns: JoinColumnMetadataArgs[];
    readonly joinTables: JoinTableMetadataArgs[];
    readonly entityListeners: EntityListenerMetadataArgs[];
    readonly relationIds: RelationIdMetadataArgs[];
    readonly embeddeds: EmbeddedMetadataArgs[];
    readonly inheritances: InheritanceMetadataArgs[];
    readonly discriminatorValues: DiscriminatorValueMetadataArgs[];
    filterTables(target: Function | string): TableMetadataArgs[];
    filterTables(target: (Function | string)[]): TableMetadataArgs[];
    filterColumns(target: Function | string): ColumnMetadataArgs[];
    filterColumns(target: (Function | string)[]): ColumnMetadataArgs[];
    findGenerated(target: Function | string, propertyName: string): GeneratedMetadataArgs | undefined;
    findGenerated(target: (Function | string)[], propertyName: string): GeneratedMetadataArgs | undefined;
    findTree(target: (Function | string) | (Function | string)[]): TreeMetadataArgs | undefined;
    filterRelations(target: Function | string): RelationMetadataArgs[];
    filterRelations(target: (Function | string)[]): RelationMetadataArgs[];
    filterRelationIds(target: Function | string): RelationIdMetadataArgs[];
    filterRelationIds(target: (Function | string)[]): RelationIdMetadataArgs[];
    filterIndices(target: Function | string): IndexMetadataArgs[];
    filterIndices(target: (Function | string)[]): IndexMetadataArgs[];
    filterForeignKeys(target: Function | string): ForeignKeyMetadataArgs[];
    filterForeignKeys(target: (Function | string)[]): ForeignKeyMetadataArgs[];
    filterUniques(target: Function | string): UniqueMetadataArgs[];
    filterUniques(target: (Function | string)[]): UniqueMetadataArgs[];
    filterChecks(target: Function | string): CheckMetadataArgs[];
    filterChecks(target: (Function | string)[]): CheckMetadataArgs[];
    filterExclusions(target: Function | string): ExclusionMetadataArgs[];
    filterExclusions(target: (Function | string)[]): ExclusionMetadataArgs[];
    filterListeners(target: Function | string): EntityListenerMetadataArgs[];
    filterListeners(target: (Function | string)[]): EntityListenerMetadataArgs[];
    filterEmbeddeds(target: Function | string): EmbeddedMetadataArgs[];
    filterEmbeddeds(target: (Function | string)[]): EmbeddedMetadataArgs[];
    findJoinTable(target: Function | string, propertyName: string): JoinTableMetadataArgs | undefined;
    filterJoinColumns(target: Function | string, propertyName: string): JoinColumnMetadataArgs[];
    filterSubscribers(target: Function | string): EntitySubscriberMetadataArgs[];
    filterSubscribers(target: (Function | string)[]): EntitySubscriberMetadataArgs[];
    filterNamingStrategies(target: Function | string): NamingStrategyMetadataArgs[];
    filterNamingStrategies(target: (Function | string)[]): NamingStrategyMetadataArgs[];
    filterTransactionEntityManagers(target: Function | string, propertyName: string): TransactionEntityMetadataArgs[];
    filterTransactionRepository(target: Function | string, propertyName: string): TransactionRepositoryMetadataArgs[];
    filterSingleTableChildren(target: Function | string): TableMetadataArgs[];
    findInheritanceType(target: Function | string): InheritanceMetadataArgs | undefined;
    findDiscriminatorValue(target: Function | string): DiscriminatorValueMetadataArgs | undefined;
    /**
     * Filters given array by a given target or targets.
     *
     * @param array
     * @param target
     */
    protected filterByTarget<T extends {
        target: Function | string;
    }>(array: T[], target: (Function | string) | (Function | string)[]): T[];
    /**
     * Filters given array by a given target or targets and prevents duplicate property names.
     *
     * @param array
     * @param target
     */
    protected filterByTargetAndWithoutDuplicateProperties<T extends {
        target: Function | string;
        propertyName: string;
    }>(array: T[], target: (Function | string) | (Function | string)[]): T[];
    /**
     * Filters given array by a given target or targets and prevents duplicate relation property names.
     *
     * @param array
     * @param target
     */
    protected filterByTargetAndWithoutDuplicateRelationProperties<T extends RelationMetadataArgs>(array: T[], target: (Function | string) | (Function | string)[]): T[];
    /**
     * Filters given array by a given target or targets and prevents duplicate embedded property names.
     *
     * @param array
     * @param target
     */
    protected filterByTargetAndWithoutDuplicateEmbeddedProperties<T extends EmbeddedMetadataArgs>(array: T[], target: (Function | string) | (Function | string)[]): T[];
}
