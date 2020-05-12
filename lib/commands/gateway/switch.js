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
let ServiceSwitchCommand = class ServiceSwitchCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'service:switch',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '开启/关闭 HTTP Service 服务'
        };
    }
    execute(envId) {
        return __awaiter(this, void 0, void 0, function* () {
            const loading = utils_1.loadingFactory();
            loading.start('数据加载中...');
            const { EnableService } = yield gateway_1.getHttpServicePrivilege({ envId });
            const status = EnableService ? '已开启' : '已关闭';
            loading.stop();
            const { enable } = yield enquirer_1.prompt({
                type: 'select',
                name: 'enable',
                message: `开启/关闭 HTTP Service 服务（当前状态：${status}）`,
                choices: ['开启', '关闭']
            });
            try {
                loading.start(`HTTP Service 服务${enable}中`);
                yield gateway_1.switchHttpService({
                    envId,
                    enable: enable === '开启'
                });
                loading.succeed(`HTTP Service 服务${enable}成功！`);
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
    __param(0, decorators_1.EnvId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceSwitchCommand.prototype, "execute", null);
ServiceSwitchCommand = __decorate([
    common_1.ICommand()
], ServiceSwitchCommand);
exports.ServiceSwitchCommand = ServiceSwitchCommand;
let ServiceAuthSwitch = class ServiceAuthSwitch extends common_1.Command {
    get options() {
        return {
            cmd: 'service:auth:switch',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '开启/关闭 HTTP Service 服务访问鉴权'
        };
    }
    execute(envId) {
        return __awaiter(this, void 0, void 0, function* () {
            const loading = utils_1.loadingFactory();
            loading.start('数据加载中...');
            const { EnableAuth } = yield gateway_1.getHttpServicePrivilege({ envId });
            const status = EnableAuth ? '已开启' : '已关闭';
            loading.stop();
            const { enable } = yield enquirer_1.prompt({
                type: 'select',
                name: 'enable',
                message: `开启/关闭 HTTP Service 服务访问鉴权（当前状态：${status}）`,
                choices: ['开启', '关闭']
            });
            try {
                loading.start(`HTTP Service 服务访问鉴权${enable}中`);
                yield gateway_1.switchHttpServiceAuth({
                    envId,
                    enable: enable === '开启'
                });
                loading.succeed(`HTTP Service 服务访问鉴权${enable}成功！`);
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
    __param(0, decorators_1.EnvId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceAuthSwitch.prototype, "execute", null);
ServiceAuthSwitch = __decorate([
    common_1.ICommand()
], ServiceAuthSwitch);
exports.ServiceAuthSwitch = ServiceAuthSwitch;
