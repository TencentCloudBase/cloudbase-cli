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
exports.DestroyStandalonegateway = void 0;
const common_1 = require("../../common");
const run_1 = require("../../../run");
const toolbox_1 = require("@cloudbase/toolbox");
const decorators_1 = require("../../../decorators");
const common_2 = require("./common");
const error_1 = require("../../../error");
let DestroyStandalonegateway = class DestroyStandalonegateway extends common_1.Command {
    get options() {
        return Object.assign(Object.assign({}, common_2.standalonegatewayCommonOptions('destroy')), { options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-a, --appId <appId>',
                    desc: '应用 Id'
                },
                {
                    flags: '-gN, --gatewayName <gatewayName>',
                    desc: '网关 name'
                }
            ], desc: '销毁小租户网关' });
    }
    execute(envId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let { appId = '', gatewayName = '' } = options;
            appId = String(appId);
            gatewayName = String(gatewayName);
            if (appId === '') {
                throw new error_1.CloudBaseError('请输入应用 Id');
            }
            if (gatewayName === '') {
                throw new error_1.CloudBaseError('请输入网关名称');
            }
            const loading = toolbox_1.loadingFactory();
            loading.start('数据加载中...');
            const data = yield run_1.destroyStandalonegateway({
                envId,
                appId: Number(appId),
                gatewayName
            });
            loading.stop();
            console.log('网关已销毁');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()),
    __param(1, decorators_1.ArgsOptions()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DestroyStandalonegateway.prototype, "execute", null);
DestroyStandalonegateway = __decorate([
    common_1.ICommand()
], DestroyStandalonegateway);
exports.DestroyStandalonegateway = DestroyStandalonegateway;
