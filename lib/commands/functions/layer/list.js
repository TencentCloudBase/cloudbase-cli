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
const common_1 = require("../../common");
const utils_1 = require("../../../utils");
const decorators_1 = require("../../../decorators");
const function_1 = require("../../../function");
let ListFileLayer = class ListFileLayer extends common_1.Command {
    get options() {
        return {
            cmd: 'functions:layer:list',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '--name, <name>',
                    desc: '函数名称'
                },
                {
                    flags: '--layer, <layer>',
                    desc: '文件层别名'
                },
                {
                    flags: '--code-secret, <codeSecret>',
                    desc: '代码加密的函数的 CodeSecret'
                }
            ],
            desc: '展示文件层列表'
        };
    }
    execute(envId, options, log) {
        return __awaiter(this, void 0, void 0, function* () {
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
                data = data.filter((item) => item.LayerName.includes(`_${envId}`));
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
            log.info('Tips：函数绑定多个版本时，同名文件将按优先级从小到大的顺序进行覆盖执行。');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()), __param(2, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], ListFileLayer.prototype, "execute", null);
ListFileLayer = __decorate([
    common_1.ICommand()
], ListFileLayer);
exports.ListFileLayer = ListFileLayer;
