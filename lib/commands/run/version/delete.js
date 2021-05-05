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
exports.DeleteVersion = void 0;
const common_1 = require("../../common");
const error_1 = require("../../../error");
const run_1 = require("../../../run");
const utils_1 = require("../../../utils");
const decorators_1 = require("../../../decorators");
const common_2 = require("./common");
let DeleteVersion = class DeleteVersion extends common_1.Command {
    get options() {
        return Object.assign(Object.assign({}, common_2.versionCommonOptions('delete')), { options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '托管服务 name'
                },
                {
                    flags: '-v, --versionName <versionName>',
                    desc: '版本名称 Name'
                }
            ], desc: '删除云开发环境下云托管服务的版本' });
    }
    execute(envId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let { serviceName = '', versionName = '' } = options;
            if (versionName.length === 0 || serviceName.length === 0) {
                throw new error_1.CloudBaseError('必须输入 serviceName 和 versionName');
            }
            const loading = utils_1.loadingFactory();
            loading.start('数据加载中...');
            try {
                const res = yield run_1.deleteVersion({
                    envId,
                    serverName: serviceName,
                    versionName
                });
                if (res === 'succ')
                    loading.succeed(`成功删除 ${serviceName} 服务下的 ${versionName} 版本`);
                else
                    throw new error_1.CloudBaseError('删除失败，请查看版本是否存在, 或者先清空版本灰度流量');
            }
            catch (e) {
                throw new error_1.CloudBaseError('删除失败，请查看版本是否存在, 或者先清空版本灰度流量');
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
], DeleteVersion.prototype, "execute", null);
DeleteVersion = __decorate([
    common_1.ICommand()
], DeleteVersion);
exports.DeleteVersion = DeleteVersion;
