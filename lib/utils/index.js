"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
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
const auth_1 = require("../auth/auth");
const configstore_1 = require("./configstore");
const constant_1 = require("../constant");
const error_1 = require("../error");
var cli_table_1 = require("./cli-table");
exports.printCliTable = cli_table_1.printCliTable;
var uuid_1 = require("./uuid");
exports.guid6 = uuid_1.guid6;
__export(require("./request"));
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
    throw new error_1.CloudBaseError('无有效身份信息，请使用 cloudbase login 登录');
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
function getCloudBaseConfig() {
    return configstore_1.configStore.all();
}
exports.getCloudBaseConfig = getCloudBaseConfig;
async function resolveCloudBaseConfig() {
    const tcbrcPath = path_1.default.join(process.cwd(), 'tcbrc.json');
    if (fs_1.default.existsSync(tcbrcPath)) {
        throw new error_1.CloudBaseError('tcrbrc.josn 配置文件已废弃，请使用 cloudbaserc.json 或 cloudbaserc.js 配置文件！');
    }
    const cloudbaseJSONPath = path_1.default.join(process.cwd(), 'cloudbaserc.json');
    const cloudbaseJSPath = path_1.default.join(process.cwd(), 'cloudbaserc.js');
    const cloudbasePath = [cloudbaseJSPath, cloudbaseJSONPath].find(item => fs_1.default.existsSync(item));
    if (!cloudbasePath || !fs_1.default.existsSync(cloudbasePath)) {
        return {};
    }
    const cloudbaseConfig = await Promise.resolve().then(() => __importStar(require(cloudbasePath)));
    if (!cloudbaseConfig.envId) {
        throw new error_1.CloudBaseError('配置文件无效，配置文件必须包含含环境 Id');
    }
    return cloudbaseConfig;
}
exports.resolveCloudBaseConfig = resolveCloudBaseConfig;
async function getEnvId(envId) {
    const cloudbaseConfig = await resolveCloudBaseConfig();
    const assignEnvId = envId || cloudbaseConfig.envId;
    if (!assignEnvId) {
        throw new error_1.CloudBaseError('未识别到有效的环境 Id 变量，请在项目根目录进行操作或通过 envId 参数指定环境 Id');
    }
    return assignEnvId;
}
exports.getEnvId = getEnvId;
