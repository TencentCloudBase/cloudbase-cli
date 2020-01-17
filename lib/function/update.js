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
const utils_1 = require("../utils");
const error_1 = require("../error");
const scfService = new utils_1.CloudApiService('scf');
function updateFunctionCode(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { func, functionRootPath = '', envId, base64Code = '', codeSecret } = options;
        let base64;
        let packer;
        const funcName = func.name;
        if (codeSecret && !/^[A-Za-z0-9+=/]{1,160}$/.test(codeSecret)) {
            throw new error_1.CloudBaseError('CodeSecret 格式错误，格式为 1-160 位大小字母，数字+=/');
        }
        const validRuntime = ['Nodejs8.9', 'Php7', 'Java8'];
        if (func.runtime && !validRuntime.includes(func.runtime)) {
            throw new error_1.CloudBaseError(`${funcName} 非法的运行环境：${func.runtime}，当前支持环境：${validRuntime.join(', ')}`);
        }
        let installDependency;
        installDependency = func.runtime === 'Nodejs8.9' ? 'TRUE' : 'FALSE';
        if (typeof func.installDependency !== 'undefined') {
            installDependency = func.installDependency ? 'TRUE' : 'FALSE';
        }
        if (!base64Code) {
            packer = new utils_1.FunctionPacker(functionRootPath, funcName, func.ignore);
            const type = func.runtime === 'Java8' ? utils_1.CodeType.JavaFile : utils_1.CodeType.File;
            base64 = yield packer.build(type);
            if (!base64) {
                throw new error_1.CloudBaseError('函数不存在！');
            }
        }
        else {
            base64 = base64Code;
        }
        const params = {
            FunctionName: funcName,
            Namespace: envId,
            ZipFile: base64,
            CodeSecret: codeSecret,
            Handler: func.handler || 'index.main',
            InstallDependency: installDependency
        };
        try {
            yield scfService.request('UpdateFunctionCode', params);
        }
        catch (e) {
            throw new error_1.CloudBaseError(`[${funcName}] 函数代码更新失败： ${e.message}`, {
                code: e.code
            });
        }
    });
}
exports.updateFunctionCode = updateFunctionCode;
