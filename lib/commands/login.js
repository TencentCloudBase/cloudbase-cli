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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const inquirer_1 = __importDefault(require("inquirer"));
const auth_1 = require("../auth");
const env_1 = require("../env");
const error_1 = require("../error");
const utils_1 = require("../utils");
const logger_1 = require("../logger");
commander_1.default
    .command('login')
    .option('-k, --key', '使用永久密钥登录')
    .description('登录腾讯云账号')
    .action(function (options) {
    return __awaiter(this, void 0, void 0, function* () {
        const loading = utils_1.loadingFactory();
        loading.start('检验登录状态');
        const hasLogin = yield utils_1.checkAndGetCredential();
        if (hasLogin) {
            loading.succeed('您已登录，无需再次登录！');
            return;
        }
        else {
            loading.stop();
        }
        if (options.key) {
            const { secretId } = yield inquirer_1.default.prompt({
                type: 'input',
                name: 'secretId',
                message: '请输入腾讯云 SecretID：'
            });
            const { secretKey } = yield inquirer_1.default.prompt({
                type: 'input',
                name: 'secretKey',
                message: '请输入腾讯云 SecretKey：'
            });
            if (!secretId || !secretKey) {
                throw new error_1.CloudBaseError('SecretID 或 SecretKey 不能为空');
            }
            loading.start('正在验证腾讯云密钥...');
            const res = yield auth_1.login({
                key: true,
                secretId,
                secretKey
            });
            if (res.code === 'SUCCESS') {
                loading.succeed('登录成功！');
            }
            else {
                loading.fail('腾讯云密钥验证失败，请检查密钥是否正确或终端网络是否可用！');
                return;
            }
        }
        else {
            loading.start('获取授权中...');
            const res = yield auth_1.login();
            if (res.code === 'SUCCESS') {
                loading.succeed('登录成功！');
            }
            else {
                loading.fail(res.msg);
                return;
            }
            return;
        }
        try {
            const envs = yield env_1.listEnvs();
            if (!envs.length) {
                logger_1.warnLog('您还没有可用的环境，请使用 cloudbase env:create $name 创建环境');
            }
        }
        catch (e) {
            if (e.code === 'ResourceNotFound.UserNotExists') {
                logger_1.errorLog('您还没有初始化云开发服务！');
            }
            else {
                throw e;
            }
        }
    });
});
