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
const error_1 = require("../../error");
const common_1 = require("../common");
const utils_1 = require("../../utils");
const decorators_1 = require("../../decorators");
const env_1 = require("../../env");
let ListAuthDoaminCommand = class ListAuthDoaminCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'env:domain:list',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '列出环境的安全域名列表'
        };
    }
    execute(envId) {
        return __awaiter(this, void 0, void 0, function* () {
            const domains = yield env_1.getEnvAuthDomains({
                envId: envId
            });
            if (domains.length === 0) {
                console.log('安全域名为空！');
                return;
            }
            const head = ['域名 Id', '域名', '创建时间', '状态'];
            const tableData = domains.map((item) => [
                item.Id,
                item.Domain,
                item.CreateTime,
                item.Status === 'ENABLE' ? '启用中' : '禁用中'
            ]);
            utils_1.printHorizontalTable(head, tableData);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListAuthDoaminCommand.prototype, "execute", null);
ListAuthDoaminCommand = __decorate([
    common_1.ICommand()
], ListAuthDoaminCommand);
exports.ListAuthDoaminCommand = ListAuthDoaminCommand;
let CreateAuthDomainCommand = class CreateAuthDomainCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'env:domain:create <domain>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '添加环境安全域名，多个以斜杠 / 分隔'
        };
    }
    execute(params, envId, log) {
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose(params);
            const domain = params === null || params === void 0 ? void 0 : params[0];
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
            envDomains = envDomains.map((item) => item.Domain);
            const exitDomains = [];
            domains.forEach((item) => {
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
            log.success('添加安全域名成功！');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.ArgsParams()), __param(1, decorators_1.EnvId()), __param(2, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], CreateAuthDomainCommand.prototype, "execute", null);
CreateAuthDomainCommand = __decorate([
    common_1.ICommand()
], CreateAuthDomainCommand);
exports.CreateAuthDomainCommand = CreateAuthDomainCommand;
let DeleteAuthDomainCommand = class DeleteAuthDomainCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'env:domain:delete',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '删除环境的安全域名'
        };
    }
    execute(envId, log) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const domainList = domains.map((item) => item.Domain);
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
                .filter((item) => selectDomains.includes(item.Domain))
                .map((item) => item.Id);
            const deleted = yield env_1.deleteEnvDomain({
                domainIds,
                envId
            });
            log.success(`成功删除了 ${deleted} 个域名！`);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], DeleteAuthDomainCommand.prototype, "execute", null);
DeleteAuthDomainCommand = __decorate([
    common_1.ICommand()
], DeleteAuthDomainCommand);
exports.DeleteAuthDomainCommand = DeleteAuthDomainCommand;
