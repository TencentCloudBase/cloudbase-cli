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
const ora = require("ora");
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
    const cloudSpinner = ora('正在验证腾讯云密钥...').start();
    try {
        await callCloudApi(secretId, secretKey);
        cloudSpinner.succeed('腾讯云密钥验证成功');
    }
    catch (e) {
        cloudSpinner.fail('腾讯云密钥验证失败');
        return;
    }
    const sshInfo = {
        host: await askForInput('请输入主机IP：'),
        password: await askForInput('请输入主机密码：'),
        username: await askForInput('请输入用户名：(root)') || 'root',
        port: await askForInput('请输入ssh端口号：(22)') || 22
    };
    const sshSpinner = ora('正在进行腾讯云主机登录验证...').start();
    try {
        const ssh = new node_ssh();
        await ssh.connect(sshInfo);
        await ssh.dispose();
        sshSpinner.succeed('腾讯云主机登录验证成功');
    }
    catch (error) {
        sshSpinner.fail('腾讯云主机登录验证失败');
        return;
    }
    fs.writeFileSync(TCBRC, ini.stringify(Object.assign({ secretId, secretKey }, sshInfo)));
    return Object.assign({ secretId, secretKey }, sshInfo);
}
exports.login = login;
async function logout() {
    await fs.unlinkSync(TCBRC);
}
exports.logout = logout;
async function getMetadata() {
    if (fs.existsSync(TCBRC)) {
        const tcbrc = ini.parse(fs.readFileSync(TCBRC, 'utf-8'));
        if (!tcbrc.secretId || !tcbrc.secretKey || !tcbrc.host || !tcbrc.password || !tcbrc.username || !tcbrc.port) {
            // 缺少信息，重新登录
            return await login();
        }
        return tcbrc;
    }
    else {
        // 没有登录过
        return await login();
    }
}
exports.getMetadata = getMetadata;
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
