"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const ora_1 = __importDefault(require("ora"));
const env_1 = require("../env");
const utils_1 = require("../utils");
const error_1 = require("../error");
const logger_1 = require("../logger");
commander_1.default
    .command('env:list')
    .description('列出云开发所有环境')
    .action(async function () {
    const data = await env_1.listEnvs();
    const head = [
        'EnvId',
        'Alias',
        'PackageName',
        'Source',
        'CreateTime',
        'Status'
    ];
    const tableData = data.map(item => [
        item.EnvId,
        item.Alias,
        item.PackageName,
        item.Source === 'miniapp' ? '小程序' : '云开发',
        item.CreateTime,
        item.Status === 'NORMAL' ? '正常' : '不可用'
    ]);
    utils_1.printCliTable(head, tableData);
    const unavalibleEnv = data.find(item => item.Status === 'UNAVAILABLE');
    if (unavalibleEnv) {
        logger_1.warnLog(`您的环境中存在不可用的环境：[${unavalibleEnv.EnvId}]，请留意！`);
    }
});
async function checkEnvAvailability(envId) {
    const MAX_TRY = 10;
    let retry = 0;
    return new Promise((resolve, reject) => {
        const timer = setInterval(async () => {
            const envInfo = await env_1.getEnvInfo(envId);
            if (envInfo.Status === 'NORMAL') {
                clearInterval(timer);
                resolve();
            }
            else {
                retry++;
            }
            if (retry > MAX_TRY) {
                reject(new error_1.TcbError('环境初始化查询超时，请稍后通过 cloudbase env:list 查看环境状态'));
            }
        }, 1000);
    });
}
commander_1.default
    .command('env:create <alias>')
    .description('创建新的云环境')
    .action(async function (alias) {
    if (!alias) {
        throw new error_1.TcbError('环境名称不能为空！');
    }
    const res = await env_1.createEnv({
        alias
    });
    if (res.Status === 'NORMAL') {
        logger_1.successLog('创建环境成功！');
        return;
    }
    const initSpinner = ora_1.default('环境初始化中...').start();
    try {
        await checkEnvAvailability(res.EnvId);
        initSpinner.succeed('环境初始化成功');
    }
    catch (e) {
        initSpinner.fail(e.message);
    }
});
