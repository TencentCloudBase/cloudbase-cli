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
const error_1 = require("../error");
const base_1 = require("./base");
function updateFunctionCode(options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { functionRootPath = '', envId, base64Code = '', codeSecret } = options;
        const func = Object.assign(Object.assign({}, (_a = options === null || options === void 0 ? void 0 : options.func) === null || _a === void 0 ? void 0 : _a.config), options.func);
        const funcName = func.name;
        if (codeSecret && !/^[A-Za-z0-9+=/]{1,160}$/.test(codeSecret)) {
            throw new error_1.CloudBaseError('CodeSecret 格式错误，格式为 1-160 位大小字母，数字+=/');
        }
        const validRuntime = ['Nodejs8.9', 'Php7', 'Java8', 'Nodejs10.15'];
        if (func.runtime && !validRuntime.includes(func.runtime)) {
            throw new error_1.CloudBaseError(`${funcName} 非法的运行环境：${func.runtime}，当前支持环境：${validRuntime.join(', ')}`);
        }
        const scfService = yield base_1.getFunctionService(envId);
        try {
            yield scfService.updateFunctionCode({
                func,
                functionRootPath,
                base64Code,
                codeSecret
            });
        }
        catch (e) {
            throw new error_1.CloudBaseError(`[${funcName}] 函数代码更新失败： ${e.message}`, {
                code: e.code
            });
        }
    });
}
exports.updateFunctionCode = updateFunctionCode;
