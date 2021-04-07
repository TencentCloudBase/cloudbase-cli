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
exports.checkLogin = exports.login = exports.loginWithKey = exports.loginByWebAuth = void 0;
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("../utils");
const decorators_1 = require("../decorators");
const env_1 = require("../env");
const log = new decorators_1.Logger();
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
    }
};
function loginByWebAuth() {
    return __awaiter(this, void 0, void 0, function* () {
        const credential = yield utils_1.authSupevisor.loginByWebAuth();
        if (lodash_1.default.isEmpty(credential)) {
            return LoginRes.INVALID_TOKEN;
        }
        return Object.assign({ credential }, LoginRes.SUCCESS);
    });
}
exports.loginByWebAuth = loginByWebAuth;
function loginWithKey(secretId, secretKey, token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!secretId || !secretKey) {
            return LoginRes.INVALID_PARAM('SecretID 或 SecretKey 不能为空');
        }
        const credential = yield utils_1.authSupevisor.loginByApiSecret(secretId, secretKey, token);
        if (lodash_1.default.isEmpty(credential)) {
            return LoginRes.INVALID_TOKEN;
        }
        return LoginRes.SUCCESS;
    });
}
exports.loginWithKey = loginWithKey;
function login(options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { secretId, secretKey, key, token } = options;
        return key ? loginWithKey(secretId, secretKey, token) : loginByWebAuth();
    });
}
exports.login = login;
function checkLogin() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const credential = yield utils_1.checkAndGetCredential();
        if (lodash_1.default.isEmpty(credential)) {
            log.info('你还没有登录，请在控制台中授权登录');
            const res = yield utils_1.execWithLoading(() => login(), {
                startTip: '获取授权中...',
                successTip: '授权登录成功！'
            });
            const envId = (_a = res === null || res === void 0 ? void 0 : res.credential) === null || _a === void 0 ? void 0 : _a.envId;
            if (envId) {
                const env = yield env_1.getEnvInfo(envId);
                if (env.Status === "UNAVAILABLE") {
                    yield utils_1.checkEnvAvaliable(envId);
                }
            }
        }
    });
}
exports.checkLogin = checkLogin;
