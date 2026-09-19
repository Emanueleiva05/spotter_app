"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverFactory = void 0;
const MissingDriverError_1 = require("../error/MissingDriverError");
const AuroraMysqlDriver_1 = require("./aurora-mysql/AuroraMysqlDriver");
const AuroraPostgresDriver_1 = require("./aurora-postgres/AuroraPostgresDriver");
const BetterSqlite3Driver_1 = require("./better-sqlite3/BetterSqlite3Driver");
const CapacitorDriver_1 = require("./capacitor/CapacitorDriver");
const CockroachDriver_1 = require("./cockroachdb/CockroachDriver");
const CordovaDriver_1 = require("./cordova/CordovaDriver");
const ExpoDriver_1 = require("./expo/ExpoDriver");
const MongoDriver_1 = require("./mongodb/MongoDriver");
const MysqlDriver_1 = require("./mysql/MysqlDriver");
const NativescriptDriver_1 = require("./nativescript/NativescriptDriver");
const OracleDriver_1 = require("./oracle/OracleDriver");
const PostgresDriver_1 = require("./postgres/PostgresDriver");
const ReactNativeDriver_1 = require("./react-native/ReactNativeDriver");
const SapDriver_1 = require("./sap/SapDriver");
const SpannerDriver_1 = require("./spanner/SpannerDriver");
const SqljsDriver_1 = require("./sqljs/SqljsDriver");
const SqlServerDriver_1 = require("./sqlserver/SqlServerDriver");
/**
 * Helps to create drivers.
 */
class DriverFactory {
    /**
     * Creates a new driver depend on a given connection's driver type.
     *
     * @param dataSource DataSource instance.
     * @returns Driver
     */
    create(dataSource) {
        const { type } = dataSource.options;
        switch (type) {
            case "aurora-mysql":
                return new AuroraMysqlDriver_1.AuroraMysqlDriver(dataSource);
            case "aurora-postgres":
                return new AuroraPostgresDriver_1.AuroraPostgresDriver(dataSource);
            case "better-sqlite3":
                return new BetterSqlite3Driver_1.BetterSqlite3Driver(dataSource);
            case "capacitor":
                return new CapacitorDriver_1.CapacitorDriver(dataSource);
            case "cockroachdb":
                return new CockroachDriver_1.CockroachDriver(dataSource);
            case "cordova":
                return new CordovaDriver_1.CordovaDriver(dataSource);
            case "expo":
                return new ExpoDriver_1.ExpoDriver(dataSource);
            case "mariadb":
                return new MysqlDriver_1.MysqlDriver(dataSource);
            case "mongodb":
                return new MongoDriver_1.MongoDriver(dataSource);
            case "mssql":
                return new SqlServerDriver_1.SqlServerDriver(dataSource);
            case "mysql":
                return new MysqlDriver_1.MysqlDriver(dataSource);
            case "nativescript":
                return new NativescriptDriver_1.NativescriptDriver(dataSource);
            case "oracle":
                return new OracleDriver_1.OracleDriver(dataSource);
            case "postgres":
                return new PostgresDriver_1.PostgresDriver(dataSource);
            case "react-native":
                return new ReactNativeDriver_1.ReactNativeDriver(dataSource);
            case "sap":
                return new SapDriver_1.SapDriver(dataSource);
            case "spanner":
                return new SpannerDriver_1.SpannerDriver(dataSource);
            case "sqljs":
                return new SqljsDriver_1.SqljsDriver(dataSource);
            default:
                throw new MissingDriverError_1.MissingDriverError(type, [
                    "aurora-mysql",
                    "aurora-postgres",
                    "better-sqlite3",
                    "capacitor",
                    "cockroachdb",
                    "cordova",
                    "expo",
                    "mariadb",
                    "mongodb",
                    "mssql",
                    "mysql",
                    "nativescript",
                    "oracle",
                    "postgres",
                    "react-native",
                    "sap",
                    "spanner",
                    "sqljs",
                ]);
        }
    }
}
exports.DriverFactory = DriverFactory;
//# sourceMappingURL=DriverFactory.js.map