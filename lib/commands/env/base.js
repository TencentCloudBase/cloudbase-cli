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
const env_1 = require("../../env");
const decorators_1 = require("../../decorators");
const utils_1 = require("../../utils");
let EnvListCommand = class EnvListCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'env:list',
            options: [],
            desc: '展示云开发环境信息',
            requiredEnvId: false
        };
    }
    execute(log) {
        return __awaiter(this, void 0, void 0, function* () {
            const loading = utils_1.loadingFactory();
            loading.start('数据加载中...');
            const data = yield env_1.listEnvs();
            loading.stop();
            const head = ['名称', '环境 Id', '套餐版本', '来源', '创建时间', '环境状态'];
            const sortData = data.sort((prev, next) => {
                if (prev.Alias > next.Alias) {
                    return 1;
                }
                if (prev.Alias < next.Alias) {
                    return -1;
                }
                return 0;
            });
            const tableData = sortData.map((item) => [
                item.Alias,
                item.EnvId,
                item.PackageName || '按量计费',
                item.Source === 'miniapp' ? '小程序' : '云开发',
                item.CreateTime,
                item.Status === 'NORMAL' ? '正常' : '不可用'
            ]);
            utils_1.printHorizontalTable(head, tableData);
            const unavailableEnv = data.find((item) => item.Status === 'UNAVAILABLE');
            if (unavailableEnv) {
                log.warn(`您的环境中存在不可用的环境：[${unavailableEnv.EnvId}]，请留意！`);
            }
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], EnvListCommand.prototype, "execute", null);
EnvListCommand = __decorate([
    common_1.ICommand()
], EnvListCommand);
exports.EnvListCommand = EnvListCommand;
let EnvRenameCommand = class EnvRenameCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'env:rename <name>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '修改云开发环境别名',
            requiredEnvId: false
        };
    }
    execute(envId, params, log) {
        return __awaiter(this, void 0, void 0, function* () {
            log.verbose(params);
            const name = params === null || params === void 0 ? void 0 : params[0];
            if (!name) {
                throw new error_1.CloudBaseError('环境别名不能为空！');
            }
            yield env_1.updateEnvInfo({
                envId: envId,
                alias: name
            });
            log.success('更新环境别名成功 ！');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsParams()), __param(2, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], EnvRenameCommand.prototype, "execute", null);
EnvRenameCommand = __decorate([
    common_1.ICommand()
], EnvRenameCommand);
exports.EnvRenameCommand = EnvRenameCommand;
