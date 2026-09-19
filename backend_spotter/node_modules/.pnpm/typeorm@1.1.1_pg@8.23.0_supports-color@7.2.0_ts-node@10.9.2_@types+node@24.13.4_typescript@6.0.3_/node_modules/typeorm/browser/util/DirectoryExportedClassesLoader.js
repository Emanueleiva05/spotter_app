"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importClassesFromDirectories = importClassesFromDirectories;
const tinyglobby_1 = require("tinyglobby");
const PlatformTools_1 = require("../platform/PlatformTools");
const ImportUtils_1 = require("./ImportUtils");
const InstanceChecker_1 = require("./InstanceChecker");
const ObjectUtils_1 = require("./ObjectUtils");
/**
 * Loads all exported classes from the given directory.
 *
 * @param logger
 * @param directories
 * @param formats
 */
async function importClassesFromDirectories(logger, directories, formats = [".js", ".mjs", ".cjs", ".ts", ".mts", ".cts"]) {
    const logLevel = "info";
    const classesNotFoundMessage = "No classes were found using the provided glob pattern: ";
    const classesFoundMessage = "All classes found using provided glob pattern";
    /**
     *
     * @param exported
     * @param allLoaded
     */
    function loadFileClasses(exported, allLoaded) {
        if (typeof exported === "function" ||
            InstanceChecker_1.InstanceChecker.isEntitySchema(exported)) {
            allLoaded.push(exported);
        }
        else if (Array.isArray(exported)) {
            exported.forEach((value) => loadFileClasses(value, allLoaded));
        }
        else if (ObjectUtils_1.ObjectUtils.isObject(exported)) {
            Object.values(exported).forEach((value) => loadFileClasses(value, allLoaded));
        }
        return allLoaded;
    }
    const allFiles = directories.reduce((allDirs, dir) => {
        return allDirs.concat((0, tinyglobby_1.globSync)(PlatformTools_1.PlatformTools.pathNormalize(dir)));
    }, []);
    if (directories.length > 0 && allFiles.length === 0) {
        logger.log(logLevel, `${classesNotFoundMessage} "${directories}"`);
    }
    else if (allFiles.length > 0) {
        logger.log(logLevel, `${classesFoundMessage} "${directories}" : "${allFiles}"`);
    }
    const dirPromises = allFiles
        .filter((file) => {
        const dtsExtension = file.slice(-5);
        return (formats.indexOf(PlatformTools_1.PlatformTools.pathExtname(file)) !== -1 &&
            dtsExtension !== ".d.ts");
    })
        .map(async (file) => {
        const [importOrRequireResult] = await (0, ImportUtils_1.importOrRequireFile)(PlatformTools_1.PlatformTools.pathResolve(file));
        return importOrRequireResult;
    });
    const dirs = await Promise.all(dirPromises);
    return loadFileClasses(dirs, []);
}
//# sourceMappingURL=DirectoryExportedClassesLoader.js.map