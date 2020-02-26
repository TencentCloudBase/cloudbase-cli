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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const enquirer_1 = require("enquirer");
const utils_1 = require("../../../utils");
const function_1 = require("../../../function");
const error_1 = require("../../../error");
function sortFileLayer(ctx, name) {
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
        loading.stop();
        const layers = detail.Layers.map(item => ({
            name: `${item.LayerName} - ${item.LayerVersion}`,
            value: item
        }));
        if (!layers.length) {
            throw new error_1.CloudBaseError('没有可用的文件层，请先创建文件层！');
        }
        let { sortLayers } = yield enquirer_1.prompt({
            type: 'sort',
            name: 'sortLayers',
            message: '选择文件层',
            numbered: true,
            choices: layers,
            result(choices) {
                return Object.values(this.map(choices));
            }
        });
        sortLayers = sortLayers.map(item => lodash_1.default.pick(item, ['LayerName', 'LayerVersion']));
        loading.start('文件层排序中...');
        yield function_1.sortLayer({
            envId,
            functionName: name,
            layers: sortLayers
        });
        loading.succeed('文件层排序成功！');
    });
}
exports.sortFileLayer = sortFileLayer;
