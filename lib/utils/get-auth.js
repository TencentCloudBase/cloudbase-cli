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
const lodash_1 = __importDefault(require("lodash"));
const web_auth_1 = require("./web-auth");
const store_1 = require("./store");
const credential_1 = require("./credential");
const constant_1 = require("../constant");
const error_1 = require("../error");
function wrapCheckAuth({ secretId, secretKey, token = '', throwError }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield web_auth_1.checkAuth({
                tmpSecretId: secretId,
                tmpSecretKey: secretKey,
                tmpToken: token
            });
            return {
                token,
                secretId,
                secretKey
            };
        }
        catch (error) {
            if (throwError) {
                throw new error_1.CloudBaseError('无有效身份信息，请使用 cloudbase login 登录');
            }
            return null;
        }
    });
}
function checkAndGetCredential(throwError = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const credential = yield credential_1.getCredentialData();
        if (!credential || lodash_1.default.isEmpty(credential)) {
            if (throwError) {
                throw new error_1.CloudBaseError('无有效身份信息，请使用 cloudbase login 登录');
            }
            return null;
        }
        if (credential.secretId && credential.secretKey) {
            const { secretId, secretKey } = credential;
            return wrapCheckAuth({
                secretId,
                secretKey,
                throwError
            });
        }
        if (credential.refreshToken) {
            if (Date.now() < Number(credential.tmpExpired)) {
                const { tmpSecretId, tmpSecretKey, tmpToken } = credential;
                return wrapCheckAuth({
                    secretId: tmpSecretId,
                    secretKey: tmpSecretKey,
                    token: tmpToken,
                    throwError
                });
            }
            else if (Date.now() < Number(credential.expired)) {
                let refreshCredential = null;
                try {
                    refreshCredential = yield credential_1.refreshTmpToken(credential);
                }
                catch (e) {
                    if (e.code === 'AUTH_FAIL') {
                        return null;
                    }
                    else {
                        throw e;
                    }
                }
                yield store_1.authStore.set(constant_1.ConfigItems.credentail, refreshCredential || {});
                const { tmpSecretId, tmpSecretKey, tmpToken } = refreshCredential;
                return wrapCheckAuth({
                    secretId: tmpSecretId,
                    secretKey: tmpSecretKey,
                    token: tmpToken,
                    throwError
                });
            }
        }
        if (throwError) {
            throw new error_1.CloudBaseError('无有效身份信息，请使用 cloudbase login 登录');
        }
        return null;
    });
}
exports.checkAndGetCredential = checkAndGetCredential;
