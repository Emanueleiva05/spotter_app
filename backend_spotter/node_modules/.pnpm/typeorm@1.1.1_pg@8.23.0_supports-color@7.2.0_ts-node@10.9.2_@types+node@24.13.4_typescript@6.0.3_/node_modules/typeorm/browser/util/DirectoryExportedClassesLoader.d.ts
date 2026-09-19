import type { Logger } from "../logger/Logger";
/**
 * Loads all exported classes from the given directory.
 *
 * @param logger
 * @param directories
 * @param formats
 */
export declare function importClassesFromDirectories(logger: Logger, directories: string[], formats?: string[]): Promise<Function[]>;
