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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const archiver_1 = __importDefault(require("archiver"));
const readline_1 = __importDefault(require("readline"));
const store_1 = require("./store");
const constant_1 = require("../constant");
var cli_table_1 = require("./cli-table");
exports.printHorizontalTable = cli_table_1.printHorizontalTable;
__export(require("./uuid"));
__export(require("./qcloud-request"));
__export(require("./http-request"));
__export(require("./output"));
__export(require("./function-packer"));
__export(require("./store"));
__export(require("./cloudbase-config"));
__export(require("./auth"));
__export(require("./check-auth"));
__export(require("./os-release"));
__export(require("./time"));
__export(require("./cloud-api-request"));
__export(require("./fs"));
__export(require("./proxy"));
__export(require("./object"));
__export(require("./config"));
__export(require("./progress-bar"));
__export(require("./manager-service"));
function zipDir(dirPath, outputPath, ignore) {
    return __awaiter(this, void 0, void 0, function* () {
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
            archive.glob('**/*', {
                cwd: dirPath,
                ignore: ignore,
                dot: true
            });
            archive.finalize();
        });
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
function getSSHConfig() {
    return (store_1.authStore.get(constant_1.ConfigItems.ssh) || {});
}
exports.getSSHConfig = getSSHConfig;
function getSSH() {
    return __awaiter(this, void 0, void 0, function* () {
        let sshConfig = getSSHConfig();
        if (!sshConfig.host ||
            !sshConfig.port ||
            !sshConfig.username ||
            !sshConfig.password) {
            let { host, port = '22', username = 'root', password } = sshConfig;
            host =
                (yield askForInput(`请输入服务器 host${host ? `(${host})` : ''}:`)) || host;
            port = (yield askForInput(`请输入服务器 ssh 端口(${port}):`)) || port;
            username = (yield askForInput(`请输入用户名(${username}):`)) || username;
            password = yield askForInput(`请输入登录密码${password ? `(${password})` : ''}:`);
            let config = {
                host,
                port,
                username,
                password
            };
            store_1.authStore.set(constant_1.ConfigItems.ssh, config);
            return config;
        }
        return sshConfig;
    });
}
exports.getSSH = getSSH;
