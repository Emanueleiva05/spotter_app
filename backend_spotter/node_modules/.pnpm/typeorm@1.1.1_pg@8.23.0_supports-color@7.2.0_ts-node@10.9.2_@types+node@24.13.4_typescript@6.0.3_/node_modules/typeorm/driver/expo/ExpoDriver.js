"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpoDriver = void 0;
const error_1 = require("../../error");
const PlatformTools_1 = require("../../platform/PlatformTools");
const AbstractSqliteDriver_1 = require("../sqlite-abstract/AbstractSqliteDriver");
const ExpoQueryRunner_1 = require("./ExpoQueryRunner");
class ExpoDriver extends AbstractSqliteDriver_1.AbstractSqliteDriver {
    constructor(dataSource) {
        super(dataSource);
        this.loadDependencies();
    }
    async disconnect() {
        this.queryRunner = undefined;
        await this.databaseConnection.closeAsync();
        this.databaseConnection = undefined;
    }
    createQueryRunner() {
        this.queryRunner ??= new ExpoQueryRunner_1.ExpoQueryRunner(this);
        return this.queryRunner;
    }
    async createDatabaseConnection() {
        this.databaseConnection = await this.sqlite.openDatabaseAsync(this.options.database);
        await this.databaseConnection.runAsync("PRAGMA foreign_keys = ON");
        return this.databaseConnection;
    }
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    loadDependencies() {
        try {
            this.sqlite =
                this.options.driver ?? PlatformTools_1.PlatformTools.load("expo-sqlite");
        }
        catch {
            throw new error_1.DriverPackageNotInstalledError("Expo SQLite", "expo-sqlite");
        }
        // The modern Expo SQLite API that TypeORM supports exposes `openDatabaseAsync` as a function
        if (typeof this.sqlite.openDatabaseAsync !== "function") {
            throw new error_1.TypeORMError(`The provided Expo SQLite client is not supported. Please upgrade your Expo SDK to v52 or higher!`);
        }
    }
}
exports.ExpoDriver = ExpoDriver;
//# sourceMappingURL=ExpoDriver.js.map