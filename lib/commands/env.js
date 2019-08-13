"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const env_1 = require("../env");
const utils_1 = require("../utils");
const error_1 = require("../error");
const logger_1 = require("../logger");
commander_1.default
    .command('env:list')
    .description('列出云开发所有环境')
    .action(async function () {
    const data = await env_1.listEnvs();
    const head = ['EnvId', 'PackageName', 'Source', 'CreateTime'];
    const tableData = data.map(item => [
        item.envId,
        item.packageName,
        item.source,
        item.createTime
    ]);
    utils_1.printCliTable(head, tableData);
});
commander_1.default
    .command('env:create <alias> <envId>')
    .description('创建新的云环境')
    .action(async function (alias, envId) {
    if (!alias || !envId) {
        throw new error_1.TcbError('环境名称或环境 Id 不能为空！');
    }
    await env_1.createEnv(alias, envId);
    logger_1.successLog('创建环境成功！');
});
