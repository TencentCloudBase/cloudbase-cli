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
exports.ModifyVersion = void 0;
const enquirer_1 = require("enquirer");
const common_1 = require("../../common");
const error_1 = require("../../../error");
const run_1 = require("../../../run");
const utils_1 = require("../../../utils");
const decorators_1 = require("../../../decorators");
const common_2 = require("./common");
let ModifyVersion = class ModifyVersion extends common_1.Command {
    get options() {
        return Object.assign(Object.assign({}, common_2.versionCommonOptions('modify')), { options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '托管服务 name'
                }
            ], desc: '展示选择的云托管服务的版本列表' });
    }
    execute(envId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let { serviceName = '' } = options;
            if (serviceName.length === 0)
                throw new error_1.CloudBaseError('请填入有效云托管服务名');
            const versionFlowItems = [];
            const loading = utils_1.loadingFactory();
            while (true) {
                let versionName = yield utils_1.pagingSelectPromp('select', run_1.listVersion, { envId, serverName: serviceName }, '请选择版本', (item) => item.Status === 'normal', (item) => `${item.VersionName}|${item.Remark}`);
                versionName = versionName.split('|')[0];
                if (versionFlowItems.find(item => item.VersionName === versionName))
                    throw new error_1.CloudBaseError('已经选择过该version');
                let { flowRatio } = yield enquirer_1.prompt({
                    type: 'input',
                    name: 'flowRatio',
                    message: '请输入流量配置（%）'
                });
                if (Number.isNaN(flowRatio) || Number(flowRatio) < 0 || Math.floor(Number(flowRatio)) - Number(flowRatio) !== 0)
                    throw new error_1.CloudBaseError('请输入大于等于零的整数');
                versionFlowItems.push({
                    VersionName: versionName,
                    FlowRatio: Number(flowRatio)
                });
                if ((yield enquirer_1.prompt({
                    type: 'select',
                    name: 'continue',
                    message: '还要继续选择吗',
                    choices: ['继续', '结束']
                })).continue === '结束')
                    break;
            }
            let sum = versionFlowItems.reduce((sum, item) => sum + item.FlowRatio, 0);
            if (sum !== 100 && sum != 0)
                throw new error_1.CloudBaseError('流量配置的总和需要为 0 或 100');
            loading.start('数据加载中...');
            try {
                const res = yield run_1.modifyVersion({
                    envId,
                    serverName: serviceName,
                    trafficType: 'FLOW',
                    versionFlowItems
                });
                if (res !== 'succ')
                    throw new error_1.CloudBaseError('分配失败');
            }
            catch (e) {
                throw e;
            }
            loading.succeed('分配成功');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ModifyVersion.prototype, "execute", null);
ModifyVersion = __decorate([
    common_1.ICommand()
], ModifyVersion);
exports.ModifyVersion = ModifyVersion;
