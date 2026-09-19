"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionMetadataBuilder = void 0;
const DirectoryExportedClassesLoader_1 = require("../util/DirectoryExportedClassesLoader");
const OrmUtils_1 = require("../util/OrmUtils");
const globals_1 = require("../globals");
const EntityMetadataBuilder_1 = require("../metadata-builder/EntityMetadataBuilder");
const EntitySchemaTransformer_1 = require("../entity-schema/EntitySchemaTransformer");
const InstanceChecker_1 = require("../util/InstanceChecker");
/**
 * Builds migration instances, subscriber instances and entity metadatas for the given classes.
 */
class ConnectionMetadataBuilder {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Builds migration instances for the given classes or directories.
     *
     * @param migrations
     */
    async buildMigrations(migrations) {
        const [migrationClasses, migrationDirectories] = OrmUtils_1.OrmUtils.splitClassesAndStrings(migrations);
        const allMigrationClasses = [
            ...migrationClasses,
            ...(await (0, DirectoryExportedClassesLoader_1.importClassesFromDirectories)(this.dataSource.logger, migrationDirectories)),
        ];
        return allMigrationClasses.map((migrationClass) => new migrationClass());
    }
    /**
     * Builds subscriber instances for the given classes or directories.
     *
     * @param subscribers
     */
    async buildSubscribers(subscribers) {
        const [subscriberClasses, subscriberDirectories] = OrmUtils_1.OrmUtils.splitClassesAndStrings(subscribers || []);
        const allSubscriberClasses = [
            ...subscriberClasses,
            ...(await (0, DirectoryExportedClassesLoader_1.importClassesFromDirectories)(this.dataSource.logger, subscriberDirectories)),
        ];
        return (0, globals_1.getMetadataArgsStorage)()
            .filterSubscribers(allSubscriberClasses)
            .map((metadata) => new metadata.target());
    }
    /**
     * Builds entity metadatas for the given classes or directories.
     *
     * @param entities
     */
    async buildEntityMetadatas(entities) {
        // todo: instead we need to merge multiple metadata args storages
        const [entityClassesOrSchemas, entityDirectories] = OrmUtils_1.OrmUtils.splitClassesAndStrings(entities || []);
        const entityClasses = entityClassesOrSchemas.filter((entityClass) => !InstanceChecker_1.InstanceChecker.isEntitySchema(entityClass));
        const entitySchemas = entityClassesOrSchemas.filter((entityClass) => InstanceChecker_1.InstanceChecker.isEntitySchema(entityClass));
        const allEntityClasses = [
            ...entityClasses,
            ...(await (0, DirectoryExportedClassesLoader_1.importClassesFromDirectories)(this.dataSource.logger, entityDirectories)),
        ];
        allEntityClasses.forEach((entityClass) => {
            // if we have entity schemas loaded from directories
            if (InstanceChecker_1.InstanceChecker.isEntitySchema(entityClass)) {
                entitySchemas.push(entityClass);
            }
        });
        const decoratorEntityMetadatas = new EntityMetadataBuilder_1.EntityMetadataBuilder(this.dataSource, (0, globals_1.getMetadataArgsStorage)()).build(allEntityClasses);
        const metadataArgsStorageFromSchema = new EntitySchemaTransformer_1.EntitySchemaTransformer().transform(entitySchemas);
        const schemaEntityMetadatas = new EntityMetadataBuilder_1.EntityMetadataBuilder(this.dataSource, metadataArgsStorageFromSchema).build();
        return [...decoratorEntityMetadatas, ...schemaEntityMetadatas];
    }
}
exports.ConnectionMetadataBuilder = ConnectionMetadataBuilder;
//# sourceMappingURL=ConnectionMetadataBuilder.js.map