"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const crypto_1 = __importDefault(require("crypto"));
const query_string_1 = __importDefault(require("query-string"));
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent"));
const error_1 = require("../error");
const index_1 = require("./index");
function sha256(message, secret = '', encoding) {
    const hmac = crypto_1.default.createHmac('sha256', secret);
    return hmac.update(message).digest(encoding);
}
function getHash(message) {
    const hash = crypto_1.default.createHash('sha256');
    return hash.update(message).digest('hex');
}
function getDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}
function sign3({ method = 'POST', url = '', payload, timestamp, service, secretId, secretKey }) {
    const urlObj = new URL(url);
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
    const payloadHash = payload ? getHash(JSON.stringify(payload)) : getHash('');
    const canonicalRequest = method +
        '\n' +
        path +
        '\n' +
        querystring +
        '\n' +
        headers +
        '\n' +
        signedHeaders +
        '\n' +
        payloadHash;
    const date = getDate(timestamp);
    const StringToSign = 'TC3-HMAC-SHA256' +
        '\n' +
        timestamp +
        '\n' +
        `${date}/${service}/tc3_request` +
        '\n' +
        getHash(canonicalRequest);
    const kDate = sha256(date, 'TC3' + secretKey);
    const kService = sha256(service, kDate);
    const kSigning = sha256('tc3_request', kService);
    const signature = sha256(StringToSign, kSigning, 'hex');
    return `TC3-HMAC-SHA256 Credential=${secretId}/${date}/${service}/tc3_request, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}
async function requestWithSign3({ method, url, data, service, action, secretId, secretKey, token, timeout = 60000, version }) {
    const timestamp = Math.floor(Date.now() / 1000);
    method = method.toUpperCase();
    let payload = '';
    if (method === 'GET') {
        url += '?' + query_string_1.default.stringify(data);
    }
    if (method === 'POST') {
        payload = data;
    }
    const config = {
        method,
        timeout,
        headers: {
            Host: new URL(url).host,
            'X-TC-Action': action,
            'X-TC-Region': 'ap-shanghai',
            'X-TC-Timestamp': timestamp,
            'X-TC-Version': version
        }
    };
    if (token) {
        config.headers['X-TC-Token'] = token;
    }
    if (method === 'GET') {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (method === 'POST') {
        config.body = JSON.stringify(data);
        config.headers['Content-Type'] = 'application/json';
    }
    const signature = sign3({
        method,
        url,
        payload,
        timestamp,
        service,
        secretId,
        secretKey
    });
    config.headers['Authorization'] = signature;
    if (!config.agent && process.env.http_proxy) {
        config.agent = new https_proxy_agent_1.default(process.env.http_proxy);
    }
    const res = await node_fetch_1.default(url, config);
    return res;
}
class BaseHTTPService {
    constructor(service, version) {
        this.service = service;
        this.version = version;
    }
    async request(action, data = {}, method = 'POST') {
        const url = `https://${this.service}.tencentcloudapi.com`;
        const credential = await index_1.getCredential();
        const { secretId, secretKey, token } = credential;
        try {
            const res = await requestWithSign3({
                url,
                action,
                data,
                method,
                secretId,
                secretKey,
                token: token,
                service: this.service,
                version: this.version
            });
            if (res.status !== 200) {
                const tcError = new error_1.TcbError(res.statusText, {
                    code: res.status
                });
                throw tcError;
            }
            else {
                const data = await res.json();
                if (data.Response.Error) {
                    const tcError = new error_1.TcbError(data.Response.Error.Message, {
                        requestId: data.Response.RequestId,
                        code: data.Response.Error.Code
                    });
                    throw tcError;
                }
                else {
                    return data.Response;
                }
            }
        }
        catch (e) {
            throw new error_1.TcbError(e.message, {
                code: e.code
            });
        }
    }
}
exports.BaseHTTPService = BaseHTTPService;
