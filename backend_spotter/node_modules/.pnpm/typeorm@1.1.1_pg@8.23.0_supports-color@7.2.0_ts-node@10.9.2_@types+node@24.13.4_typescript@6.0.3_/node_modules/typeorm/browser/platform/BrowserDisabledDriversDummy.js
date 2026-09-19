"use strict";
/**
 * Dummy driver classes for replacement via `package.json` in browser builds.
 * Using those classes reduces the build size by one third.
 *
 * If we don't include those dummy classes (and just disable the driver import
 * with `false` in `package.json`) typeorm will throw an error on runtime and
 * during webpack builds even if those driver are not used.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetterSqlite3Driver = exports.OracleDriver = exports.MysqlDriver = exports.SapDriver = exports.SqlServerDriver = exports.AuroraPostgresDriver = exports.CockroachDriver = exports.AuroraMysqlDriver = exports.PostgresDriver = exports.MongoRepository = exports.MongoEntityManager = exports.MongoQueryRunner = exports.MongoDriver = void 0;
/**
 * DO NOT IMPORT THIS CLASS -
 * This is a dummy class for replacement via `package.json` in browser builds
 */
class MongoDriver {
}
exports.MongoDriver = MongoDriver;
/**
 * DO NOT IMPORT THIS CLASS -
 * This is a dummy class for replacement via `package.json` in browser builds
 */
class MongoQueryRunner {
}
exports.MongoQueryRunner = MongoQueryRunner;
/**
 * DO NOT IMPORT THIS CLASS -
 * This is a dummy class for replacement via `package.json` in browser builds
 */
class MongoEntityManager {
}
exports.MongoEntityManager = MongoEntityManager;
/**
 * DO NOT IMPORT THIS CLASS -
 * This is a dummy class for replacement via `package.json` in browser builds
 */
class MongoRepository {
}
exports.MongoRepository = MongoRepository;
/**
 * DO NOT IMPORT THIS CLASS -
 * This is a dummy class for replacement via `package.json` in browser builds
 */
class PostgresDriver {
}
exports.PostgresDriver = PostgresDriver;
/**
 * DO NOT IMPORT THIS CLASS -
 * This is a dummy class for replacement via `package.json` in browser builds
 */
class AuroraMysqlDriver {
}
exports.AuroraMysqlDriver = AuroraMysqlDriver;
/**
 * DO NOT IMPORT THIS CLASS -
 * This is a dummy class for replacement via `package.json` in browser builds
 */
class CockroachDriver {
}
exports.CockroachDriver = CockroachDriver;
/**
 * DO NOT IMPORT THIS CLASS -
 * This is a dummy class for replacement via `package.json` in browser builds
 */
class AuroraPostgresDriver {
}
exports.AuroraPostgresDriver = AuroraPostgresDriver;
/**
 * DO NOT IMPORT THIS CLASS -
 * This is a dummy class for replacement via `package.json` in browser builds
 */
class SqlServerDriver {
}
exports.SqlServerDriver = SqlServerDriver;
/**
 * DO NOT IMPORT THIS CLASS -
 * This is a dummy class for replacement via `package.json` in browser builds
 */
class SapDriver {
}
exports.SapDriver = SapDriver;
/**
 * DO NOT IMPORT THIS CLASS -
 * This is a dummy class for replacement via `package.json` in browser builds
 */
class MysqlDriver {
}
exports.MysqlDriver = MysqlDriver;
/**
 * DO NOT IMPORT THIS CLASS -
 * This is a dummy class for replacement via `package.json` in browser builds
 */
class OracleDriver {
}
exports.OracleDriver = OracleDriver;
/**
 * DO NOT IMPORT THIS CLASS -
 * This is a dummy class for replacement via `package.json` in browser builds
 */
class BetterSqlite3Driver {
}
exports.BetterSqlite3Driver = BetterSqlite3Driver;
//# sourceMappingURL=BrowserDisabledDriversDummy.js.map