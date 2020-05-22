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
const url_1 = require("url");
const query_string_1 = __importDefault(require("query-string"));
const toolbox_1 = require("@cloudbase/toolbox");
const http_request_1 = require("./http-request");
const error_1 = require("../error");
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
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (typeof value !== 'undefined' && value !== null) {
                    result[key] = deepRemoveVoid(value);
                }
            }
        }
        return result;
    }
    else {
        return obj;
    }
}
function sha256(message, secret, encoding) {
    const hmac = crypto_1.default.createHmac('sha256', secret);
    return hmac.update(message).digest(encoding);
}
function getHash(message) {
    const hash = crypto_1.default.createHash('sha256');
    return hash.update(message).digest('hex');
}
function getDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getUTCFullYear();
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + date.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
}
const ServiceVersionMap = {
    tcb: '2018-06-08',
    scf: '2018-04-16',
    flexdb: '2018-11-27',
    cam: '2019-01-16',
    vpc: '2017-03-12',
    ssl: '2019-12-05'
};
let commonCredential;
class CloudApiService {
    constructor(service, baseParams, version = '') {
        this.service = service;
        this.version = ServiceVersionMap[service] || version;
        this.timeout = 60000;
        this.baseParams = baseParams || {};
        const logoutListener = process.listenerCount('logout');
        if (!logoutListener) {
            process.on('logout', () => {
                commonCredential = null;
            });
        }
    }
    static getInstance(service) {
        var _a;
        if ((_a = CloudApiService.serviceCacheMap) === null || _a === void 0 ? void 0 : _a[service]) {
            return CloudApiService.serviceCacheMap[service];
        }
        const apiService = new CloudApiService(service);
        CloudApiService.serviceCacheMap[service] = apiService;
        return apiService;
    }
    get baseUrl() {
        const urlMap = {
            tcb: process.env.TCB_BASE_URL || 'https://tcb.tencentcloudapi.com',
            flexdb: 'https://flexdb.ap-shanghai.tencentcloudapi.com'
        };
        if (urlMap[this.service]) {
            return urlMap[this.service];
        }
        else {
            return `https://${this.service}.tencentcloudapi.com`;
        }
    }
    request(action, data = {}, method = 'POST') {
        return __awaiter(this, void 0, void 0, function* () {
            this.action = action;
            this.data = deepRemoveVoid(Object.assign(Object.assign({}, data), this.baseParams));
            this.method = method;
            this.url = this.baseUrl;
            if (!(commonCredential === null || commonCredential === void 0 ? void 0 : commonCredential.secretId)) {
                const credential = yield toolbox_1.getCredentialWithoutCheck();
                if (!credential) {
                    throw new error_1.CloudBaseError('无有效身份信息，请使用 cloudbase login 登录');
                }
                commonCredential = credential;
            }
            try {
                const data = yield this.requestWithSign();
                if (data.Response.Error) {
                    const tcError = new error_1.CloudBaseError(data.Response.Error.Message, {
                        requestId: data.Response.RequestId,
                        code: data.Response.Error.Code
                    });
                    throw tcError;
                }
                else {
                    return data.Response;
                }
            }
            catch (e) {
                throw new error_1.CloudBaseError(e.message, {
                    action,
                    code: e.code
                });
            }
        });
    }
    requestWithSign() {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = Math.floor(Date.now() / 1000);
            const { method, timeout, data = {} } = this;
            if (method === 'GET') {
                this.url += '?' + query_string_1.default.stringify(data);
            }
            if (method === 'POST') {
                this.payload = data;
            }
            const config = {
                method,
                timeout,
                headers: {
                    Host: new url_1.URL(this.url).host,
                    'X-TC-Action': this.action,
                    'X-TC-Region': process.env.TCB_REGION || 'ap-shanghai',
                    'X-TC-Timestamp': timestamp,
                    'X-TC-Version': this.version
                }
            };
            if (commonCredential === null || commonCredential === void 0 ? void 0 : commonCredential.token) {
                config.headers['X-TC-Token'] = commonCredential === null || commonCredential === void 0 ? void 0 : commonCredential.token;
            }
            if (method === 'GET') {
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            if (method === 'POST') {
                config.body = JSON.stringify(data);
                config.headers['Content-Type'] = 'application/json';
            }
            const sign = this.getRequestSign(timestamp);
            config.headers['Authorization'] = sign;
            return http_request_1.fetch(this.url, config);
        });
    }
    getRequestSign(timestamp) {
        const { method = 'POST', url, service } = this;
        const { secretId, secretKey } = commonCredential;
        const urlObj = new url_1.URL(url);
        let headers = '';
        const signedHeaders = 'content-type;host';
        if (method === 'GET') {
            headers = 'content-type:application/x-www-form-urlencoded\n';
        }
        else if (method === 'POST') {
            headers = 'content-type:application/json\n';
        }
        headers += `host:${urlObj.hostname}\n`;
        const path = urlObj.pathname;
        const querystring = urlObj.search.slice(1);
        const payloadHash = this.payload ? getHash(JSON.stringify(this.payload)) : getHash('');
        const canonicalRequest = `${method}\n${path}\n${querystring}\n${headers}\n${signedHeaders}\n${payloadHash}`;
        const date = getDate(timestamp);
        const StringToSign = `TC3-HMAC-SHA256\n${timestamp}\n${date}/${service}/tc3_request\n${getHash(canonicalRequest)}`;
        const kDate = sha256(date, `TC3${secretKey}`);
        const kService = sha256(service, kDate);
        const kSigning = sha256('tc3_request', kService);
        const signature = sha256(StringToSign, kSigning, 'hex');
        return `TC3-HMAC-SHA256 Credential=${secretId}/${date}/${service}/tc3_request, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    }
    setCredential(secretId, secretKey, token) {
        commonCredential = {
            secretId,
            secretKey,
            token
        };
    }
}
exports.CloudApiService = CloudApiService;
CloudApiService.serviceCacheMap = {};
