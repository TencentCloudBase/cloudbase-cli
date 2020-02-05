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
const tools_1 = require("./tools");
function fetch(url, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const proxy = tools_1.getProxy();
        if (proxy) {
            config.agent = new https_proxy_agent_1.default(proxy);
        }
        const res = yield node_fetch_1.default(url, config);
        const text = yield res.text();
        let json;
        try {
            json = JSON.parse(text);
        }
        catch (e) {
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
        const res = yield node_fetch_1.default(url, config);
        const text = yield res.text();
        let json;
        try {
            json = JSON.parse(text);
        }
        catch (e) {
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
        return node_fetch_1.default(url, config);
    });
}
exports.fetchStream = fetchStream;
