"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const constant_1 = require("../constant");
const tcbService = new utils_1.CloudService('tcb', '2018-06-08');
function checkAuth(credential) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tmpSecretId, tmpSecretKey, tmpToken } = credential;
        tcbService.setCredential(tmpSecretId, tmpSecretKey, tmpToken);
        return yield tcbService.request('DescribeEnvs');
    });
}
const LoginRes = {
    SUCCESS: {
        code: 'SUCCESS',
        msg: '登录成功！'
    },
    INVALID_TOKEN: {
        code: 'INVALID_TOKEN',
        msg: '无效的身份信息！'
    },
    CHECK_LOGIN_FAILED: {
        code: 'CHECK_LOGIN_FAILED',
        msg: '检查登录态失败'
    },
    INVALID_PARAM(msg) {
        return {
            code: 'INVALID_PARAM',
            msg: `参数无效：${msg}`
        };
    },
    UNKNOWN_ERROR(msg) {
        return {
            code: 'UNKNOWN_ERROR',
            msg: `未知错误：${msg}`
        };
    }
};
function loginWithToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const isLogin = yield utils_1.checkAndGetCredential();
        if (isLogin) {
            return LoginRes.SUCCESS;
        }
        let credential;
        try {
            credential = yield utils_1.getAuthTokenFromWeb();
        }
        catch (e) {
            return LoginRes.UNKNOWN_ERROR(e.message);
        }
        if (!credential.refreshToken || !credential.uin) {
            return LoginRes.INVALID_TOKEN;
        }
        try {
            yield checkAuth(credential);
        }
        catch (e) {
            return LoginRes.UNKNOWN_ERROR(e.message);
        }
        utils_1.authStore.set(constant_1.ConfigItems.credentail, credential);
        return LoginRes.SUCCESS;
    });
}
exports.loginWithToken = loginWithToken;
function loginWithKey(secretId, secretKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const hasLogin = yield utils_1.checkAndGetCredential();
        if (hasLogin) {
            return LoginRes.SUCCESS;
        }
        if (!secretId || !secretKey) {
            return LoginRes.INVALID_PARAM('SecretID 或 SecretKey 不能为空');
        }
        try {
            yield checkAuth({ tmpSecretId: secretId, tmpSecretKey: secretKey });
        }
        catch (e) {
            return LoginRes.CHECK_LOGIN_FAILED;
        }
        utils_1.authStore.set(constant_1.ConfigItems.credentail, { secretId, secretKey });
        return LoginRes.SUCCESS;
    });
}
exports.loginWithKey = loginWithKey;
function login(options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (options && options.key) {
            const { secretId, secretKey } = options;
            return yield loginWithKey(secretId, secretKey);
        }
        else {
            return yield loginWithToken();
        }
    });
}
exports.login = login;
