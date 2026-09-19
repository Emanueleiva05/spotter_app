import type { IsolationLevel } from "./types/IsolationLevel";
/**
 * Validates that the given isolation level is in the provided list of supported levels.
 * Throws a TypeORMError if not supported.
 *
 * @param supported
 * @param isolationLevel
 */
export declare const validateIsolationLevel: (supported: readonly IsolationLevel[], isolationLevel?: IsolationLevel) => void;
