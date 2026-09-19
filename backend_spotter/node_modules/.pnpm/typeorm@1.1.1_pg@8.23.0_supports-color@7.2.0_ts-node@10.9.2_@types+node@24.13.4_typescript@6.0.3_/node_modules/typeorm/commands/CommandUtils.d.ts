import type { DataSource } from "../data-source";
/**
 * Command line utils functions.
 */
export declare class CommandUtils {
    static loadDataSource(dataSourceFilePath: string): Promise<DataSource>;
    /**
     * Creates directories recursively.
     *
     * @param directory
     */
    static createDirectories(directory: string): Promise<void>;
    /**
     * Creates a file with the given content in the given path.
     *
     * @param filePath
     * @param content
     * @param override
     */
    static createFile(filePath: string, content: string, override?: boolean): Promise<void>;
    /**
     * Reads everything from a given file and returns its content as a string.
     *
     * @param filePath
     */
    static readFile(filePath: string): Promise<string>;
    static fileExists(filePath: string): Promise<boolean>;
    /**
     * Gets migration timestamp and validates argument (if sent)
     *
     * @param timestampOptionArgument
     */
    static getTimestamp(timestampOptionArgument: any): number;
}
