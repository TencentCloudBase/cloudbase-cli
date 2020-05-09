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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const error_1 = require("../../error");
const utils_1 = require("../../utils");
const decorators_1 = require("../../decorators");
const gateway_1 = require("../../gateway");
const SERVICE_STATUS_MAP = {
    1: '部署中',
    2: '部署失败',
    3: '部署成功',
    4: '删除中',
    5: '删除失败'
};
class BindCustomDomainCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'service:domain:bind <domain>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '绑定自定义 HTTP Service 域名'
        };
    }
    execute(envId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = params === null || params === void 0 ? void 0 : params[0];
            console.log(domain);
            if (!domain) {
                throw new error_1.CloudBaseError('请指定需要绑定的 HTTP Service 域名！');
            }
            const loading = utils_1.loadingFactory();
            loading.start(`HTTP Service 域名 [${domain}] 绑定中...`);
            try {
                yield gateway_1.bindGatewayDomain({
                    envId,
                    domain
                });
                loading.succeed(`HTTP Service 域名[${domain}] 绑定成功！`);
            }
            catch (e) {
                loading.stop();
                throw e;
            }
        });
    }
}
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BindCustomDomainCommand.prototype, "execute", null);
exports.BindCustomDomainCommand = BindCustomDomainCommand;
let GetCustomDomainsCommand = class GetCustomDomainsCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'service:domain:list',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-d, --domain <domain>',
                    desc: '域名'
                }
            ],
            desc: '查询自定义 HTTP Service 域名'
        };
    }
    execute(envId, options, log) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { domain: domainName } = options;
            if (!envId && !domainName) {
                throw new error_1.CloudBaseError('请指定需要查询的环境 ID 或 HTTP Service 域名！');
            }
            const loading = utils_1.loadingFactory();
            loading.start('查询 HTTP Service 域名中...');
            try {
                const res = yield gateway_1.queryGatewayDomain({
                    envId,
                    domain: domainName
                });
                loading.succeed('查询 HTTP Service 域名成功！');
                if (!((_a = res === null || res === void 0 ? void 0 : res.ServiceSet) === null || _a === void 0 ? void 0 : _a.length)) {
                    log.info('HTTP Service 域名为空！');
                    return;
                }
                const head = ['域名', '状态', '创建时间'];
                const tableData = res.ServiceSet.map((item) => [
                    item.Domain,
                    SERVICE_STATUS_MAP[item.Status],
                    utils_1.formatDate(item.OpenTime * 1000, 'yyyy-MM-dd hh:mm:ss')
                ]);
                utils_1.printHorizontalTable(head, tableData);
            }
            catch (e) {
                loading.stop();
                throw e;
            }
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()), __param(2, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], GetCustomDomainsCommand.prototype, "execute", null);
GetCustomDomainsCommand = __decorate([
    common_1.ICommand()
], GetCustomDomainsCommand);
exports.GetCustomDomainsCommand = GetCustomDomainsCommand;
let UnbindCustomDomainCommand = class UnbindCustomDomainCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'service:domain:unbind <domain>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '解绑自定义 HTTP Service 域名'
        };
    }
    execute(envId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = params === null || params === void 0 ? void 0 : params[0];
            if (!domain) {
                throw new error_1.CloudBaseError('请指定需要解绑的 HTTP Service 域名！');
            }
            const loading = utils_1.loadingFactory();
            loading.start(`HTTP Service域名 [${domain}] 解绑中...`);
            try {
                yield gateway_1.unbindGatewayDomain({
                    envId,
                    domain
                });
                loading.succeed(`HTTP Service域名 [${domain}] 解绑成功！`);
            }
            catch (e) {
                loading.stop();
                throw e;
            }
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UnbindCustomDomainCommand.prototype, "execute", null);
UnbindCustomDomainCommand = __decorate([
    common_1.ICommand()
], UnbindCustomDomainCommand);
exports.UnbindCustomDomainCommand = UnbindCustomDomainCommand;
