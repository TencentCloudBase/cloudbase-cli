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
const tools_1 = require("./tools");
const http_request_1 = require("./http-request");
const platform_1 = require("./platform");
const auth_1 = require("./store/auth");
const constant_1 = require("../constant");
const error_1 = require("../error");
const refreshTokenUrl = 'https://iaas.cloud.tencent.com/tcb_refresh';
function refreshTmpToken(metaData) {
    return __awaiter(this, void 0, void 0, function* () {
        const mac = yield platform_1.getMacAddress();
        const hash = tools_1.md5(mac);
        metaData.hash = hash;
        const res = yield http_request_1.fetch(refreshTokenUrl, {
            method: 'POST',
            body: JSON.stringify(metaData),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.code !== 0) {
            throw new error_1.CloudBaseError(res.message, {
                code: res.code
            });
        }
        const { data: credential } = res;
        return credential;
    });
}
exports.refreshTmpToken = refreshTmpToken;
function getCredentialData() {
    return __awaiter(this, void 0, void 0, function* () {
        return auth_1.authStore.get(constant_1.ConfigItems.credentail);
    });
}
exports.getCredentialData = getCredentialData;
function getCredentialWithoutCheck() {
    return __awaiter(this, void 0, void 0, function* () {
        const credential = yield getCredentialData();
        if (!credential) {
            return null;
        }
        if (credential.secretId && credential.secretKey) {
            const { secretId, secretKey } = credential;
            return {
                secretId,
                secretKey
            };
        }
        if (credential.refreshToken) {
            if (Date.now() < Number(credential.tmpExpired)) {
                const { tmpSecretId, tmpSecretKey, tmpToken } = credential;
                return {
                    secretId: tmpSecretId,
                    secretKey: tmpSecretKey,
                    token: tmpToken
                };
            }
            else if (Date.now() < Number(credential.expired)) {
                const refreshCredential = yield refreshTmpToken(credential);
                yield auth_1.authStore.set(constant_1.ConfigItems.credentail, refreshCredential);
                const { tmpSecretId, tmpSecretKey, tmpToken } = refreshCredential;
                return {
                    secretId: tmpSecretId,
                    secretKey: tmpSecretKey,
                    token: tmpToken
                };
            }
        }
        return null;
    });
}
exports.getCredentialWithoutCheck = getCredentialWithoutCheck;
