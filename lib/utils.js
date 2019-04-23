"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const archiver = require("archiver");
const fs = require("fs");
const readline = require("readline");
const tencentcloud = require("tencentcloud-sdk-nodejs");
const ini = require("ini");
const path = require("path");
const os = require("os");
const node_ssh = require("node-ssh");
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
const TCBRC = path.resolve(os.homedir(), '.tcbrc.json');
async function login() {
    const secretId = await askForInput('请输入腾讯云SecretID：');
    const secretKey = await askForInput('请输入腾讯云SecretKey：');
    try {
        await callCloudApi(secretId, secretKey);
    }
    catch (e) {
        if (e.code.indexOf('AuthFailure') !== -1) {
            throw new Error('登录失败，请检查密钥是否正确');
        }
        throw new Error(`登录失败：${e.code}`);
    }
    const host = await askForInput('请输入主机IP：');
    const password = await askForInput('请输入主机密码：');
    const ssh = new node_ssh();
    await ssh.connect({ host, username: 'root', port: 22, password });
    await ssh.dispose();
    fs.writeFileSync(TCBRC, ini.stringify({ secretId, secretKey, host, password }));
    return { secretId, secretKey, host, password };
}
exports.login = login;
async function logout() {
    await fs.unlinkSync(TCBRC);
}
exports.logout = logout;
async function getSecret() {
    if (fs.existsSync(TCBRC)) {
        const tcbrc = ini.parse(fs.readFileSync(TCBRC, 'utf-8'));
        if (!tcbrc.secretId || !tcbrc.secretKey) {
            // 缺少信息，重新登录
            return await login();
        }
        return { secretId: tcbrc.secretId, secretKey: tcbrc.secretKey };
    }
    else {
        // 没有登录过
        return await login();
    }
}
exports.getSecret = getSecret;
function askForInput(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
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
    let client = new CvmClient(cred, "ap-shanghai");
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
