"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIp = exports.assertHas = exports.assertTruthy = void 0;
const error_1 = require("../error");
function assertTruthy(val, errMsg) {
    let ok;
    if (Array.isArray(val)) {
        ok = val.every(item => Boolean(val));
    }
    else {
        ok = Boolean(val);
    }
    if (!ok) {
        throw new error_1.CloudBaseError(errMsg);
    }
}
exports.assertTruthy = assertTruthy;
function assertHas(obj, prop, errMsg) {
    if (!obj[prop]) {
        throw new error_1.CloudBaseError(errMsg);
    }
}
exports.assertHas = assertHas;
const validateIp = (ip) => {
    if (Object.prototype.toString.call(ip) !== '[object String]')
        return false;
    const fields = ip.split('.');
    if (fields.length !== 4 ||
        fields.find(item => isNaN(Number(item)) || Number(item) < 0 || Number(item) > 255))
        return false;
    return true;
};
exports.validateIp = validateIp;
