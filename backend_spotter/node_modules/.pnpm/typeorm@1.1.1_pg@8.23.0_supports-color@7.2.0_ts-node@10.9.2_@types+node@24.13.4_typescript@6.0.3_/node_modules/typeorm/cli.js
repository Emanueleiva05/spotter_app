#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("reflect-metadata");
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const CacheClearCommand_1 = require("./commands/CacheClearCommand");
const EntityCreateCommand_1 = require("./commands/EntityCreateCommand");
const InitCommand_1 = require("./commands/InitCommand");
const MigrationCreateCommand_1 = require("./commands/MigrationCreateCommand");
const MigrationGenerateCommand_1 = require("./commands/MigrationGenerateCommand");
const MigrationRevertCommand_1 = require("./commands/MigrationRevertCommand");
const MigrationRunCommand_1 = require("./commands/MigrationRunCommand");
const MigrationShowCommand_1 = require("./commands/MigrationShowCommand");
const QueryCommand_1 = require("./commands/QueryCommand");
const SchemaDropCommand_1 = require("./commands/SchemaDropCommand");
const SchemaLogCommand_1 = require("./commands/SchemaLogCommand");
const SchemaSyncCommand_1 = require("./commands/SchemaSyncCommand");
const SubscriberCreateCommand_1 = require("./commands/SubscriberCreateCommand");
const VersionCommand_1 = require("./commands/VersionCommand");
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .usage("Usage: $0 <command> [options]")
    .command(new CacheClearCommand_1.CacheClearCommand())
    .command(new EntityCreateCommand_1.EntityCreateCommand())
    .command(new InitCommand_1.InitCommand())
    .command(new MigrationCreateCommand_1.MigrationCreateCommand())
    .command(new MigrationGenerateCommand_1.MigrationGenerateCommand())
    .command(new MigrationRevertCommand_1.MigrationRevertCommand())
    .command(new MigrationRunCommand_1.MigrationRunCommand())
    .command(new MigrationShowCommand_1.MigrationShowCommand())
    .command(new QueryCommand_1.QueryCommand())
    .command(new SchemaDropCommand_1.SchemaDropCommand())
    .command(new SchemaLogCommand_1.SchemaLogCommand())
    .command(new SchemaSyncCommand_1.SchemaSyncCommand())
    .command(new SubscriberCreateCommand_1.SubscriberCreateCommand())
    .command(new VersionCommand_1.VersionCommand())
    .recommendCommands()
    .demandCommand(1)
    .strict()
    .alias("v", "version")
    .help("h")
    .alias("h", "help")
    .parse();
//# sourceMappingURL=cli.js.map