"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uint8ArrayToHex = exports.areUint8ArraysEqual = exports.isUint8Array = void 0;
const isBuffer = (value) => typeof Buffer !== "undefined" && Buffer.isBuffer(value);
const isUint8Array = (value) => {
    if (value instanceof Uint8Array) {
        return true;
    }
    if (!ArrayBuffer.isView(value)) {
        return false;
    }
    return Object.prototype.toString.call(value) === "[object Uint8Array]";
};
exports.isUint8Array = isUint8Array;
const areUint8ArraysEqual = (left, right) => {
    if (left === right) {
        return true;
    }
    if (isBuffer(left) && isBuffer(right)) {
        return left.equals(right);
    }
    if (left.byteLength !== right.byteLength) {
        return false;
    }
    for (let index = 0; index < left.byteLength; index++) {
        if (left[index] !== right[index]) {
            return false;
        }
    }
    return true;
};
exports.areUint8ArraysEqual = areUint8ArraysEqual;
const HEX_LOOKUP_TABLE = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
const uint8ArrayToHex = (value) => {
    if (typeof value.toHex === "function") {
        return value.toHex();
    }
    let hex = "";
    for (let index = 0; index < value.length; index++) {
        hex += HEX_LOOKUP_TABLE[value[index]];
    }
    return hex;
};
exports.uint8ArrayToHex = uint8ArrayToHex;
//# sourceMappingURL=Uint8ArrayUtils.js.map