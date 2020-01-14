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
const env_1 = require("../../env");
const utils_1 = require("../../utils");
const error_1 = require("../../error");
commander_1.default
    .command('env:create <alias>')
    .description('创建云开发免费环境')
    .action(function (alias) {
    return __awaiter(this, void 0, void 0, function* () {
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
                    name: '按量计费',
                    value: 'postpay'
                },
                {
                    name: '包年包月',
                    value: 'prepay'
                }
            ],
            message: '请选择环境计费模式：',
            default: 'postpay'
        });
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
        loading.succeed('创建环境成功，初始化预计需要花费 3 分钟！');
    });
});
