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
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("../../utils");
const error_1 = require("../../error");
const logger_1 = require("../../logger");
const env_1 = require("../../env");
function listAuthDoamin(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const domains = yield env_1.getEnvAuthDomains({
            envId: ctx.envId
        });
        if (domains.length === 0) {
            console.log('安全域名为空！');
            return;
        }
        const head = ['域名 Id', '域名', '创建时间', '状态'];
        const tableData = domains.map(item => [
            item.Id,
            item.Domain,
            item.CreateTime,
            item.Status === 'ENABLE' ? '启用中' : '禁用中'
        ]);
        utils_1.printHorizontalTable(head, tableData);
    });
}
exports.listAuthDoamin = listAuthDoamin;
function createAuthDomain(ctx, domain) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId } = ctx;
        const domains = domain.split('/');
        const { confirm } = yield inquirer_1.default.prompt({
            type: 'confirm',
            name: 'confirm',
            message: `确认添加以下安全域名： ${domains} ？`,
            default: true
        });
        if (!confirm) {
            throw new error_1.CloudBaseError('操作终止！');
        }
        let envDomains = yield env_1.getEnvAuthDomains({
            envId
        });
        envDomains = envDomains.map(item => item.Domain);
        const exitDomains = [];
        domains.forEach(item => {
            if (envDomains.includes(item)) {
                exitDomains.push(item);
            }
        });
        if (exitDomains.length) {
            throw new error_1.CloudBaseError(`域名 [${exitDomains.join(', ')}] 已存在！`);
        }
        yield env_1.createEnvDomain({
            envId,
            domains: domains
        });
        logger_1.successLog('添加安全域名成功！');
    });
}
exports.createAuthDomain = createAuthDomain;
function deleteAuthDomain(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId } = ctx;
        const loading = utils_1.loadingFactory();
        loading.start('拉取环境安全域名中');
        const domains = yield env_1.getEnvAuthDomains({
            envId
        });
        if (domains.length === 0) {
            loading.fail('域名安全为空，不能执行删除操作！');
            return;
        }
        loading.succeed('拉取环境安全域名成功！');
        const domainList = domains.map(item => item.Domain);
        const { selectDomains } = yield inquirer_1.default.prompt({
            type: 'checkbox',
            name: 'selectDomains',
            message: '请选择需要删除的域名（可多选）>',
            choices: domainList,
            default: true
        });
        const { confirm } = yield inquirer_1.default.prompt({
            type: 'confirm',
            name: 'confirm',
            message: `确认删除以下安全域名： ${selectDomains} ？`,
            default: true
        });
        if (!confirm) {
            throw new error_1.CloudBaseError('操作终止！');
        }
        const domainIds = domains
            .filter(item => selectDomains.includes(item.Domain))
            .map(item => item.Id);
        const deleted = yield env_1.deleteEnvDomain({
            domainIds,
            envId
        });
        logger_1.successLog(`成功删除了 ${deleted} 个域名！`);
    });
}
exports.deleteAuthDomain = deleteAuthDomain;
