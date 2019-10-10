"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configstore_1 = require("../utils/configstore");
const constant_1 = require("../constant");
const logger_1 = require("../logger");
const auth_1 = require("./auth");
const utils_1 = require("../utils");
async function logout() {
    const credentail = utils_1.getCredentialConfig();
    try {
        await auth_1.refreshTmpToken(Object.assign({}, credentail, { isLogout: true }));
        configstore_1.configStore.delete(constant_1.ConfigItems.credentail);
        configstore_1.configStore.delete(constant_1.ConfigItems.ssh);
        logger_1.successLog('注销登录成功！');
    }
    catch (e) {
        configstore_1.configStore.delete(constant_1.ConfigItems.credentail);
        configstore_1.configStore.delete(constant_1.ConfigItems.ssh);
        logger_1.successLog('注销登录成功！');
    }
}
exports.logout = logout;
