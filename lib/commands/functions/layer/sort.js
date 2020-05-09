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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const enquirer_1 = require("enquirer");
const common_1 = require("../../common");
const utils_1 = require("../../../utils");
const error_1 = require("../../../error");
const function_1 = require("../../../function");
const decorators_1 = require("../../../decorators");
let SortFileLayer = class SortFileLayer extends common_1.Command {
    get options() {
        return {
            cmd: 'functions:layer:sort <name>',
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
            desc: '重新排列云函数绑定的文件层的顺序'
        };
    }
    execute(envId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { codeSecret } = options;
            const loading = utils_1.loadingFactory();
            loading.start('数据加载中...');
            const detail = yield function_1.getFunctionDetail({
                envId,
                codeSecret,
                functionName: name
            });
            loading.stop();
            const layers = detail.Layers.map((item) => ({
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
            sortLayers = sortLayers.map((item) => lodash_1.default.pick(item, ['LayerName', 'LayerVersion']));
            loading.start('文件层排序中...');
            yield function_1.sortLayer({
                envId,
                functionName: name,
                layers: sortLayers
            });
            loading.succeed('文件层排序成功！');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SortFileLayer.prototype, "execute", null);
SortFileLayer = __decorate([
    common_1.ICommand()
], SortFileLayer);
exports.SortFileLayer = SortFileLayer;
