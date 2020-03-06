"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
