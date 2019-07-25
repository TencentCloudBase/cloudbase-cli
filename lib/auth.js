"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const os = require("os");
const fs = require("fs");
const ini = require("ini");
const portfinder = require("portfinder");
const queryString = require("query-string");
const open = require("open");
const ora = require("ora");
const request = require("request");
const crypto_1 = require("crypto");
const logger_1 = require("./logger");
const constant_1 = require("./constant");
const logger = new logger_1.default('Auth');
const defaultPort = 9012;
const CliAuthBaseUrl = 'https://console.cloud.tencent.com/tcb/auth';
const refreshTokenUrl = 'https://iaas.cloud.tencent.com/tcb_refresh';
// 获取本地可用端口
async function getPort() {
    const port = await portfinder.getPortPromise({
        port: defaultPort
    });
    return port;
}
// 获取本机 Mac 地址
function getMacAddress() {
    const networkInterfaces = os.networkInterfaces();
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
// MD5
function md5(str) {
    const hash = crypto_1.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}
function getAuthData() {
    if (fs.existsSync(constant_1.TCBRC)) {
        const tcbrc = ini.parse(fs.readFileSync(constant_1.TCBRC, 'utf-8'));
        if (!tcbrc.uin || !tcbrc.refreshToken) {
            // 缺少信息，重新登录
            return {}; // eslint-disable-line
        }
        return tcbrc;
    }
    else {
        // 没有登录过
        return {}; // eslint-disable-line
    }
}
exports.getAuthData = getAuthData;
async function createLocalServer() {
    return new Promise(async (resolve, reject) => {
        const server = http_1.createServer();
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
// 打开云开发控制台，获取授权
async function auth() {
    return new Promise(async (resolve, reject) => {
        const authSpinner = ora('正在打开腾讯云获取授权').start();
        try {
            const { server, port } = await createLocalServer();
            const mac = getMacAddress();
            const hash = md5(mac);
            const CliAuthUrl = `${CliAuthBaseUrl}?port=${port}&hash=${hash}`;
            await open(CliAuthUrl);
            authSpinner.succeed('已打开云开发 CLI 授权页面，请在云开发 CLI 授权页面同意授权！');
            server.on('request', (req, res) => {
                const { url } = req;
                const { query } = queryString.parseUrl(url);
                // CORS
                res.writeHead(200, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'text/plain'
                });
                res.end('ok');
                // 防止接受到异常请求导致本地服务关闭
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
exports.auth = auth;
// 临时密钥过期后，进行续期
async function refreshTmpToken(metaData) {
    const mac = getMacAddress();
    const hash = md5(mac);
    metaData.hash = hash;
    return new Promise((resolve, reject) => {
        request({
            url: refreshTokenUrl,
            method: 'POST',
            json: metaData
        }, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            if (res.body.code !== 0) {
                reject(new Error(res.body.message));
                return;
            }
            const { data: credential } = res.body;
            resolve(credential);
        });
    });
}
exports.refreshTmpToken = refreshTmpToken;
