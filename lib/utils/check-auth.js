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
const auth_1 = require("./auth");
const store_1 = require("./store");
const constant_1 = require("../constant");
const cloud_api_request_1 = require("./cloud-api-request");
const tcbService = new cloud_api_request_1.CloudApiService('tcb');
function checkAuth(secretId, secretKey, token) {
    return __awaiter(this, void 0, void 0, function* () {
        tcbService.setCredential(secretId, secretKey, token);
        return yield tcbService.request('DescribeEnvs');
    });
}
function checkAndGetCredential() {
    return __awaiter(this, void 0, void 0, function* () {
        const credential = auth_1.getCredentialData();
        if (!credential) {
            return null;
        }
        if (credential.secretId && credential.secretKey) {
            const { secretId, secretKey } = credential;
            yield checkAuth(secretId, secretKey);
            return {
                secretId,
                secretKey
            };
        }
        if (credential.refreshToken) {
            if (Date.now() < Number(credential.tmpExpired)) {
                const { tmpSecretId, tmpSecretKey, tmpToken } = credential;
                yield checkAuth(tmpSecretId, tmpSecretKey, tmpToken);
                return {
                    secretId: tmpSecretId,
                    secretKey: tmpSecretKey,
                    token: tmpToken
                };
            }
            else if (Date.now() < Number(credential.expired)) {
                let refreshCredential = null;
                try {
                    refreshCredential = yield auth_1.refreshTmpToken(credential);
                }
                catch (e) {
                    if (e.code === 'AUTH_FAIL') {
                        return null;
                    }
                    else {
                        throw e;
                    }
                }
                store_1.authStore.set(constant_1.ConfigItems.credentail, refreshCredential || {});
                const { tmpSecretId, tmpSecretKey, tmpToken } = refreshCredential;
                yield checkAuth(tmpSecretId, tmpSecretKey, tmpToken);
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
exports.checkAndGetCredential = checkAndGetCredential;
