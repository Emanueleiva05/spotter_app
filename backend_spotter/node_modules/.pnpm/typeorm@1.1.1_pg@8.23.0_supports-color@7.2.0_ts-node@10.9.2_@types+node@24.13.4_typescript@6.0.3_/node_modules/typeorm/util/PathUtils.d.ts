/**
 *
 * @param filepath
 */
export declare function toPortablePath(filepath: string): string;
/**
 * Create deterministic valid database name (class, database) of fixed length from any filepath. Equivalent paths for windows/posix systems should
 * be equivalent to enable portability
 *
 * @param filepath
 */
export declare function filepathToName(filepath: string): string;
/**
 * Cross platform isAbsolute
 *
 * @param filepath
 */
export declare function isAbsolute(filepath: string): boolean;
