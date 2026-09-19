export declare class RandomGenerator {
    /**
     * Generates a RFC 4122 version 4 UUID.
     * Uses native crypto.randomUUID() if available, otherwise falls back to
     * a custom implementation using crypto.getRandomValues().
     *
     * @returns A version 4 UUID string
     */
    static uuidv4(): string;
    /**
     * Standard-conforming SHA-1 polyfill, based on http://locutus.io/php/sha1/
     *
     * @param str String to be hashed.
     * @returns SHA-1 hex digest
     */
    static sha1(str: string): string;
}
