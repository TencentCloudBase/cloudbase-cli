"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const lodash_1 = __importDefault(require("lodash"));
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const common_1 = require("../common");
const auth_1 = require("../../auth");
const env_1 = require("../../env");
const error_1 = require("../../error");
const decorators_1 = require("../../decorators");
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
let LoginCommand = class LoginCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'login',
            options: [
                {
                    flags: '-k, --key',
                    desc: '使用永久密钥登录'
                },
                {
                    flags: '--apiKeyId <apiKeyId>',
                    desc: '腾讯云 API 秘钥 Id'
                },
                {
                    flags: '--apiKey <apiKey>',
                    desc: '腾讯云 API 秘钥 Key'
                }
            ],
            desc: '登录腾讯云账号',
            requiredEnvId: false
        };
    }
    execute(options, log) {
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose(options);
            const { apiKeyId, apiKey } = options;
            const loading = utils_1.loadingFactory();
            loading.start('检验登录状态');
            const credential = yield utils_1.checkAndGetCredential();
            if (!lodash_1.default.isEmpty(credential)) {
                loading.succeed('您已登录，无需再次登录！');
                return;
            }
            else {
                loading.stop();
            }
            if (apiKey && apiKeyId) {
                loading.start('正在验证腾讯云密钥...');
                const res = yield auth_1.login({
                    key: true,
                    secretKey: apiKey,
                    secretId: apiKeyId
                });
                if (res.code === 'SUCCESS') {
                    loading.succeed('登录成功！');
                    printSuggestion();
                }
                else {
                    loading.fail('腾讯云密钥验证失败，请检查密钥是否正确或终端网络是否可用！');
                    return;
                }
            }
            else if (options.key) {
                const clickableLink = utils_1.genClickableLink('https://console.cloud.tencent.com/cam/capi');
                console.log(`您可以访问 ${clickableLink} 获取 API 秘钥`);
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
                    log.warn('您还没有可用的环境，请使用 cloudbase env:create $name 创建环境');
                }
            }
            catch (e) {
                if (e.code === 'ResourceNotFound.UserNotExists') {
                    log.error('您还没有可用的环境，请使用 cloudbase env:create $name 创建环境！');
                }
                else {
                    throw e;
                }
            }
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.ArgsOptions()), __param(1, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], LoginCommand.prototype, "execute", null);
LoginCommand = __decorate([
    common_1.ICommand()
], LoginCommand);
exports.LoginCommand = LoginCommand;
