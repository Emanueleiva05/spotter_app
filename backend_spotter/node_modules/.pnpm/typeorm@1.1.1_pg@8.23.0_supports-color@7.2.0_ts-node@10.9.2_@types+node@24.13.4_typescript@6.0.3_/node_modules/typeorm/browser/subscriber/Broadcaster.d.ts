import type { ObjectLiteral } from "../common/ObjectLiteral";
import type { ColumnMetadata } from "../metadata/ColumnMetadata";
import type { EntityMetadata } from "../metadata/EntityMetadata";
import type { RelationMetadata } from "../metadata/RelationMetadata";
import type { QueryRunner } from "../query-runner/QueryRunner";
import { BroadcasterResult } from "./BroadcasterResult";
import type { EntitySubscriberInterface } from "./EntitySubscriberInterface";
interface BroadcasterEvents {
    BeforeQuery: (query: string, parameters: any[] | ObjectLiteral | undefined) => void;
    AfterQuery: (query: string, parameters: any[] | ObjectLiteral | undefined, success: boolean, executionTime: number | undefined, rawResults: any | undefined, error: any | undefined) => void;
    BeforeTransactionCommit: () => void;
    AfterTransactionCommit: () => void;
    BeforeTransactionStart: () => void;
    AfterTransactionStart: () => void;
    BeforeTransactionRollback: () => void;
    AfterTransactionRollback: () => void;
    BeforeUpdate: (metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral, updatedColumns?: ColumnMetadata[], updatedRelations?: RelationMetadata[]) => void;
    AfterUpdate: (metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral, updatedColumns?: ColumnMetadata[], updatedRelations?: RelationMetadata[]) => void;
    BeforeInsert: (metadata: EntityMetadata, entity: ObjectLiteral | undefined) => void;
    AfterInsert: (metadata: EntityMetadata, entity: ObjectLiteral | undefined) => void;
    BeforeRemove: (metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral) => void;
    AfterRemove: (metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral) => void;
    BeforeSoftRemove: (metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral) => void;
    AfterSoftRemove: (metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral) => void;
    BeforeRecover: (metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral) => void;
    AfterRecover: (metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral) => void;
    Load: (metadata: EntityMetadata, entities: ObjectLiteral[]) => void;
}
/**
 * Broadcaster provides a helper methods to broadcast events to the subscribers.
 */
export declare class Broadcaster {
    private queryRunner;
    constructor(queryRunner: QueryRunner);
    broadcast<U extends keyof BroadcasterEvents>(event: U, ...args: Parameters<BroadcasterEvents[U]>): Promise<void>;
    /**
     * Broadcasts "BEFORE_INSERT" event.
     * Before insert event is executed before entity is being inserted to the database for the first time.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     *
     * Note: this method has a performance-optimized code organization, do not change code structure.
     *
     * @param result
     * @param metadata
     * @param entity
     */
    broadcastBeforeInsertEvent(result: BroadcasterResult, metadata: EntityMetadata, entity: undefined | ObjectLiteral): void;
    /**
     * Broadcasts "BEFORE_UPDATE" event.
     * Before update event is executed before entity is being updated in the database.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     *
     * Note: this method has a performance-optimized code organization, do not change code structure.
     *
     * @param result
     * @param metadata
     * @param entity
     * @param databaseEntity
     * @param updatedColumns
     * @param updatedRelations
     */
    broadcastBeforeUpdateEvent(result: BroadcasterResult, metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral, updatedColumns?: ColumnMetadata[], updatedRelations?: RelationMetadata[]): void;
    /**
     * Broadcasts "BEFORE_REMOVE" event.
     * Before remove event is executed before entity is being removed from the database.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     *
     * Note: this method has a performance-optimized code organization, do not change code structure.
     *
     * @param result
     * @param metadata
     * @param entity
     * @param databaseEntity
     * @param identifier
     */
    broadcastBeforeRemoveEvent(result: BroadcasterResult, metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral, identifier?: ObjectLiteral): void;
    /**
     * Broadcasts "BEFORE_SOFT_REMOVE" event.
     * Before soft remove event is executed before entity is being soft removed from the database.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     *
     * Note: this method has a performance-optimized code organization, do not change code structure.
     *
     * @param result
     * @param metadata
     * @param entity
     * @param databaseEntity
     * @param identifier
     */
    broadcastBeforeSoftRemoveEvent(result: BroadcasterResult, metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral, identifier?: ObjectLiteral): void;
    /**
     * Broadcasts "BEFORE_RECOVER" event.
     * Before recover event is executed before entity is being recovered in the database.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     *
     * Note: this method has a performance-optimized code organization, do not change code structure.
     *
     * @param result
     * @param metadata
     * @param entity
     * @param databaseEntity
     * @param identifier
     */
    broadcastBeforeRecoverEvent(result: BroadcasterResult, metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral, identifier?: ObjectLiteral): void;
    /**
     * Broadcasts "AFTER_INSERT" event.
     * After insert event is executed after entity is being persisted to the database for the first time.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     *
     * Note: this method has a performance-optimized code organization, do not change code structure.
     *
     * @param result
     * @param metadata
     * @param entity
     * @param identifier
     */
    broadcastAfterInsertEvent(result: BroadcasterResult, metadata: EntityMetadata, entity?: ObjectLiteral, identifier?: ObjectLiteral): void;
    /**
     * Broadcasts "BEFORE_QUERY" event.
     *
     * @param result
     * @param query
     * @param parameters
     */
    broadcastBeforeQueryEvent(result: BroadcasterResult, query: string, parameters: undefined | any[] | ObjectLiteral): void;
    /**
     * Broadcasts "AFTER_QUERY" event.
     *
     * @param result
     * @param query
     * @param parameters
     * @param success
     * @param executionTime
     * @param rawResults
     * @param error
     */
    broadcastAfterQueryEvent(result: BroadcasterResult, query: string, parameters: undefined | any[] | ObjectLiteral, success: boolean, executionTime: undefined | number, rawResults: undefined | any, error: undefined | any): void;
    /**
     * Broadcasts "BEFORE_TRANSACTION_START" event.
     *
     * @param result
     */
    broadcastBeforeTransactionStartEvent(result: BroadcasterResult): void;
    /**
     * Broadcasts "AFTER_TRANSACTION_START" event.
     *
     * @param result
     */
    broadcastAfterTransactionStartEvent(result: BroadcasterResult): void;
    /**
     * Broadcasts "BEFORE_TRANSACTION_COMMIT" event.
     *
     * @param result
     */
    broadcastBeforeTransactionCommitEvent(result: BroadcasterResult): void;
    /**
     * Broadcasts "AFTER_TRANSACTION_COMMIT" event.
     *
     * @param result
     */
    broadcastAfterTransactionCommitEvent(result: BroadcasterResult): void;
    /**
     * Broadcasts "BEFORE_TRANSACTION_ROLLBACK" event.
     *
     * @param result
     */
    broadcastBeforeTransactionRollbackEvent(result: BroadcasterResult): void;
    /**
     * Broadcasts "AFTER_TRANSACTION_ROLLBACK" event.
     *
     * @param result
     */
    broadcastAfterTransactionRollbackEvent(result: BroadcasterResult): void;
    /**
     * Broadcasts "AFTER_UPDATE" event.
     * After update event is executed after entity is being updated in the database.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     *
     * Note: this method has a performance-optimized code organization, do not change code structure.
     *
     * @param result
     * @param metadata
     * @param entity
     * @param databaseEntity
     * @param updatedColumns
     * @param updatedRelations
     */
    broadcastAfterUpdateEvent(result: BroadcasterResult, metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral, updatedColumns?: ColumnMetadata[], updatedRelations?: RelationMetadata[]): void;
    /**
     * Broadcasts "AFTER_REMOVE" event.
     * After remove event is executed after entity is being removed from the database.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     *
     * Note: this method has a performance-optimized code organization, do not change code structure.
     *
     * @param result
     * @param metadata
     * @param entity
     * @param databaseEntity
     * @param identifier
     */
    broadcastAfterRemoveEvent(result: BroadcasterResult, metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral, identifier?: ObjectLiteral): void;
    /**
     * Broadcasts "AFTER_SOFT_REMOVE" event.
     * After soft remove event is executed after entity is being soft removed from the database.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     *
     * Note: this method has a performance-optimized code organization, do not change code structure.
     *
     * @param result
     * @param metadata
     * @param entity
     * @param databaseEntity
     * @param identifier
     */
    broadcastAfterSoftRemoveEvent(result: BroadcasterResult, metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral, identifier?: ObjectLiteral): void;
    /**
     * Broadcasts "AFTER_RECOVER" event.
     * After recover event is executed after entity is being recovered in the database.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     *
     * Note: this method has a performance-optimized code organization, do not change code structure.
     *
     * @param result
     * @param metadata
     * @param entity
     * @param databaseEntity
     * @param identifier
     */
    broadcastAfterRecoverEvent(result: BroadcasterResult, metadata: EntityMetadata, entity?: ObjectLiteral, databaseEntity?: ObjectLiteral, identifier?: ObjectLiteral): void;
    /**
     * Broadcasts "AFTER_LOAD" event for all given entities, and their sub-entities.
     * After load event is executed after entity has been loaded from the database.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     *
     * Note: this method has a performance-optimized code organization, do not change code structure.
     *
     * @param result
     * @param metadata
     * @param entities
     */
    broadcastLoadEvent(result: BroadcasterResult, metadata: EntityMetadata, entities: ObjectLiteral[]): void;
    /**
     * Checks if subscriber's methods can be executed by checking if its don't listen to the particular entity,
     * or listens our entity.
     *
     * @param subscriber
     * @param target
     */
    protected isAllowedSubscriber(subscriber: EntitySubscriberInterface<any>, target: Function | string): boolean;
}
export {};
