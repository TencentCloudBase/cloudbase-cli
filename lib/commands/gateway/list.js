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
const gateway_1 = require("../../gateway");
const decorators_1 = require("../../decorators");
const utils_1 = require("../../utils");
let ListServiceCommand = class ListServiceCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'service:list',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-d, --domain <domain>',
                    desc: '自定义域名'
                },
                {
                    flags: '-p, --service-path <servicePath>',
                    desc: 'Service Path'
                },
                {
                    flags: '-id, --service-id <serviceId>',
                    desc: 'Service Id'
                }
            ],
            desc: '获取 HTTP Service 列表'
        };
    }
    execute(envId, options, log) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { domain: domainName, servicePath, serviceId } = options;
            if (!envId && !domainName) {
                throw new error_1.CloudBaseError('请指定需要查询的环境 ID 或 HTTP Service 自定义域名！');
            }
            const loading = utils_1.loadingFactory();
            loading.start('查询 HTTP Service 中...');
            try {
                const res = yield gateway_1.queryGateway({
                    envId,
                    domain: domainName,
                    path: servicePath,
                    gatewayId: serviceId
                });
                loading.stop();
                if (((_a = res === null || res === void 0 ? void 0 : res.APISet) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                    log.info('HTTP Service 为空');
                    return;
                }
                const head = ['Id', '路径', '函数名称', '创建时间'];
                const tableData = res.APISet.map((item) => [
                    item.APIId,
                    item.Path,
                    item.Name,
                    utils_1.formatDate(item.CreateTime * 1000, 'yyyy-MM-dd hh:mm:ss')
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
], ListServiceCommand.prototype, "execute", null);
ListServiceCommand = __decorate([
    common_1.ICommand()
], ListServiceCommand);
exports.ListServiceCommand = ListServiceCommand;
