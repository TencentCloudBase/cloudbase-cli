"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configstore_1 = require("../utils/configstore");
const constant_1 = require("../constant");
const logger_1 = require("../logger");
async function logout() {
    configstore_1.configStore.delete(constant_1.ConfigItems.credentail);
    configstore_1.configStore.delete(constant_1.ConfigItems.ssh);
    logger_1.successLog('注销登录成功！');
}
exports.logout = logout;
