"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const auth_1 = require("../auth");
const env_1 = require("../env");
const error_1 = require("../error");
const utils_1 = require("../utils");
const logger_1 = require("../logger");
async function checkLogin() {
    const credential = utils_1.getCredentialConfig();
    if (credential.secretId && credential.secretKey) {
        return true;
    }
    if (credential.refreshToken) {
        if (Date.now() < Number(credential.tmpExpired)) {
            return true;
        }
        else if (Date.now() < Number(credential.expired)) {
            return true;
        }
    }
    return false;
}
commander_1.default
    .command('login')
    .option('-k, --key', '使用永久密钥登录')
    .option('--skey', '使用永久密钥 + skey 登录')
    .description('登录腾讯云账号')
    .action(async function (options) {
    const checkSpin = ora_1.default('检验登录状态').start();
    const hasLogin = await checkLogin();
    if (hasLogin) {
        checkSpin.succeed('您已登录，无需再次登录！');
        return;
    }
    else {
        checkSpin.stop();
    }
    let skey;
    if (options.key || options.skey) {
        const { secretId } = await inquirer_1.default.prompt({
            type: 'input',
            name: 'secretId',
            message: '请输入腾讯云 SecretID：'
        });
        const { secretKey } = await inquirer_1.default.prompt({
            type: 'input',
            name: 'secretKey',
            message: '请输入腾讯云 SecretKey：'
        });
        if (options.skey) {
            const { skey: _skey } = await inquirer_1.default.prompt({
                type: 'input',
                name: 'skey',
                message: '请输入腾讯云 skey（选填）：'
            });
            skey = _skey;
        }
        if (!secretId || !secretKey) {
            throw new error_1.CloudBaseError('SecretID 或 SecretKey 不能为空');
        }
        const cloudSpinner = ora_1.default('正在验证腾讯云密钥...').start();
        const res = await auth_1.login({
            key: true,
            secretId,
            secretKey
        });
        if (res.code === 'SUCCESS') {
            cloudSpinner.succeed('登录成功！');
        }
        else {
            cloudSpinner.fail('腾讯云密钥验证失败，请检查密钥是否正确或终端网络是否可用！');
            return;
        }
    }
    else {
        const authSpinner = ora_1.default('获取授权中！');
        const res = await auth_1.login();
        if (res.code === 'SUCCESS') {
            authSpinner.succeed('登录成功！');
        }
        else {
            authSpinner.fail(res.msg);
            return;
        }
    }
    try {
        const envs = await env_1.listEnvs();
        if (!envs.length) {
            logger_1.warnLog('你还没有可用的环境，请使用 cloudbase env:create alias 创建环境');
        }
    }
    catch (e) {
        if (e.code === 'ResourceNotFound.UserNotExists') {
            const initSpin = ora_1.default('初始化云开发服务').start();
            await env_1.initTcb(skey);
            initSpin.succeed('初始化成功！');
        }
        else {
            throw e;
        }
    }
});
