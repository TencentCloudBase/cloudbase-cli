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
const inquirer_1 = __importDefault(require("inquirer"));
const env_1 = require("../../env");
const utils_1 = require("../../utils");
const error_1 = require("../../error");
const common_1 = require("../common");
const decorators_1 = require("../../decorators");
let CreateCommand = class CreateCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'env:create <alias>',
            options: [],
            desc: '创建云开发免费环境',
            requiredEnvId: false
        };
    }
    execute(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const alias = params === null || params === void 0 ? void 0 : params[0];
            if (!alias) {
                throw new error_1.CloudBaseError('环境名称不能为空！');
            }
            const loading = utils_1.loadingFactory();
            loading.start('检查中...');
            const { CurrentFreeEnvNum, MaxFreeEnvNum, CurrentEnvNum, MaxEnvNum } = yield env_1.getEnvLimit();
            loading.stop();
            if (+CurrentFreeEnvNum >= +MaxFreeEnvNum) {
                const link = utils_1.genClickableLink('https://console.cloud.tencent.com/tcb');
                throw new error_1.CloudBaseError(`免费环境数量已达上限，无法创建免费的环境，请到云开发-控制台中创建付费环境\n👉 ${link}`);
            }
            if (+CurrentEnvNum >= +MaxEnvNum) {
                throw new error_1.CloudBaseError('环境数量已达上限，无法创建新的环境！');
            }
            const { payment } = yield inquirer_1.default.prompt({
                type: 'list',
                name: 'payment',
                choices: [
                    {
                        name: '按量计费（免费配额）',
                        value: 'postpay'
                    },
                    {
                        name: '包年包月（免费版本）',
                        value: 'prepay'
                    }
                ],
                message: '请选择环境计费模式：',
                default: 'postpay'
            });
            const { confirm } = yield inquirer_1.default.prompt({
                type: 'confirm',
                name: 'confirm',
                message: '因支付权限问题，仅支持通过 API 秘钥登陆的主账户使用 CLI 创建包年包月免费环境，其他用户需要登陆控制台支付相关订单才能完成环境创建，是否继续？',
                default: false
            });
            if (!confirm) {
                throw new error_1.CloudBaseError('创建环境流程终止');
            }
            loading.start('环境创建中...');
            try {
                const res = yield env_1.createEnv({
                    alias,
                    paymentMode: payment
                });
            }
            catch (e) {
                if (e.code === 'ResourceInsufficient') {
                    throw new error_1.CloudBaseError('环境数量已达上限，无法创建新的环境！');
                }
                throw e;
            }
            loading.succeed('创建环境成功，初始化预计需要花费 3 分钟');
            console.log('你可以使用 cloudbase init 创建云开发项目');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreateCommand.prototype, "execute", null);
CreateCommand = __decorate([
    common_1.ICommand()
], CreateCommand);
exports.CreateCommand = CreateCommand;
