"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./auth");
const utils_1 = require("../utils");
const constant_1 = require("../constant");
const configstore_1 = require("../utils/configstore");
const tcbService = new utils_1.CloudService('tcb', '2018-06-08');
async function checkAuth(credential) {
    const { tmpSecretId, tmpSecretKey, tmpToken } = credential;
    tcbService.setCredential(tmpSecretId, tmpSecretKey, tmpToken);
    return await tcbService.request('DescribeEnvs');
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
async function loginWithToken() {
    const tcbrc = utils_1.getCredentialConfig();
    if (tcbrc.secretId && tcbrc.secretKey) {
        return LoginRes.SUCCESS;
    }
    const tmpExpired = Number(tcbrc.tmpExpired) || 0;
    let refreshExpired = Number(tcbrc.expired) || 0;
    const now = Date.now();
    if (now < tmpExpired) {
        return LoginRes.SUCCESS;
    }
    let credential;
    try {
        if (now < refreshExpired) {
            credential = await auth_1.refreshTmpToken(tcbrc);
        }
        else {
            credential = await auth_1.getAuthTokenFromWeb();
        }
    }
    catch (e) {
        return LoginRes.UNKNOWN_ERROR(e.message);
    }
    if (!credential.refreshToken || !credential.uin) {
        return LoginRes.INVALID_TOKEN;
    }
    try {
        await checkAuth(credential);
    }
    catch (e) {
        return LoginRes.UNKNOWN_ERROR(e.message);
    }
    configstore_1.configStore.set(constant_1.ConfigItems.credentail, credential);
    return LoginRes.SUCCESS;
}
exports.loginWithToken = loginWithToken;
async function loginWithKey(secretId, secretKey) {
    const tcbrc = await utils_1.getCredentialConfig();
    if (tcbrc.secretId && tcbrc.secretKey) {
        return LoginRes.SUCCESS;
    }
    if (!secretId || !secretKey) {
        return LoginRes.INVALID_PARAM('SecretID 或 SecretKey 不能为空');
    }
    try {
        await checkAuth({ tmpSecretId: secretId, tmpSecretKey: secretKey });
    }
    catch (e) {
        return LoginRes.CHECK_LOGIN_FAILED;
    }
    configstore_1.configStore.set(constant_1.ConfigItems.credentail, { secretId, secretKey });
    return LoginRes.SUCCESS;
}
exports.loginWithKey = loginWithKey;
async function login(options) {
    if (options && options.key) {
        const { secretId, secretKey } = options;
        return await loginWithKey(secretId, secretKey);
    }
    else {
        return await loginWithToken();
    }
}
exports.login = login;
