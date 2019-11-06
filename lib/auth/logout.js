"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const constant_1 = require("../constant");
const logger_1 = require("../logger");
const error_1 = require("../error");
function logout() {
    return __awaiter(this, void 0, void 0, function* () {
        const credentail = utils_1.getCredentialData();
        try {
            yield utils_1.refreshTmpToken(Object.assign(Object.assign({}, credentail), { isLogout: true }));
            utils_1.authStore.delete(constant_1.ConfigItems.credentail);
            utils_1.authStore.delete(constant_1.ConfigItems.ssh);
            logger_1.successLog('注销登录成功！');
        }
        catch (e) {
            utils_1.authStore.delete(constant_1.ConfigItems.credentail);
            utils_1.authStore.delete(constant_1.ConfigItems.ssh);
            throw new error_1.CloudBaseError('云端设备登录记录删除失败，请手动删除！');
        }
    });
}
exports.logout = logout;
