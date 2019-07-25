"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const archiver = require("archiver");
const fs = require("fs");
const readline = require("readline");
const tencentcloud = require("tencentcloud-sdk-nodejs");
const ini = require("ini");
const logger_1 = require("./logger");
const constant_1 = require("./constant");
const auth_1 = require("./auth");
const logger = new logger_1.default('Auth');
async function zipDir(dirPath, outputPath) {
    console.log(dirPath, outputPath);
    return new Promise((resolve, reject) => {
        var output = fs.createWriteStream(outputPath);
        var archive = archiver('zip');
        output.on('close', function () {
            // console.log(archive.pointer() + ' total bytes');
            // console.log('archiver has been finalized and the output file descriptor has closed.');
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
    const rl = readline.createInterface({
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
    const CvmClient = tencentcloud.cvm.v20170312.Client;
    const models = tencentcloud.cvm.v20170312.Models;
    const Credential = tencentcloud.common.Credential;
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
// 获取身份认证信息并校验、自动刷新
async function getMetadata() {
    const isTcbrcExit = fs.existsSync(constant_1.TCBRC);
    // 没有登录信息
    if (!isTcbrcExit) {
        logger.error('您还没有登录，请使用 tcb login 登录');
        return {};
    }
    const tcbrc = ini.parse(fs.readFileSync(constant_1.TCBRC, 'utf-8'));
    // 存在永久密钥
    if (tcbrc.secretId && tcbrc.secretKey) {
        return tcbrc;
    }
    // 存在临时密钥信息
    if (tcbrc.refreshToken) {
        // 临时密钥在 2 小时有效期内，可以直接使用
        if (Date.now() < tcbrc.tmpExpired) {
            const { tmpSecretId, tmpSecretKey, tmpToken } = tcbrc;
            return {
                secretId: tmpSecretId,
                secretKey: tmpSecretKey,
                token: tmpToken
            };
        }
        else if (Date.now() < tcbrc.expired) {
            // 临时密钥超过两小时有效期，但在 1 个月 refresh 有效期内，刷新临时密钥
            const credential = await auth_1.refreshTmpToken(tcbrc);
            fs.writeFileSync(constant_1.TCBRC, ini.stringify(credential));
            const { tmpSecretId, tmpSecretKey, tmpToken } = credential;
            return {
                secretId: tmpSecretId,
                secretKey: tmpSecretKey,
                token: tmpToken
            };
        }
    }
    // 无有效身份信息，提示登录
    logger.error('无有效身份信息，请使用 tcb login 登录');
    return {};
}
exports.getMetadata = getMetadata;
