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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const error_1 = require("../../error");
const utils_1 = require("../../utils");
const scfService = new utils_1.CloudApiService('scf');
function createLayer(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { contentPath = '', layerName, base64Content = '', runtimes = [] } = options;
        utils_1.checkFullAccess(contentPath);
        const validRuntime = ['Nodejs8.9', 'Php7', 'Java8'];
        if (runtimes.some(item => validRuntime.indexOf(item) === -1)) {
            throw new error_1.CloudBaseError(`Invalid runtime value. Now only support: ${validRuntime.join(', ')}`);
        }
        let base64;
        if (base64Content) {
            base64 = base64Content;
        }
        else if (utils_1.isDirectory(contentPath)) {
            const dirName = path_1.default.parse(contentPath).name;
            const dest = path_1.default.join(process.cwd(), `cli-${dirName}.zip`);
            if (utils_1.checkFullAccess(dest)) {
                utils_1.delSync(dest);
            }
            yield utils_1.zipDir(contentPath, dest);
            const fileBuffer = yield fs_1.default.promises.readFile(dest);
            base64 = fileBuffer.toString('base64');
            utils_1.delSync(dest);
        }
        else {
            const fileType = path_1.default.extname(contentPath);
            if (fileType !== '.zip') {
                throw new error_1.CloudBaseError('文件类型不正确，目前只支持 ZIP 文件！');
            }
            const fileBuffer = yield fs_1.default.promises.readFile(contentPath);
            base64 = fileBuffer.toString('base64');
        }
        return scfService.request('PublishLayerVersion', {
            LayerName: layerName,
            CompatibleRuntimes: runtimes,
            Content: {
                ZipFile: base64
            }
        });
    });
}
exports.createLayer = createLayer;
