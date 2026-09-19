"use strict";
/**
 * Dummy functions for replacement via `package.json` in browser builds.
 *
 * If we don't include these functions typeorm will throw an error on runtime
 * as well as during webpack builds.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.importClassesFromDirectories = importClassesFromDirectories;
/**
 * Loads all exported classes from the given directory.
 */
function importClassesFromDirectories(logger, directories, formats = [".js", ".cjs", ".ts"]) {
    return [];
}
//# sourceMappingURL=BrowserDirectoryExportedClassesLoader.js.map