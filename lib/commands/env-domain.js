"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const ora_1 = __importDefault(require("ora"));
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("../utils");
const error_1 = require("../error");
const logger_1 = require("../logger");
const env_1 = require("../env");
commander_1.default
    .command('env:domain:list [envId]')
    .description('列出环境的安全域名列表')
    .action(async function (envId) {
    const assignEnvId = await utils_1.getEnvId(envId);
    const domains = await env_1.getEnvAuthDomains({
        envId: assignEnvId
    });
    if (domains.length === 0) {
        console.log('安全域名为空！');
        return;
    }
    const head = ['Domain Id', 'Domain', 'CreateTime', 'Status'];
    const tableData = domains.map(item => [
        item.Id,
        item.Domain,
        item.CreateTime,
        item.Status === 'ENABLE' ? '启用中' : '禁用中'
    ]);
    utils_1.printCliTable(head, tableData);
});
commander_1.default
    .command('env:domain:create <domain> [envId]')
    .description('添加环境安全域名，多个以斜杠 / 分隔')
    .action(async function (domain, envId) {
    const assignEnvId = await utils_1.getEnvId(envId);
    const domains = domain.split('/');
    const { confirm } = await inquirer_1.default.prompt({
        type: 'confirm',
        name: 'confirm',
        message: `确认添加以下安全域名： ${domains} ？`,
        default: true
    });
    if (!confirm) {
        throw new error_1.TcbError('操作终止！');
    }
    let envDomains = await env_1.getEnvAuthDomains({
        envId: assignEnvId
    });
    envDomains = envDomains.map(item => item.Domain);
    const exitDomains = [];
    domains.forEach(item => {
        if (envDomains.includes(item)) {
            exitDomains.push(item);
        }
    });
    if (exitDomains.length) {
        throw new error_1.TcbError(`域名 [${exitDomains.join(', ')}] 已存在！`);
    }
    await env_1.createEnvDomain({
        envId: assignEnvId,
        domains: domains
    });
    logger_1.successLog('添加安全域名成功！');
});
commander_1.default
    .command('env:domain:delete [envId]')
    .description('删除环境的安全域名')
    .action(async function (envId) {
    const assignEnvId = await utils_1.getEnvId(envId);
    const loadSpinner = ora_1.default('拉取环境安全域名中...').start();
    const domains = await env_1.getEnvAuthDomains({
        envId: assignEnvId
    });
    if (domains.length === 0) {
        loadSpinner.fail('域名安全为空！');
        return;
    }
    loadSpinner.succeed('拉取环境安全域名成功！');
    const domainList = domains.map(item => item.Domain);
    const { selectDomains } = await inquirer_1.default.prompt({
        type: 'checkbox',
        name: 'selectDomains',
        message: '请选择需要删除的域名（可多选）>',
        choices: domainList,
        default: true
    });
    const { confirm } = await inquirer_1.default.prompt({
        type: 'confirm',
        name: 'confirm',
        message: `确认删除以下安全域名： ${selectDomains} ？`,
        default: true
    });
    if (!confirm) {
        throw new error_1.TcbError('操作终止！');
    }
    const domainIds = domains
        .filter(item => selectDomains.includes(item.Domain))
        .map(item => item.Id);
    const deleted = await env_1.deleteEnvDomain({
        domainIds,
        envId: assignEnvId,
    });
    logger_1.successLog(`成功删除了 ${deleted} 个域名！`);
});
