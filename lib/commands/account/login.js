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
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const auth_1 = require("../../auth");
const env_1 = require("../../env");
const error_1 = require("../../error");
const logger_1 = require("../../logger");
const utils_1 = require("../../utils");
function printSuggestion() {
    const tips = `可使用下面命令继续操作：

${chalk_1.default.gray('–')} 创建免费环境

  ${chalk_1.default.cyan('$ cloudbase env:create envName')}

${chalk_1.default.gray('–')} 初始化云开发项目

  ${chalk_1.default.cyan('$ cloudbase init')}

${chalk_1.default.gray('–')} 部署云函数

  ${chalk_1.default.cyan('$ cloudbase functions:deploy')}

${chalk_1.default.gray('–')} 查看命令使用介绍

  ${chalk_1.default.cyan('$ cloudbase -h')}

Tips：可以使用简写命令 tcb 代替 cloudbase`;
    console.log(tips);
}
function askForCollectDataConfirm() {
    return __awaiter(this, void 0, void 0, function* () {
        const agree = yield utils_1.usageStore.get('agreeCollect');
        if (agree)
            return;
        const { confirm } = yield inquirer_1.default.prompt({
            type: 'confirm',
            name: 'confirm',
            message: '是否同意 Cloudbase CLI 收集您的使用数据以改进产品？',
            default: true
        });
        if (confirm) {
            yield utils_1.usageStore.set('agreeCollect', true);
        }
        yield utils_1.collectAgree(confirm);
    });
}
function handleLoginSuccess() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function accountLogin(ctx) {
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
        if (ctx.options.key) {
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
                yield askForCollectDataConfirm();
                printSuggestion();
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
                yield askForCollectDataConfirm();
                printSuggestion();
            }
            else {
                loading.fail(res.msg);
                console.log('请检查你的网络，尝试重新运行 cloudbase login 命令！');
                return;
            }
        }
        try {
            const envs = yield env_1.listEnvs();
            if (!envs.length) {
                logger_1.warnLog('您还没有可用的环境，请使用 cloudbase env:create $name 创建环境');
            }
        }
        catch (e) {
            if (e.code === 'ResourceNotFound.UserNotExists') {
                logger_1.errorLog('您还没有可用的环境，请使用 cloudbase env:create $name 创建环境！');
            }
            else {
                throw e;
            }
        }
    });
}
exports.accountLogin = accountLogin;
