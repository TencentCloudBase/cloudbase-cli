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
const enquirer_1 = require("enquirer");
const common_1 = require("../common");
const utils_1 = require("../../utils");
const decorators_1 = require("../../decorators");
const gateway_1 = require("../../gateway");
let DeleteServiceCommand = class DeleteServiceCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'service:delete',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-p, --service-path <servicePath>',
                    desc: 'Service Path，删除此 Path 对应的 HTTP Service'
                },
                {
                    flags: '-i, --service-id <serviceId>',
                    desc: 'Service Id，删除此 Id 对应的 HTTP Service'
                },
                {
                    flags: '-n, --name <name>',
                    desc: '云函数函数名称，删除此函数绑定的所有 HTTP Service'
                }
            ],
            desc: '删除 HTTP Service'
        };
    }
    execute(envId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let { servicePath, serviceId, name } = options;
            if (!servicePath && !serviceId && (!name || typeof name !== 'string')) {
                const { APISet: allServices } = yield gateway_1.queryGateway({
                    envId
                });
                const { selected } = yield enquirer_1.prompt({
                    type: 'select',
                    name: 'selected',
                    message: '请选择需要删除的 Service',
                    choices: allServices.map((item) => ({
                        name: `函数名：${item.Name}/路径：${item.Path}`,
                        value: item.APIId
                    })),
                    result(choices) {
                        return Object.values(this.map(choices));
                    }
                });
                serviceId = selected === null || selected === void 0 ? void 0 : selected[0];
            }
            const loading = utils_1.loadingFactory();
            loading.start('HTTP Service 删除中...');
            try {
                yield gateway_1.deleteGateway({
                    envId,
                    name,
                    path: servicePath,
                    gatewayId: serviceId
                });
                loading.succeed('HTTP Service 删除成功！');
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
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeleteServiceCommand.prototype, "execute", null);
DeleteServiceCommand = __decorate([
    common_1.ICommand()
], DeleteServiceCommand);
exports.DeleteServiceCommand = DeleteServiceCommand;
