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
const fs_extra_1 = __importDefault(require("fs-extra"));
const inquirer_1 = __importDefault(require("inquirer"));
const error_1 = require("../../error");
const code_1 = require("../../function/code");
const utils_1 = require("../../utils");
function codeDownload(ctx, dest, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, envId, config } = ctx;
        const { codeSecret } = options;
        if (!name) {
            throw new error_1.CloudBaseError('请指定云函数名称！');
        }
        let destPath = dest;
        if (!destPath) {
            destPath = path_1.default.resolve(config.functionRoot, name);
            if (utils_1.checkPathExist(destPath)) {
                const { override } = yield inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'override',
                    message: '函数已经存在，是否覆盖原文件？',
                    default: false
                });
                if (!override) {
                    throw new error_1.CloudBaseError('下载终止！');
                }
                utils_1.delSync([destPath]);
            }
            yield fs_extra_1.default.ensureDir(destPath);
        }
        const loading = utils_1.loadingFactory();
        loading.start('文件下载中...');
        yield code_1.downloadFunctionCode({
            envId,
            functionName: name,
            destPath: destPath,
            codeSecret: codeSecret,
            unzip: true
        });
        loading.succeed(`[${name}] 云函数代码下载成功！`);
    });
}
exports.codeDownload = codeDownload;
