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
const function_1 = require("../../../function");
const utils_1 = require("../../../utils");
function listFileLayer(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, options } = ctx;
        const { name, layer, codeSecret } = options;
        const loading = utils_1.loadingFactory();
        loading.start('数据加载中...');
        let data;
        if (layer && typeof layer === 'string') {
            const layerName = `${layer}_${envId}`;
            data = yield function_1.listLayerVersions({
                name: layerName
            });
        }
        else if (name && typeof name === 'string') {
            const res = yield function_1.getFunctionDetail({
                envId,
                functionName: name,
                codeSecret
            });
            data = (res === null || res === void 0 ? void 0 : res.Layers) || [];
        }
        else if (envId) {
            data = yield function_1.listLayers({
                offset: 0,
                limit: 200
            });
            data = data.filter(item => item.LayerName.includes(`_${envId}`));
        }
        else {
            data = yield function_1.listLayers({
                offset: 0,
                limit: 200
            });
        }
        loading.stop();
        const head = ['优先级', '名称', '状态', '版本', '证书', '支持运行时', '创建时间'];
        const tableData = data.map((item, index) => [
            index + 1,
            item.LayerName,
            item.Status,
            item.LayerVersion,
            item.LicenseInfo || '空',
            item.CompatibleRuntimes.join(' | '),
            item.AddTime
        ]);
        utils_1.printHorizontalTable(head, tableData);
        console.log('Tips：函数绑定多个版本时，同名文件将按优先级从小到大的顺序进行覆盖执行。');
    });
}
exports.listFileLayer = listFileLayer;
