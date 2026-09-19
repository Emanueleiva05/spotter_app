"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionUtils = void 0;
class VersionUtils {
    static isGreaterOrEqual(version, targetVersion) {
        if (!version) {
            return false;
        }
        const v1 = parseVersion(version);
        const v2 = parseVersion(targetVersion);
        const length = Math.max(v1.length, v2.length);
        for (let i = 0; i < length; i++) {
            const a = v1[i] ?? 0;
            const b = v2[i] ?? 0;
            if (a > b) {
                return true;
            }
            else if (a < b) {
                return false;
            }
        }
        return true;
    }
}
exports.VersionUtils = VersionUtils;
/**
 *
 * @param version
 */
function parseVersion(version) {
    return version.split(".").map((value) => parseInt(value, 10));
}
//# sourceMappingURL=VersionUtils.js.map