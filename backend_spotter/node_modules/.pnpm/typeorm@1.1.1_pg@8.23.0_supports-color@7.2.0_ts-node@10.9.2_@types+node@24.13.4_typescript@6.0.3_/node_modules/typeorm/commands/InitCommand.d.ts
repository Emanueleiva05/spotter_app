import type yargs from "yargs";
/**
 * Generates a new project with TypeORM.
 */
export declare class InitCommand implements yargs.CommandModule {
    command: string;
    describe: string;
    builder(args: yargs.Argv): yargs.Argv<{
        n: unknown;
    } & {
        db: string | undefined;
    } & {
        express: unknown;
    } & {
        docker: unknown;
    } & {
        ms: string;
    }>;
    handler(args: yargs.Arguments): Promise<void>;
    /**
     * Gets contents of the ormconfig file.
     *
     * @param isEsm
     * @param database
     */
    protected static getAppDataSourceTemplate(isEsm: boolean, database: string): string;
    /**
     * Gets contents of the ormconfig file.
     *
     * @param esmModule
     */
    protected static getTsConfigTemplate(esmModule: boolean): string;
    /**
     * Gets contents of the .gitignore file.
     */
    protected static getGitIgnoreFile(): string;
    /**
     * Gets contents of the user entity.
     *
     * @param database
     */
    protected static getUserEntityTemplate(database: string): string;
    /**
     * Gets contents of the route file (used when express is enabled).
     *
     * @param isEsm
     */
    protected static getRoutesTemplate(isEsm: boolean): string;
    /**
     * Gets contents of the user controller file (used when express is enabled).
     *
     * @param isEsm
     */
    protected static getControllerTemplate(isEsm: boolean): string;
    /**
     * Gets contents of the main (index) application file.
     *
     * @param express
     * @param isEsm
     */
    protected static getAppIndexTemplate(express: boolean, isEsm: boolean): string;
    /**
     * Gets contents of the new package.json file.
     *
     * @param projectName
     * @param projectIsEsm
     */
    protected static getPackageJsonTemplate(projectName?: string, projectIsEsm?: boolean): string;
    /**
     * Gets contents of the new docker-compose.yml file.
     *
     * @param database
     */
    protected static getDockerComposeTemplate(database: string): string;
    /**
     * Gets contents of the new readme.md file.
     *
     * @param options
     * @param options.docker
     */
    protected static getReadmeTemplate(options: {
        docker: boolean;
    }): string;
    /**
     * Appends to a given package.json template everything needed.
     *
     * @param packageJsonContents
     * @param database
     * @param express
     * @param projectIsEsm
     */
    protected static appendPackageJson(packageJsonContents: string, database: string, express: boolean, projectIsEsm: boolean): Promise<string>;
}
