"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tencentcloud_sdk_nodejs_1 = __importDefault(require("../../deps/tencentcloud-sdk-nodejs"));
const error_1 = require("../error");
const index_1 = require("./index");
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
            throw new error_1.TcbError('CloudService: Service Not Found');
        }
        this.baseParams = baseParams || {};
    }
    async request(interfaceName, params = {}) {
        const { Credential, HttpProfile } = tencentcloud_sdk_nodejs_1.default.common;
        if (!this.sdkCredential || !this.sdkCredential.secretId) {
            const credential = await index_1.getCredential();
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
        params = deepRemoveVoid(params);
        const _params = Object.assign({ Region: 'ap-shanghai' }, this.baseParams, params);
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
    }
    setCredential(secretId, secretKey, token) {
        const { Credential } = tencentcloud_sdk_nodejs_1.default.common;
        this.sdkCredential = new Credential(secretId, secretKey, token);
    }
}
exports.CloudService = CloudService;
