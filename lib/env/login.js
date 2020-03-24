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
const tcbService = utils_1.CloudApiService.getInstance('tcb');
function getLoginConfigList({ envId }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ConfigList = [] } = yield tcbService.request('DescribeLoginConfigs', {
            EnvId: envId
        });
        return ConfigList;
    });
}
exports.getLoginConfigList = getLoginConfigList;
function createLoginConfig({ envId, platform, appId, appSecret }) {
    return __awaiter(this, void 0, void 0, function* () {
        const validPlatform = ['WECHAT-OPEN', 'WECHAT-PUBLIC', 'ANONYMOUS'];
        if (!validPlatform.includes(platform)) {
            throw new error_1.CloudBaseError(`Invalid platform value: ${platform}. Now only support 'WECHAT-OPEN', 'WECHAT-PUBLIC', 'ANONYMOUS`);
        }
        const params = {
            EnvId: envId,
            Platform: platform,
            PlatformId: appId,
            PlatformSecret: rsaEncrypt(appSecret),
            Status: 'ENABLE'
        };
        yield tcbService.request('CreateLoginConfig', params);
    });
}
exports.createLoginConfig = createLoginConfig;
function updateLoginConfig({ configId, envId, status = 'ENABLE', appId = '', appSecret = '' }) {
    return __awaiter(this, void 0, void 0, function* () {
        const validStatus = ['ENABLE', 'DISABLE'];
        if (!validStatus.includes(status)) {
            throw new error_1.CloudBaseError(`Invalid status value: ${status}. Only support 'ENABLE', 'DISABLE'`);
        }
        const params = {
            EnvId: envId,
            ConfigId: configId,
            Status: status
        };
        appId && (params.PlatformId = appId);
        appSecret && (params.PlatformSecret = rsaEncrypt(appSecret));
        yield tcbService.request('UpdateLoginConfig', params);
    });
}
exports.updateLoginConfig = updateLoginConfig;
