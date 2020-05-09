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
const function_1 = require("../../../function");
const common_1 = require("../../common");
const utils_1 = require("../../../utils");
const error_1 = require("../../../error");
const decorators_1 = require("../../../decorators");
let AttachFileLayer = class AttachFileLayer extends common_1.Command {
    get options() {
        return {
            cmd: 'functions:layer:bind <name>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '--code-secret, <codeSecret>',
                    desc: '代码加密的函数的 CodeSecret'
                }
            ],
            desc: '绑定文件层到云函数'
        };
    }
    execute(envId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { codeSecret } = options;
            const loading = utils_1.loadingFactory();
            loading.start('数据加载中...');
            let layers = yield function_1.listLayers({
                offset: 0,
                limit: 200
            });
            loading.stop();
            layers = layers.map((item) => item.LayerName);
            if (!layers.length) {
                throw new error_1.CloudBaseError('没有可用的文件层，请先创建文件层！');
            }
            const { layer } = yield enquirer_1.prompt({
                type: 'select',
                name: 'layer',
                message: '选择文件层名称',
                choices: layers
            });
            let versions = yield function_1.listLayerVersions({
                name: layer
            });
            versions = versions.map((item) => String(item.LayerVersion));
            if (!versions.length) {
                throw new error_1.CloudBaseError('没有可用的文件层版本，请先创建文件层版本！');
            }
            const { version } = yield enquirer_1.prompt({
                type: 'select',
                name: 'version',
                message: '选择文件层版本',
                choices: versions
            });
            loading.start('文件层绑定中...');
            yield function_1.attachLayer({
                envId,
                functionName: name,
                layerName: layer,
                layerVersion: Number(version),
                codeSecret
            });
            loading.succeed('文件层绑定成功！');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AttachFileLayer.prototype, "execute", null);
AttachFileLayer = __decorate([
    common_1.ICommand()
], AttachFileLayer);
exports.AttachFileLayer = AttachFileLayer;
let UnAttachFileLayer = class UnAttachFileLayer extends common_1.Command {
    get options() {
        return {
            cmd: 'functions:layer:unbind <name>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '--code-secret, <codeSecret>',
                    desc: '代码加密的函数的 CodeSecret'
                }
            ],
            desc: '删除云函数绑定的文件层'
        };
    }
    execute(envId, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { codeSecret } = options;
            const loading = utils_1.loadingFactory();
            loading.start('数据加载中...');
            const detail = yield function_1.getFunctionDetail({
                envId,
                codeSecret,
                functionName: name
            });
            if (!((_a = detail === null || detail === void 0 ? void 0 : detail.Layers) === null || _a === void 0 ? void 0 : _a.length)) {
                throw new error_1.CloudBaseError('该云函数未绑定文件层！');
            }
            loading.stop();
            const layers = detail.Layers.map((item) => ({
                name: `名称：${item.LayerName} / 版本： ${item.LayerVersion}`,
                value: item
            }));
            const { layer } = yield enquirer_1.prompt({
                type: 'select',
                name: 'layer',
                message: '选择文件层',
                choices: layers,
                result(choice) {
                    return this.map(choice)[choice];
                }
            });
            loading.start('文件层解绑中...');
            yield function_1.unAttachLayer({
                envId,
                functionName: name,
                layerName: layer.LayerName,
                layerVersion: layer.LayerVersion,
                codeSecret
            });
            loading.succeed('文件层解绑成功！');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UnAttachFileLayer.prototype, "execute", null);
UnAttachFileLayer = __decorate([
    common_1.ICommand()
], UnAttachFileLayer);
exports.UnAttachFileLayer = UnAttachFileLayer;
