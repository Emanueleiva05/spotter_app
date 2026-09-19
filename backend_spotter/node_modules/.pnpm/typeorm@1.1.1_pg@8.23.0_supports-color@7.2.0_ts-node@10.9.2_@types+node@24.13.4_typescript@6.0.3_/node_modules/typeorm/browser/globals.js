"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadataArgsStorage = getMetadataArgsStorage;
const MetadataArgsStorage_1 = require("./metadata-args/MetadataArgsStorage");
const PlatformTools_1 = require("./platform/PlatformTools");
/**
 * Returns the singleton MetadataArgsStorage, creating it on the global scope if it
 * does not already exist.
 */
function getMetadataArgsStorage() {
    // We store the metadata storage in a global variable so that when TypeORM is
    // invoked from a globally installed package while loading entities that register
    // decorators against a locally installed copy, entities remain available in
    // migrations and CLI-related operations.
    const globalScope = PlatformTools_1.PlatformTools.getGlobalVariable();
    globalScope.typeormMetadataArgsStorage ??= new MetadataArgsStorage_1.MetadataArgsStorage();
    return globalScope.typeormMetadataArgsStorage;
}
//# sourceMappingURL=globals.js.map