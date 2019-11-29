"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error");
function assertTrue(val, errMsg) {
    if (!val) {
        throw new error_1.CloudBaseError(errMsg);
    }
}
exports.assertTrue = assertTrue;
function assertHas(obj, prop, errMsg) {
    if (!obj[prop]) {
        throw new error_1.CloudBaseError(errMsg);
    }
}
exports.assertHas = assertHas;
