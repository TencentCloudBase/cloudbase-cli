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
exports.CreateFileLayer = void 0;
const path_1 = __importDefault(require("path"));
const common_1 = require("../../common");
const function_1 = require("../../../function");
const utils_1 = require("../../../utils");
const decorators_1 = require("../../../decorators");
const common_2 = require("./common");
let CreateFileLayer = class CreateFileLayer extends common_1.Command {
    get options() {
        return Object.assign(Object.assign({}, common_2.layerCommonOptions('create <alias>')), { deprecateCmd: 'functions:layer:create <alias>', options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '--file, <file>',
                    desc: '文件路径'
                }
            ], desc: '创建函数文件层' });
    }
    execute(envId, options, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const alias = params === null || params === void 0 ? void 0 : params[0];
            const { file } = options;
            const layerName = `${alias}_${envId}`;
            const filePath = path_1.default.resolve(file);
            const runtimes = ['Nodejs8.9', 'Php7', 'Java8'];
            const loading = utils_1.loadingFactory();
            loading.start('文件层创建中...');
            yield function_1.createLayer({
                layerName,
                runtimes,
                contentPath: filePath
            });
            loading.succeed('文件层创建成功！');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()), __param(2, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CreateFileLayer.prototype, "execute", null);
CreateFileLayer = __decorate([
    common_1.ICommand()
], CreateFileLayer);
exports.CreateFileLayer = CreateFileLayer;
