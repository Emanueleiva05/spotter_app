import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when trying to use named placeholders with an incompatible driver.
 */
export declare class NamedPlaceholdersNotSupportedError extends TypeORMError {
    constructor();
}
