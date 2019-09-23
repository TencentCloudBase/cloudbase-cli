"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const http_1 = __importDefault(require("http"));
const crypto_1 = __importDefault(require("crypto"));
const portfinder_1 = __importDefault(require("portfinder"));
const query_string_1 = __importDefault(require("query-string"));
const open_1 = __importDefault(require("open"));
const ora_1 = __importDefault(require("ora"));
const logger_1 = __importDefault(require("../logger"));
const os_release_1 = require("../utils/os-release");
const utils_1 = require("../utils");
const logger = new logger_1.default('Auth');
const defaultPort = 9012;
const CliAuthBaseUrl = 'https://console.cloud.tencent.com/tcb/auth';
const refreshTokenUrl = 'https://iaas.cloud.tencent.com/tcb_refresh';
async function getPort() {
    const port = await portfinder_1.default.getPortPromise({
        port: defaultPort
    });
    return port;
}
function getMacAddress() {
    const networkInterfaces = os_1.default.networkInterfaces();
    const options = ['eth0', 'eth1', 'en0', 'en1'];
    let netInterface = [];
    options.some(key => {
        if (networkInterfaces[key]) {
            netInterface = networkInterfaces[key];
            return true;
        }
    });
    const mac = (netInterface.length && netInterface[0].mac) || '';
    return mac;
}
function getOSInfo() {
    const hostname = os_1.default.hostname();
    const platform = os_1.default.platform();
    const release = os_1.default.release();
    const platformRelease = os_release_1.getPlatformRelease(platform, release);
    return [hostname, platformRelease].join('/');
}
function md5(str) {
    const hash = crypto_1.default.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}
async function createLocalServer() {
    return new Promise(async (resolve, reject) => {
        const server = http_1.default.createServer();
        try {
            const port = await getPort();
            server.listen(port, () => {
                resolve({
                    port,
                    server
                });
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
async function getAuthTokenFromWeb() {
    return new Promise(async (resolve, reject) => {
        const authSpinner = ora_1.default('正在打开腾讯云获取授权').start();
        try {
            const { server, port } = await createLocalServer();
            const mac = getMacAddress();
            const os = getOSInfo();
            const hash = md5(mac);
            const CliAuthUrl = `${CliAuthBaseUrl}?port=${port}&hash=${hash}&mac=${mac}&os=${os}`;
            await open_1.default(CliAuthUrl);
            authSpinner.succeed('已打开云开发 CLI 授权页面，请在云开发 CLI 授权页面同意授权！');
            server.on('request', (req, res) => {
                const { url } = req;
                const { query } = query_string_1.default.parseUrl(url);
                res.writeHead(200, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'text/plain',
                    Connection: 'close'
                });
                res.end('ok');
                if (query && query.tmpToken) {
                    server.close();
                }
                resolve(query);
            });
        }
        catch (err) {
            logger.error(err.message);
            authSpinner.fail('获取授权失败！');
            reject(err);
        }
    });
}
exports.getAuthTokenFromWeb = getAuthTokenFromWeb;
async function refreshTmpToken(metaData) {
    const mac = getMacAddress();
    const hash = md5(mac);
    metaData.hash = hash;
    const res = await utils_1.fetch(refreshTokenUrl, {
        method: 'POST',
        body: JSON.stringify(metaData),
        headers: { 'Content-Type': 'application/json' }
    });
    if (res.code !== 0) {
        throw new Error(res.message);
    }
    const { data: credential } = res;
    return credential;
}
exports.refreshTmpToken = refreshTmpToken;
