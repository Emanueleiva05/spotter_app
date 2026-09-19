"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Broadcaster = void 0;
const ObjectUtils_1 = require("../util/ObjectUtils");
const BroadcasterResult_1 = require("./BroadcasterResult");
/**
 * Broadcaster provides a helper methods to broadcast events to the subscribers.
 */
class Broadcaster {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(queryRunner) {
        this.queryRunner = queryRunner;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    async broadcast(event, ...args) {
        const result = new BroadcasterResult_1.BroadcasterResult();
        const broadcastFunction = this[`broadcast${event}Event`];
        if (typeof broadcastFunction === "function") {
            ;
            broadcastFunction.call(this, result, ...args);
        }
        await result.wait();
    }
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
    broadcastBeforeInsertEvent(result, metadata, entity) {
        if (entity && metadata.beforeInsertListeners.length) {
            metadata.beforeInsertListeners.forEach((listener) => {
                if (listener.isAllowed(entity)) {
                    const executionResult = listener.execute(entity);
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (this.isAllowedSubscriber(subscriber, metadata.target) &&
                    subscriber.beforeInsert) {
                    const executionResult = subscriber.beforeInsert({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                        entity: entity,
                        metadata: metadata,
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
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
    broadcastBeforeUpdateEvent(result, metadata, entity, databaseEntity, updatedColumns, updatedRelations) {
        // todo: send relations too?
        if (entity && metadata.beforeUpdateListeners.length) {
            metadata.beforeUpdateListeners.forEach((listener) => {
                if (listener.isAllowed(entity)) {
                    const executionResult = listener.execute(entity);
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (this.isAllowedSubscriber(subscriber, metadata.target) &&
                    subscriber.beforeUpdate) {
                    const executionResult = subscriber.beforeUpdate({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                        entity: entity,
                        metadata: metadata,
                        databaseEntity: databaseEntity,
                        updatedColumns: updatedColumns ?? [],
                        updatedRelations: updatedRelations ?? [],
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
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
    broadcastBeforeRemoveEvent(result, metadata, entity, databaseEntity, identifier) {
        if (entity && metadata.beforeRemoveListeners.length) {
            metadata.beforeRemoveListeners.forEach((listener) => {
                if (listener.isAllowed(entity)) {
                    const executionResult = listener.execute(entity);
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (this.isAllowedSubscriber(subscriber, metadata.target) &&
                    subscriber.beforeRemove) {
                    const executionResult = subscriber.beforeRemove({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                        entity: entity,
                        metadata: metadata,
                        databaseEntity: databaseEntity,
                        entityId: metadata.getEntityIdMixedMap(databaseEntity ?? identifier),
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
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
    broadcastBeforeSoftRemoveEvent(result, metadata, entity, databaseEntity, identifier) {
        if (entity && metadata.beforeSoftRemoveListeners.length) {
            metadata.beforeSoftRemoveListeners.forEach((listener) => {
                if (listener.isAllowed(entity)) {
                    const executionResult = listener.execute(entity);
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (this.isAllowedSubscriber(subscriber, metadata.target) &&
                    subscriber.beforeSoftRemove) {
                    const executionResult = subscriber.beforeSoftRemove({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                        entity: entity,
                        metadata: metadata,
                        databaseEntity: databaseEntity,
                        entityId: metadata.getEntityIdMixedMap(databaseEntity ?? identifier),
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
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
    broadcastBeforeRecoverEvent(result, metadata, entity, databaseEntity, identifier) {
        if (entity && metadata.beforeRecoverListeners.length) {
            metadata.beforeRecoverListeners.forEach((listener) => {
                if (listener.isAllowed(entity)) {
                    const executionResult = listener.execute(entity);
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (this.isAllowedSubscriber(subscriber, metadata.target) &&
                    subscriber.beforeRecover) {
                    const executionResult = subscriber.beforeRecover({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                        entity: entity,
                        metadata: metadata,
                        databaseEntity: databaseEntity,
                        entityId: metadata.getEntityIdMixedMap(databaseEntity ?? identifier),
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
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
    broadcastAfterInsertEvent(result, metadata, entity, identifier) {
        if (entity && metadata.afterInsertListeners.length) {
            metadata.afterInsertListeners.forEach((listener) => {
                if (listener.isAllowed(entity)) {
                    const executionResult = listener.execute(entity);
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (this.isAllowedSubscriber(subscriber, metadata.target) &&
                    subscriber.afterInsert) {
                    const executionResult = subscriber.afterInsert({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                        entity: entity,
                        metadata: metadata,
                        entityId: metadata.getEntityIdMixedMap(identifier),
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
    /**
     * Broadcasts "BEFORE_QUERY" event.
     *
     * @param result
     * @param query
     * @param parameters
     */
    broadcastBeforeQueryEvent(result, query, parameters) {
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (subscriber.beforeQuery) {
                    const executionResult = subscriber.beforeQuery({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                        query: query,
                        parameters: parameters,
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
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
    broadcastAfterQueryEvent(result, query, parameters, success, executionTime, rawResults, error) {
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (subscriber.afterQuery) {
                    const executionResult = subscriber.afterQuery({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                        query: query,
                        parameters: parameters,
                        success: success,
                        executionTime: executionTime,
                        rawResults: rawResults,
                        error: error,
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
    /**
     * Broadcasts "BEFORE_TRANSACTION_START" event.
     *
     * @param result
     */
    broadcastBeforeTransactionStartEvent(result) {
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (subscriber.beforeTransactionStart) {
                    const executionResult = subscriber.beforeTransactionStart({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
    /**
     * Broadcasts "AFTER_TRANSACTION_START" event.
     *
     * @param result
     */
    broadcastAfterTransactionStartEvent(result) {
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (subscriber.afterTransactionStart) {
                    const executionResult = subscriber.afterTransactionStart({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
    /**
     * Broadcasts "BEFORE_TRANSACTION_COMMIT" event.
     *
     * @param result
     */
    broadcastBeforeTransactionCommitEvent(result) {
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (subscriber.beforeTransactionCommit) {
                    const executionResult = subscriber.beforeTransactionCommit({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
    /**
     * Broadcasts "AFTER_TRANSACTION_COMMIT" event.
     *
     * @param result
     */
    broadcastAfterTransactionCommitEvent(result) {
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (subscriber.afterTransactionCommit) {
                    const executionResult = subscriber.afterTransactionCommit({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
    /**
     * Broadcasts "BEFORE_TRANSACTION_ROLLBACK" event.
     *
     * @param result
     */
    broadcastBeforeTransactionRollbackEvent(result) {
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (subscriber.beforeTransactionRollback) {
                    const executionResult = subscriber.beforeTransactionRollback({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
    /**
     * Broadcasts "AFTER_TRANSACTION_ROLLBACK" event.
     *
     * @param result
     */
    broadcastAfterTransactionRollbackEvent(result) {
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (subscriber.afterTransactionRollback) {
                    const executionResult = subscriber.afterTransactionRollback({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
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
    broadcastAfterUpdateEvent(result, metadata, entity, databaseEntity, updatedColumns, updatedRelations) {
        if (entity && metadata.afterUpdateListeners.length) {
            metadata.afterUpdateListeners.forEach((listener) => {
                if (listener.isAllowed(entity)) {
                    const executionResult = listener.execute(entity);
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (this.isAllowedSubscriber(subscriber, metadata.target) &&
                    subscriber.afterUpdate) {
                    const executionResult = subscriber.afterUpdate({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                        entity: entity,
                        metadata: metadata,
                        databaseEntity: databaseEntity,
                        updatedColumns: updatedColumns ?? [],
                        updatedRelations: updatedRelations ?? [],
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
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
    broadcastAfterRemoveEvent(result, metadata, entity, databaseEntity, identifier) {
        if (entity && metadata.afterRemoveListeners.length) {
            metadata.afterRemoveListeners.forEach((listener) => {
                if (listener.isAllowed(entity)) {
                    const executionResult = listener.execute(entity);
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (this.isAllowedSubscriber(subscriber, metadata.target) &&
                    subscriber.afterRemove) {
                    const executionResult = subscriber.afterRemove({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                        entity: entity,
                        metadata: metadata,
                        databaseEntity: databaseEntity,
                        entityId: metadata.getEntityIdMixedMap(databaseEntity ?? identifier),
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
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
    broadcastAfterSoftRemoveEvent(result, metadata, entity, databaseEntity, identifier) {
        if (entity && metadata.afterSoftRemoveListeners.length) {
            metadata.afterSoftRemoveListeners.forEach((listener) => {
                if (listener.isAllowed(entity)) {
                    const executionResult = listener.execute(entity);
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (this.isAllowedSubscriber(subscriber, metadata.target) &&
                    subscriber.afterSoftRemove) {
                    const executionResult = subscriber.afterSoftRemove({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                        entity: entity,
                        metadata: metadata,
                        databaseEntity: databaseEntity,
                        entityId: metadata.getEntityIdMixedMap(databaseEntity ?? identifier),
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
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
    broadcastAfterRecoverEvent(result, metadata, entity, databaseEntity, identifier) {
        if (entity && metadata.afterRecoverListeners.length) {
            metadata.afterRecoverListeners.forEach((listener) => {
                if (listener.isAllowed(entity)) {
                    const executionResult = listener.execute(entity);
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
        if (this.queryRunner.dataSource.subscribers.length) {
            this.queryRunner.dataSource.subscribers.forEach((subscriber) => {
                if (this.isAllowedSubscriber(subscriber, metadata.target) &&
                    subscriber.afterRecover) {
                    const executionResult = subscriber.afterRecover({
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                        entity: entity,
                        metadata: metadata,
                        databaseEntity: databaseEntity,
                        entityId: metadata.getEntityIdMixedMap(databaseEntity ?? identifier),
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                }
            });
        }
    }
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
    broadcastLoadEvent(result, metadata, entities) {
        // Calculate which subscribers are fitting for the given entity type
        const fittingSubscribers = this.queryRunner.dataSource.subscribers.filter((subscriber) => this.isAllowedSubscriber(subscriber, metadata.target) &&
            subscriber.afterLoad);
        if (metadata.relations.length ||
            metadata.afterLoadListeners.length ||
            fittingSubscribers.length) {
            // todo: check why need this?
            const nonPromiseEntities = entities.filter((entity) => !(entity instanceof Promise));
            // collect load events for all children entities that were loaded with the main entity
            if (metadata.relations.length) {
                metadata.relations.forEach((relation) => {
                    nonPromiseEntities.forEach((entity) => {
                        // in lazy relations we cannot simply access to entity property because it will cause a getter and a database query
                        if (relation.isLazy &&
                            !entity.hasOwnProperty(relation.propertyName))
                            return;
                        const value = relation.getEntityValue(entity);
                        if (ObjectUtils_1.ObjectUtils.isObject(value))
                            this.broadcastLoadEvent(result, relation.inverseEntityMetadata, Array.isArray(value) ? value : [value]);
                    });
                });
            }
            if (metadata.afterLoadListeners.length) {
                metadata.afterLoadListeners.forEach((listener) => {
                    nonPromiseEntities.forEach((entity) => {
                        if (listener.isAllowed(entity)) {
                            const executionResult = listener.execute(entity);
                            if (executionResult instanceof Promise)
                                result.promises.push(executionResult);
                            result.count++;
                        }
                    });
                });
            }
            fittingSubscribers.forEach((subscriber) => {
                nonPromiseEntities.forEach((entity) => {
                    const executionResult = subscriber.afterLoad(entity, {
                        dataSource: this.queryRunner.dataSource,
                        connection: this.queryRunner.dataSource,
                        queryRunner: this.queryRunner,
                        manager: this.queryRunner.manager,
                        entity,
                        metadata,
                    });
                    if (executionResult instanceof Promise)
                        result.promises.push(executionResult);
                    result.count++;
                });
            });
        }
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Checks if subscriber's methods can be executed by checking if its don't listen to the particular entity,
     * or listens our entity.
     *
     * @param subscriber
     * @param target
     */
    isAllowedSubscriber(subscriber, target) {
        return (!subscriber.listenTo?.() ||
            subscriber.listenTo() === Object ||
            subscriber.listenTo() === target ||
            subscriber.listenTo().isPrototypeOf(target));
    }
}
exports.Broadcaster = Broadcaster;
//# sourceMappingURL=Broadcaster.js.map