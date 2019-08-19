"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const utils_1 = require("../utils");
const error_1 = require("../error");
const publicRsaKey = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0ZLB0ZpWWFsHPnDDw++Nc2wI3
nl2uyOrIJ5FUfxt4GAmt1Faf5pgMxAnL9exEUrrUDUX8Ri1R0KyfnHQQwCvKt8T8
bgILIJe9UB8e9dvFqgqH2oA8Vqwi0YqDcvFLFJk2BJbm/0QYtZ563FumW8LEXAgu
UeHi/0OZN9vQ33jWMQIDAQAB
-----END PUBLIC KEY-----
`;
function rsaEncrypt(data) {
    const buffer = Buffer.from(data);
    const encrypted = crypto_1.default.publicEncrypt({
        key: publicRsaKey,
        padding: crypto_1.default.constants.RSA_PKCS1_PADDING
    }, buffer);
    return encrypted.toString('base64');
}
const tcbService = new utils_1.CloudService('tcb', '2018-06-08');
async function getLoginConfigList({ envId }) {
    const { ConfigList = [] } = await tcbService.request('DescribeLoginConfigs', {
        EnvId: envId
    });
    return ConfigList;
}
exports.getLoginConfigList = getLoginConfigList;
async function createLoginConfig({ envId, platform, appId, appSecret }) {
    const validPlatform = ['WECHAT-OPEN', 'WECHAT-PUBLIC'];
    if (!validPlatform.includes(platform)) {
        throw new error_1.TcbError(`Invalid platform value: ${platform}. Now only support 'WECHAT-OPEN', 'WECHAT-PUBLIC'`);
    }
    await tcbService.request('CreateLoginConfig', {
        EnvId: envId,
        Platform: platform,
        PlatformId: appId,
        PlatformSecret: rsaEncrypt(appSecret),
        Status: 'ENABLE'
    });
}
exports.createLoginConfig = createLoginConfig;
async function updateLoginConfig({ configId, envId, status = 'ENABLE', appId = '', appSecret = '' }) {
    const validStatus = ['ENABLE', 'DISABLE'];
    if (!validStatus.includes(status)) {
        throw new error_1.TcbError(`Invalid status value: ${status}. Only support 'ENABLE', 'DISABLE'`);
    }
    const params = {
        EnvId: envId,
        ConfigId: configId,
        Status: status
    };
    appId && (params.PlatformId = appId);
    appSecret && (params.PlatformSecret = rsaEncrypt(appSecret));
    await tcbService.request('UpdateLoginConfig', params);
}
exports.updateLoginConfig = updateLoginConfig;
