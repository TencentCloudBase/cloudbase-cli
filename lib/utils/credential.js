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
const toolbox_1 = require("@cloudbase/toolbox");
const http_request_1 = require("./http-request");
const tools_1 = require("./tools");
const platform_1 = require("./platform");
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
function checkAndGetCredential(throwError = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const credential = yield toolbox_1.checkAndGetCredential({
            proxy: tools_1.getProxy()
        });
        if (!credential || lodash_1.default.isEmpty(credential)) {
            if (throwError) {
                throw new error_1.CloudBaseError('无有效身份信息，请使用 cloudbase login 登录');
            }
            return null;
        }
        return credential;
    });
}
exports.checkAndGetCredential = checkAndGetCredential;
