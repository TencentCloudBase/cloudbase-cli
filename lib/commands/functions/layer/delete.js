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
const utils_1 = require("../../../utils");
const error_1 = require("../../../error");
const function_1 = require("../../../function");
function deleteFileLayer(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId } = ctx;
        const loading = utils_1.loadingFactory();
        loading.start('数据加载中...');
        let layers = yield function_1.listLayers({
            offset: 0,
            limit: 200
        });
        loading.stop();
        layers = layers.filter(item => item.LayerName.includes(`_${envId}`)).map(item => item.LayerName);
        if (!layers.length) {
            throw new error_1.CloudBaseError('当前环境没有可用的文件层，请先创建文件层！');
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
        const { version } = yield enquirer_1.prompt({
            type: 'select',
            name: 'version',
            message: '选择文件层版本',
            choices: versions
        });
        loading.start('文件层删除中...');
        yield function_1.deleteLayer({
            name: layer,
            version: Number(version)
        });
        loading.succeed('文件层删除成功！');
    });
}
exports.deleteFileLayer = deleteFileLayer;
