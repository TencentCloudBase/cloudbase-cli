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
const tencentcloud_sdk_nodejs_1 = __importDefault(require("../../deps/tencentcloud-sdk-nodejs"));
const error_1 = require("../error");
const auth_1 = require("./auth");
function isObject(x) {
    return typeof x === 'object' && !Array.isArray(x) && x !== null;
}
function deepRemoveVoid(obj) {
    if (Array.isArray(obj)) {
        return obj.map(deepRemoveVoid);
    }
    else if (isObject(obj)) {
        let result = {};
        for (let key in obj) {
            const value = obj[key];
            if (typeof value !== 'undefined' && value !== null) {
                result[key] = deepRemoveVoid(value);
            }
        }
        return result;
    }
    else {
        return obj;
    }
}
class CloudService {
    constructor(service, version, baseParams) {
        this.service = service;
        this.version = `v${version.split('-').join('')}`;
        if (!tencentcloud_sdk_nodejs_1.default[service][this.version]) {
            throw new error_1.CloudBaseError('CloudService: Service Not Found');
        }
        this.baseParams = baseParams || {};
    }
    request(interfaceName, inParams = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Credential, HttpProfile } = tencentcloud_sdk_nodejs_1.default.common;
            if (!this.sdkCredential || !this.sdkCredential.secretId) {
                const credential = yield auth_1.getCredentialWithoutCheck();
                if (!credential) {
                    throw new error_1.CloudBaseError('无有效身份信息，请使用 cloudbase login 登录');
                }
                const { secretId, secretKey, token } = credential;
                this.sdkCredential = new Credential(secretId, secretKey, token);
            }
            const Client = tencentcloud_sdk_nodejs_1.default[this.service][this.version].Client;
            const models = tencentcloud_sdk_nodejs_1.default[this.service][this.version].Models;
            let client = new Client(this.sdkCredential, 'ap-shanghai', {
                signMethod: 'TC3-HMAC-SHA256',
                httpProfile: new HttpProfile()
            });
            let req = new models[`${interfaceName}Request`]();
            const params = deepRemoveVoid(inParams);
            const _params = Object.assign(Object.assign({ Region: 'ap-shanghai' }, this.baseParams), params);
            req.deserialize(_params);
            return new Promise((resolve, reject) => {
                client[interfaceName](req, (err, response) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(response);
                });
            });
        });
    }
    setCredential(secretId, secretKey, token) {
        const { Credential } = tencentcloud_sdk_nodejs_1.default.common;
        this.sdkCredential = new Credential(secretId, secretKey, token);
    }
}
exports.CloudService = CloudService;
