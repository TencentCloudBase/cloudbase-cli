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
const path_1 = __importDefault(require("path"));
const function_1 = require("../../../function");
const utils_1 = require("../../../utils");
function createFileLayer(ctx, alias) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, options } = ctx;
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
exports.createFileLayer = createFileLayer;
