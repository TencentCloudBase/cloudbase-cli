"use strict";
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
const utils_1 = require("../../../utils");
const error_1 = require("../../../error");
function attachFileLayer(ctx, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, options } = ctx;
        const { codeSecret } = options;
        const loading = utils_1.loadingFactory();
        loading.start('数据加载中...');
        let layers = yield function_1.listLayers({
            offset: 0,
            limit: 200
        });
        loading.stop();
        layers = layers.map(item => item.LayerName);
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
        versions = versions.map(item => String(item.LayerVersion));
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
exports.attachFileLayer = attachFileLayer;
function unAttachFileLayer(ctx, name) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, options } = ctx;
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
        const layers = detail.Layers.map(item => ({
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
exports.unAttachFileLayer = unAttachFileLayer;
