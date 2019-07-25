"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const ini = require("ini");
const tencentcloud = require("tencentcloud-sdk-nodejs");
const ora = require("ora");
const logger_1 = require("./logger");
const auth_1 = require("./auth");
const utils_1 = require("./utils");
const constant_1 = require("./constant");
const logger = new logger_1.default('Auth');
// 调用 SCF 接口，检查密钥是否有效
async function scfCheck(credential) {
    const { tmpSecretId, tmpSecretKey, tmpToken } = credential;
    const ScfClient = tencentcloud.scf.v20180416.Client;
    const models = tencentcloud.scf.v20180416.Models;
    const Credential = tencentcloud.common.Credential;
    let cred = new Credential(tmpSecretId, tmpSecretKey, tmpToken);
    let client = new ScfClient(cred, 'ap-shanghai');
    let req = new models.ListFunctionsRequest();
    return new Promise((resolve, reject) => {
        client.ListFunctions(req, (err, response) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(response);
        });
    });
}
// 打开腾讯云 TCB 控制台，通过获取临时密钥登录，临时密钥可续期，最长时间为 1 个月
async function authLogin() {
    const tcbrc = auth_1.getAuthData();
    // 已有永久密钥
    if (tcbrc.secretId && tcbrc.secretKey) {
        logger.log('您已通过 secretKey 登录，无需再次登录！');
        return;
    }
    const tmpExpired = Number(tcbrc.tmpExpired) || 0;
    let refreshExpired = Number(tcbrc.expired) || 0;
    const now = Date.now();
    if (now < tmpExpired) {
        logger.log('您已经登录且身份有效，无需再次登录！');
        return;
    }
    let credential;
    const authSpinner = ora('获取授权中');
    try {
        if (now < refreshExpired) {
            // 临时 token 过期，自动续期
            authSpinner.start();
            credential = await auth_1.refreshTmpToken(tcbrc);
        }
        else {
            authSpinner.start();
            credential = await auth_1.auth();
        }
        authSpinner.succeed('获取授权成功');
    }
    catch (error) {
        console.log(error);
        authSpinner.fail(`获取授权失败 ${error}`);
        return;
    }
    if (!credential.refreshToken || !credential.uin) {
        logger.error('授权信息无效');
        return;
    }
    const scfCheckSpinner = ora('验证密匙权限').start();
    try {
        await scfCheck(credential);
        scfCheckSpinner.succeed('密钥权限验证成功');
    }
    catch (e) {
        scfCheckSpinner.fail('密钥验证失败，请检查密钥是否正确或本机网络代理有问题');
        return;
    }
    fs.writeFileSync(constant_1.TCBRC, ini.stringify(credential));
    logger.success('登录成功！');
}
exports.authLogin = authLogin;
// 使用永久密钥登录
async function login() {
    const tcbrc = auth_1.getAuthData();
    // 已有永久密钥
    if (tcbrc.secretId && tcbrc.secretKey) {
        logger.log('您已通过 secretKey 登录，无需再次登录！');
        return;
    }
    // 存在临时密钥，通过临时密钥登录
    if (tcbrc.refreshToken && tcbrc.uin) {
        logger.log('检查到您已获取腾讯云授权，正在尝试通过授权登录');
        authLogin();
        return;
    }
    const secretId = await utils_1.askForInput('请输入腾讯云 SecretID：');
    const secretKey = await utils_1.askForInput('请输入腾讯云 SecretKey：');
    if (!secretId || !secretKey) {
        logger.error('SecretID 或 SecretKey 不能为空');
        return;
    }
    const cloudSpinner = ora('正在验证腾讯云密钥...').start();
    try {
        await scfCheck({
            tmpSecretId: secretId,
            tmpSecretKey: secretKey
        });
        cloudSpinner.succeed('腾讯云密钥验证成功');
    }
    catch (e) {
        cloudSpinner.fail('腾讯云密钥验证失败，请检查密钥是否正确或本机网络代理有问题');
        return;
    }
    fs.writeFileSync(constant_1.TCBRC, ini.stringify({ secretId, secretKey }));
    logger.success('登录成功！');
}
exports.login = login;
async function logout() {
    const exist = fs.existsSync(constant_1.TCBRC);
    if (exist) {
        await fs.unlinkSync(constant_1.TCBRC);
    }
    logger.success('注销登录成功！');
}
exports.logout = logout;
