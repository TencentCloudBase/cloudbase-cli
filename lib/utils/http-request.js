"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent"));
async function fetch(url, config = {}) {
    if (process.env.http_proxy) {
        config.agent = new https_proxy_agent_1.default(process.env.http_proxy);
    }
    const res = await node_fetch_1.default(url, config);
    return res.json();
}
exports.fetch = fetch;
async function fetchStream(url, config = {}) {
    if (process.env.http_proxy) {
        config.agent = new https_proxy_agent_1.default(process.env.http_proxy);
    }
    return node_fetch_1.default(url, config);
}
exports.fetchStream = fetchStream;
