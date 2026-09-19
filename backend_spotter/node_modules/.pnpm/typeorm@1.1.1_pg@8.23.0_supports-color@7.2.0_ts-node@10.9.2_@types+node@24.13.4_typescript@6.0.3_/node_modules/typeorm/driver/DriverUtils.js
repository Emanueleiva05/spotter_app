"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverUtils = void 0;
const StringUtils_1 = require("../util/StringUtils");
const VersionUtils_1 = require("../util/VersionUtils");
/**
 * Common driver utility functions.
 */
class DriverUtils {
    // -------------------------------------------------------------------------
    // Public Static Methods
    // -------------------------------------------------------------------------
    /**
     * Returns true if given driver is SQLite-based driver.
     *
     * @param driver
     */
    static isSQLiteFamily(driver) {
        return [
            "better-sqlite3",
            "capacitor",
            "cordova",
            "expo",
            "nativescript",
            "react-native",
            "sqljs",
        ].includes(driver.options.type);
    }
    /**
     * Returns true if given driver is MySQL-based driver.
     *
     * @param driver
     */
    static isMySQLFamily(driver) {
        return ["mysql", "mariadb"].includes(driver.options.type);
    }
    static isReleaseVersionOrGreater(driver, version) {
        return VersionUtils_1.VersionUtils.isGreaterOrEqual(driver.version, version);
    }
    static isPostgresFamily(driver) {
        return ["postgres", "aurora-postgres", "cockroachdb"].includes(driver.options.type);
    }
    /**
     * Normalizes and builds a new driver options.
     * Extracts settings from connection url and sets to a new options object.
     *
     * @param options
     * @param buildOptions
     * @param buildOptions.useSid
     */
    static buildDriverOptions(options, buildOptions) {
        if (options.url) {
            const urlDriverOptions = this.parseConnectionUrl(options.url);
            if (buildOptions &&
                buildOptions.useSid &&
                urlDriverOptions.database) {
                urlDriverOptions.sid = urlDriverOptions.database;
            }
            for (const key of Object.keys(urlDriverOptions)) {
                if (typeof urlDriverOptions[key] === "undefined") {
                    delete urlDriverOptions[key];
                }
            }
            return Object.assign({}, options, urlDriverOptions);
        }
        return Object.assign({}, options);
    }
    /**
     * buildDriverOptions for MongodDB only to support replica set
     *
     * @param options
     * @param buildOptions
     * @param buildOptions.useSid
     */
    static buildMongoDBDriverOptions(options, buildOptions) {
        if (options.url) {
            const urlDriverOptions = this.parseMongoDBConnectionUrl(options.url);
            if (buildOptions &&
                buildOptions.useSid &&
                urlDriverOptions.database) {
                urlDriverOptions.sid = urlDriverOptions.database;
            }
            for (const key of Object.keys(urlDriverOptions)) {
                if (typeof urlDriverOptions[key] === "undefined") {
                    delete urlDriverOptions[key];
                }
            }
            return Object.assign({}, options, urlDriverOptions);
        }
        return Object.assign({}, options);
    }
    /**
     * Joins and shortens alias if needed.
     *
     * If the alias length is greater than the limit allowed by the current
     * driver, replaces it with a shortend string, if the shortend string
     * is still too long, it will then hash the alias.
     *
     * @param driver Current `Driver`.
     * @param driver.maxAliasLength
     * @param buildOptions Optional settings.
     * @param alias Alias parts.
     * @returns An alias that is no longer than the divers max alias length.
     */
    static buildAlias({ maxAliasLength }, buildOptions, ...alias) {
        const joiner = buildOptions?.joiner ?? "_";
        const newAlias = alias.length === 1 ? alias[0] : alias.join(joiner);
        if (maxAliasLength &&
            maxAliasLength > 0 &&
            newAlias.length > maxAliasLength) {
            if (buildOptions?.shorten === true) {
                const shortenedAlias = (0, StringUtils_1.shorten)(newAlias);
                if (shortenedAlias.length < maxAliasLength) {
                    return shortenedAlias;
                }
            }
            return (0, StringUtils_1.hash)(newAlias, { length: maxAliasLength });
        }
        return newAlias;
    }
    // -------------------------------------------------------------------------
    // Private Static Methods
    // -------------------------------------------------------------------------
    /**
     * Extracts connection data from the connection url.
     *
     * @param url
     */
    static parseConnectionUrl(url) {
        const type = url.split(":")[0];
        const firstSlashes = url.indexOf("//");
        const preBase = url.slice(firstSlashes + 2);
        const secondSlash = preBase.indexOf("/");
        const base = secondSlash === -1 ? preBase : preBase.slice(0, secondSlash);
        let afterBase = secondSlash === -1 ? undefined : preBase.slice(secondSlash + 1);
        // remove mongodb query params
        if (afterBase && afterBase.indexOf("?") !== -1) {
            afterBase = afterBase.slice(0, afterBase.indexOf("?"));
        }
        // normalize empty string to undefined so downstream ?? works correctly
        if (afterBase === "")
            afterBase = undefined;
        const { username, password, hostAndPort } = this.parseCredentials(base);
        const [host, port] = hostAndPort.split(":");
        return {
            type: type,
            host: host,
            username: decodeURIComponent(username),
            password: decodeURIComponent(password),
            port: port ? parseInt(port) : undefined,
            database: afterBase ?? undefined,
        };
    }
    /**
     * Extracts connection data from the connection url for MongoDB to support replica set.
     *
     * @param url
     */
    static parseMongoDBConnectionUrl(url) {
        const type = url.split(":")[0];
        const firstSlashes = url.indexOf("//");
        const preBase = url.slice(firstSlashes + 2);
        const secondSlash = preBase.indexOf("/");
        const base = secondSlash === -1 ? preBase : preBase.slice(0, secondSlash);
        let afterBase = secondSlash === -1 ? undefined : preBase.slice(secondSlash + 1);
        // normalize empty string to undefined so downstream ?? works correctly
        if (afterBase === "")
            afterBase = undefined;
        let afterQuestionMark;
        let host = undefined;
        let port = undefined;
        let hostReplicaSet = undefined;
        let replicaSet = undefined;
        const optionsObject = {};
        if (afterBase && afterBase.indexOf("?") !== -1) {
            // split params
            afterQuestionMark = afterBase.slice(afterBase.indexOf("?") + 1);
            const optionsList = afterQuestionMark.split("&");
            let optionKey;
            let optionValue;
            // create optionsObject for merge with connectionUrl object before return
            optionsList.forEach((optionItem) => {
                optionKey = optionItem.split("=")[0];
                optionValue = optionItem.split("=")[1];
                optionsObject[optionKey] = optionValue;
            });
            // specific replicaSet value to set options about hostReplicaSet
            replicaSet = optionsObject["replicaSet"];
            afterBase = afterBase.slice(0, afterBase.indexOf("?"));
        }
        const { username, password, hostAndPort } = this.parseCredentials(base);
        // If replicaSet have value set It as hostlist, If not set like standalone host
        if (replicaSet) {
            hostReplicaSet = hostAndPort;
        }
        else {
            ;
            [host, port] = hostAndPort.split(":");
        }
        const connectionUrl = {
            type: type,
            host: host,
            hostReplicaSet: hostReplicaSet,
            username: decodeURIComponent(username),
            password: decodeURIComponent(password),
            port: port ? parseInt(port) : undefined,
            database: afterBase ?? undefined,
        };
        // Loop to set every options in connectionUrl to object
        for (const [key, value] of Object.entries(optionsObject)) {
            connectionUrl[key] = value;
        }
        return connectionUrl;
    }
    static parseCredentials(base) {
        const lastAtSign = base.lastIndexOf("@");
        if (lastAtSign === -1) {
            return { username: "", password: "", hostAndPort: base };
        }
        const hostAndPort = base.slice(lastAtSign + 1);
        const credentials = base.slice(0, lastAtSign);
        const colonIndex = credentials.indexOf(":");
        return colonIndex === -1
            ? { username: credentials, password: "", hostAndPort }
            : {
                username: credentials.slice(0, colonIndex),
                password: credentials.slice(colonIndex + 1),
                hostAndPort,
            };
    }
}
exports.DriverUtils = DriverUtils;
//# sourceMappingURL=DriverUtils.js.map