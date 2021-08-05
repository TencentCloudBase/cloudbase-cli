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
exports.DeleteRun = void 0;
const enquirer_1 = require("enquirer");
const common_1 = require("../common");
const error_1 = require("../../error");
const run_1 = require("../../run");
const decorators_1 = require("../../decorators");
const utils_1 = require("../../utils");
let DeleteRun = class DeleteRun extends common_1.Command {
    get options() {
        return {
            cmd: 'run',
            childCmd: 'delete',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '云托管服务 name'
                },
            ],
            desc: '删除云托管服务'
        };
    }
    execute(envId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let { serviceName = '' } = options;
            if (serviceName.length === 0) {
                throw new error_1.CloudBaseError('必须输入服务名');
            }
            const loading = utils_1.loadingFactory();
            loading.start('数据加载中...');
            const versions = yield run_1.listVersion({ envId, serverName: serviceName, limit: 1, offset: 0 });
            if (versions.length > 0)
                throw new error_1.CloudBaseError('服务下还有版本存在，请先清空版本列表');
            const imageRepo = yield run_1.describeImageRepo({ envId, serverName: serviceName });
            loading.start('正在删除服务');
            const res = yield run_1.deleteRun({ envId, serverName: serviceName });
            if (res === 'succ')
                loading.succeed('服务删除完成');
            else
                throw new error_1.CloudBaseError('服务删除失败');
            if ((yield enquirer_1.prompt({
                type: 'select',
                name: 'flag',
                message: `是否删除绑定的镜像仓库${imageRepo}`,
                choices: ['是', '否']
            })).flag === '是') {
                loading.start('正在删除镜像仓库');
                const res = yield run_1.deleteImageRepo({ imageRepo });
                if (res === '') {
                    loading.succeed('仓库删除完成');
                }
                else {
                    throw new error_1.CloudBaseError('仓库删除失败');
                }
            }
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
], DeleteRun.prototype, "execute", null);
DeleteRun = __decorate([
    common_1.ICommand()
], DeleteRun);
exports.DeleteRun = DeleteRun;
