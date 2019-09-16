"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("../../utils");
const logger_1 = require("../../logger");
const env_1 = require("../../env");
commander_1.default
    .command('env:login:list [envId]')
    .description('列出环境登录配置')
    .action(async function (envId, options) {
    const { configFile } = options.parent;
    const assignEnvId = await utils_1.getEnvId(envId, configFile);
    const configList = await env_1.getLoginConfigList({
        envId: assignEnvId
    });
    const platformMap = {
        'WECHAT-OPEN': '微信开放平台',
        'WECHAT-PUBLIC': '微信公众平台'
    };
    const head = ['Id', 'Platform', 'CreateTime', 'Status'];
    const tableData = configList.map(item => [
        item.Id,
        platformMap[item.Platform]
            ? platformMap[item.Platform]
            : item.Platform,
        item.CreateTime,
        item.Status === 'ENABLE' ? '启用' : '禁用中'
    ]);
    utils_1.printCliTable(head, tableData);
});
commander_1.default
    .command('env:login:config [envId]')
    .description('配置环境登录方式')
    .action(async function (envId, options) {
    const { configFile } = options.parent;
    const assignEnvId = await utils_1.getEnvId(envId, configFile);
    const configList = await env_1.getLoginConfigList({
        envId: assignEnvId
    });
    const { type, status } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'type',
            choices: ['微信公众平台', '微信开放平台'],
            message: '请选择登录方式：',
            default: '微信公众平台'
        },
        {
            type: 'list',
            name: 'status',
            choices: ['启用', '禁用'],
            message: '请选择登录方式状态：',
            default: '启用'
        }
    ]);
    const platformMap = {
        微信开放平台: 'WECHAT-OPEN',
        微信公众平台: 'WECHAT-PUBLIC'
    };
    const platform = platformMap[type];
    const item = configList.find(item => item.Platform === platform);
    if (status === '禁用' && item) {
        await env_1.updateLoginConfig({
            status: status === '启用' ? 'ENABLE' : 'DISABLE',
            configId: item.Id,
            envId: assignEnvId
        });
        logger_1.successLog(`${type} 登录方式禁用成功！`);
        return;
    }
    const { appId, appSecret } = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'appId',
            message: '请输入 AppId（配置状态时可不填）：'
        },
        {
            type: 'input',
            name: 'appSecret',
            message: '请输入 AppSecret（配置状态时可不填）：'
        }
    ]);
    if (item && item.Id) {
        await env_1.updateLoginConfig({
            envId: assignEnvId,
            configId: item.Id,
            appId,
            appSecret
        });
    }
    else {
        await env_1.createLoginConfig({
            envId: assignEnvId,
            appId,
            appSecret,
            platform
        });
    }
    logger_1.successLog('配置环境登录方式成功！');
});
