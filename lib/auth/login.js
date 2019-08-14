"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tencentcloud_sdk_nodejs_1 = __importDefault(require("../../deps/tencentcloud-sdk-nodejs"));
const ora_1 = __importDefault(require("ora"));
const logger_1 = __importDefault(require("../logger"));
const auth_1 = require("./auth");
const utils_1 = require("../utils");
const constant_1 = require("../constant");
const configstore_1 = require("../utils/configstore");
const error_1 = require("../error");
const logger = new logger_1.default('Login');
async function checkAuth(credential) {
    const { tmpSecretId, tmpSecretKey, tmpToken } = credential;
    const ScfClient = tencentcloud_sdk_nodejs_1.default.scf.v20180416.Client;
    const models = tencentcloud_sdk_nodejs_1.default.scf.v20180416.Models;
    const Credential = tencentcloud_sdk_nodejs_1.default.common.Credential;
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
async function authLogin() {
    const tcbrc = utils_1.getCredentialConfig();
    if (tcbrc.secretId && tcbrc.secretKey) {
        logger.log('您已登录，无需再次登录！');
        return;
    }
    const tmpExpired = Number(tcbrc.tmpExpired) || 0;
    let refreshExpired = Number(tcbrc.expired) || 0;
    const now = Date.now();
    if (now < tmpExpired) {
        logger.log('您已登录，无需再次登录！');
        return;
    }
    let credential;
    const authSpinner = ora_1.default('获取授权中');
    try {
        if (now < refreshExpired) {
            authSpinner.start();
            credential = await auth_1.refreshTmpToken(tcbrc);
        }
        else {
            authSpinner.start();
            credential = await auth_1.getAuthTokenFromWeb();
        }
        authSpinner.succeed('获取授权成功');
    }
    catch (error) {
        authSpinner.fail(`获取授权失败 ${error}`);
        throw new error_1.TcbError(error);
    }
    if (!credential.refreshToken || !credential.uin) {
        logger.error('授权信息无效');
        return;
    }
    const scfCheckSpinner = ora_1.default('验证密匙权限').start();
    try {
        await checkAuth(credential);
        scfCheckSpinner.succeed('密钥权限验证成功');
    }
    catch (e) {
        throw new error_1.TcbError(e.message);
    }
    configstore_1.configStore.set(constant_1.ConfigItems.credentail, credential);
    logger.success('登录成功！');
}
exports.authLogin = authLogin;
async function login() {
    const tcbrc = await utils_1.getCredentialConfig();
    if (tcbrc.secretId && tcbrc.secretKey) {
        logger.log('您已登录，无需再次登录！');
        return;
    }
    const secretId = (await utils_1.askForInput('请输入腾讯云 SecretID：'));
    const secretKey = (await utils_1.askForInput('请输入腾讯云 SecretKey：'));
    if (!secretId || !secretKey) {
        logger.error('SecretID 或 SecretKey 不能为空');
        return;
    }
    const cloudSpinner = ora_1.default('正在验证腾讯云密钥...').start();
    try {
        await checkAuth({ tmpSecretId: secretId, tmpSecretKey: secretKey });
        cloudSpinner.succeed('腾讯云密钥验证成功');
    }
    catch (e) {
        cloudSpinner.fail('腾讯云密钥验证失败，请检查密钥是否正确或本机网络代理有问题');
        return;
    }
    configstore_1.configStore.set(constant_1.ConfigItems.credentail, { secretId, secretKey });
    logger.success('登录成功！');
}
exports.login = login;
