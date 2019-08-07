"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const archiver_1 = __importDefault(require("archiver"));
const readline_1 = __importDefault(require("readline"));
const tencentcloud_sdk_nodejs_1 = __importDefault(require("../../deps/tencentcloud-sdk-nodejs"));
const auth_1 = require("../auth/auth");
const configstore_1 = require("./configstore");
const constant_1 = require("../constant");
const error_1 = require("../error");
var cli_table_1 = require("./cli-table");
exports.printCliTable = cli_table_1.printCliTable;
async function zipDir(dirPath, outputPath) {
    return new Promise((resolve, reject) => {
        const output = fs_1.default.createWriteStream(outputPath);
        const archive = archiver_1.default('zip');
        output.on('close', function () {
            resolve({
                zipPath: outputPath,
                size: Math.ceil(archive.pointer() / 1024)
            });
        });
        archive.on('error', function (err) {
            reject(err);
        });
        archive.pipe(output);
        archive.directory(dirPath, '');
        archive.finalize();
    });
}
exports.zipDir = zipDir;
function askForInput(question) {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer);
            rl.close();
        });
    });
}
exports.askForInput = askForInput;
function callCloudApi(secretId, secretKey) {
    const CvmClient = tencentcloud_sdk_nodejs_1.default.cvm.v20170312.Client;
    const models = tencentcloud_sdk_nodejs_1.default.cvm.v20170312.Models;
    const Credential = tencentcloud_sdk_nodejs_1.default.common.Credential;
    let cred = new Credential(secretId, secretKey);
    let client = new CvmClient(cred, 'ap-shanghai');
    let req = new models.DescribeZonesRequest();
    return new Promise((resolve, reject) => {
        client.DescribeZones(req, function (err, response) {
            if (err) {
                reject(err);
                return;
            }
            resolve(response);
        });
    });
}
exports.callCloudApi = callCloudApi;
function getCredentialConfig() {
    return configstore_1.configStore.get(constant_1.ConfigItems.credentail);
}
exports.getCredentialConfig = getCredentialConfig;
async function getCredential() {
    const credential = getCredentialConfig();
    if (credential.secretId && credential.secretKey) {
        return {
            secretId: credential.secretId,
            secretKey: credential.secretKey
        };
    }
    if (credential.refreshToken) {
        if (Date.now() < Number(credential.tmpExpired)) {
            const { tmpSecretId, tmpSecretKey, tmpToken } = credential;
            return {
                secretId: tmpSecretId,
                secretKey: tmpSecretKey,
                token: tmpToken
            };
        }
        else if (Date.now() < Number(credential.expired)) {
            const refreshCredential = await auth_1.refreshTmpToken(credential);
            configstore_1.configStore.set(constant_1.ConfigItems.credentail, refreshCredential);
            const { tmpSecretId, tmpSecretKey, tmpToken } = refreshCredential;
            return {
                secretId: tmpSecretId,
                secretKey: tmpSecretKey,
                token: tmpToken
            };
        }
    }
    throw new error_1.TcbError('无有效身份信息，请使用 tcb login 登录');
}
exports.getCredential = getCredential;
function getSSHConfig() {
    return (configstore_1.configStore.get(constant_1.ConfigItems.ssh) || {});
}
exports.getSSHConfig = getSSHConfig;
async function getSSH() {
    let sshConfig = getSSHConfig();
    if (!sshConfig.host ||
        !sshConfig.port ||
        !sshConfig.username ||
        !sshConfig.password) {
        let { host, port = '22', username = 'root', password } = sshConfig;
        host =
            (await askForInput(`请输入服务器 host${host ? `(${host})` : ''}:`)) || host;
        port = (await askForInput(`请输入服务器 ssh 端口(${port}):`)) || port;
        username = (await askForInput(`请输入用户名(${username}):`)) || username;
        password = await askForInput(`请输入登录密码${password ? `(${password})` : ''}:`);
        let config = {
            host,
            port,
            username,
            password
        };
        configstore_1.configStore.set(constant_1.ConfigItems.ssh, config);
        return config;
    }
    return sshConfig;
}
exports.getSSH = getSSH;
function getTcbConfig() {
    return configstore_1.configStore.all();
}
exports.getTcbConfig = getTcbConfig;
function parseCommandArgs(args) {
    const parsed = {};
    args.forEach(arg => {
        const parts = arg.split('=');
        const key = parts[0].toLowerCase();
        if (parts.length !== 2) {
            throw new error_1.TcbError(`参数 ${arg} 异常，必需为 key=val 形式`);
        }
        const val = parts[1];
        const source = parsed[key];
        if (!source) {
            parsed[key] = val;
        }
        else if (Array.isArray(source)) {
            parsed[key].push(val);
        }
        else {
            parsed[key] = [parsed[key], val];
        }
    });
    return parsed;
}
exports.parseCommandArgs = parseCommandArgs;
async function resolveTcbrcConfig() {
    const tcbrcPath = path_1.default.join(process.cwd(), '.tcbrc.json');
    if (!fs_1.default.existsSync(tcbrcPath)) {
        return {};
    }
    const tcbrc = await Promise.resolve().then(() => __importStar(require(tcbrcPath)));
    if (!tcbrc.envId) {
        throw new error_1.TcbError('配置文件无效，配置文件必须包含含环境 Id');
    }
    return tcbrc;
}
exports.resolveTcbrcConfig = resolveTcbrcConfig;
async function getEnvId(envId) {
    const tcbrc = await resolveTcbrcConfig();
    const assignEnvId = tcbrc.envId || envId;
    if (!assignEnvId) {
        throw new error_1.TcbError('未识别到有效的环境 Id 变量，请在项目根目录进行操作或通过 envId 参数指定环境 Id');
    }
    return assignEnvId;
}
exports.getEnvId = getEnvId;
