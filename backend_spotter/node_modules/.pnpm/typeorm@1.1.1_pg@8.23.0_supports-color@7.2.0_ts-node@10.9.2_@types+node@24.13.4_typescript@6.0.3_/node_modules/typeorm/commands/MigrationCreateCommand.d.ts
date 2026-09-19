import type yargs from "yargs";
/**
 * Creates a new migration file.
 */
export declare class MigrationCreateCommand implements yargs.CommandModule {
    command: string;
    describe: string;
    builder(args: yargs.Argv): yargs.Argv<{
        path: string;
    } & {
        o: boolean;
    } & {
        esm: boolean;
    } & {
        t: number | boolean;
    }>;
    handler(args: yargs.Arguments<any & {
        path: string;
    }>): Promise<void>;
    /**
     * Gets contents of the migration file.
     *
     * @param name
     * @param timestamp
     */
    protected static getTemplate(name: string, timestamp: number): string;
    /**
     * Gets contents of the migration file in Javascript.
     *
     * @param name
     * @param timestamp
     * @param esm
     */
    protected static getJavascriptTemplate(name: string, timestamp: number, esm: boolean): string;
}
