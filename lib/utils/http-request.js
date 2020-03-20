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
const node_fetch_1 = __importDefault(require("node-fetch"));
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent"));
const error_1 = require("../error");
const tools_1 = require("./tools");
const constant_1 = require("../constant");
function handleTimeout(e) {
    if (e.type === 'request-timeout') {
        throw new error_1.CloudBaseError('请求超时，请检查你的网络，如果终端无法直接访问公网，请设置终端 HTTP 请求代理！');
    }
    else {
        throw e;
    }
}
function fetch(url, config = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const proxy = tools_1.getProxy();
        if (proxy) {
            config.agent = new https_proxy_agent_1.default(proxy);
        }
        config.timeout = constant_1.REQUEST_TIMEOUT;
        let json;
        let text;
        try {
            const res = yield node_fetch_1.default(url, config);
            text = yield res.text();
            json = JSON.parse(text);
        }
        catch (e) {
            handleTimeout(e);
            json = text;
        }
        return json;
    });
}
exports.fetch = fetch;
function postFetch(url, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const proxy = tools_1.getProxy();
        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        if (proxy) {
            config.agent = new https_proxy_agent_1.default(proxy);
        }
        config.timeout = constant_1.REQUEST_TIMEOUT;
        let json;
        let text;
        try {
            const res = yield node_fetch_1.default(url, config);
            text = yield res.text();
            json = JSON.parse(text);
        }
        catch (e) {
            handleTimeout(e);
            json = text;
        }
        return json;
    });
}
exports.postFetch = postFetch;
function fetchStream(url, config = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const proxy = tools_1.getProxy();
        if (proxy) {
            config.agent = new https_proxy_agent_1.default(proxy);
        }
        config.timeout = constant_1.REQUEST_TIMEOUT;
        try {
            const res = yield node_fetch_1.default(url, config);
            return res;
        }
        catch (e) {
            handleTimeout(e);
        }
    });
}
exports.fetchStream = fetchStream;
