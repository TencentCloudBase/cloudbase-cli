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
const trigger_1 = require("./trigger");
const base_1 = require("./base");
function retryCreateTrigger(options, count = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield trigger_1.createFunctionTriggers(options);
        }
        catch (e) {
            if (count < 3) {
                yield utils_1.sleep(500);
                yield retryCreateTrigger(options, count + 1);
            }
            else {
                throw e;
            }
        }
    });
}
function createFunction(options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const { functionRootPath = '', envId, force = false, base64Code = '', codeSecret } = options;
        const func = Object.assign(Object.assign({}, (_b = (_a = options) === null || _a === void 0 ? void 0 : _a.func) === null || _b === void 0 ? void 0 : _b.config), options.func);
        const funcName = func.name;
        if (codeSecret && !/^[A-Za-z0-9+=/]{1,160}$/.test(codeSecret)) {
            throw new error_1.CloudBaseError('CodeSecret 格式错误，格式为 1-160 位大小字母，数字+=/');
        }
        const validRuntime = ['Nodejs8.9', 'Php7', 'Java8'];
        if (func.runtime && !validRuntime.includes(func.runtime)) {
            throw new error_1.CloudBaseError(`${funcName} Invalid runtime value：${func.runtime}. Now only support: ${validRuntime.join(', ')}`);
        }
        const scfService = yield base_1.getFunctionService(envId);
        try {
            yield scfService.createFunction({
                func,
                functionRootPath,
                force,
                base64Code,
                codeSecret
            });
        }
        catch (e) {
            if (e.message && !force) {
                throw new error_1.CloudBaseError(`[${funcName}] 部署失败，${e.message}`, {
                    code: e.code
                });
            }
        }
    });
}
exports.createFunction = createFunction;
function batchCreateFunctions(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { functions, functionRootPath = '', envId, force, codeSecret, log = false } = options;
        const promises = functions.map(func => (() => __awaiter(this, void 0, void 0, function* () {
            const loading = utils_1.loadingFactory();
            try {
                log && loading.start(`[${func.name}] 函数部署中...`);
                yield createFunction({
                    func,
                    envId,
                    force,
                    codeSecret,
                    functionRootPath
                });
                log && loading.succeed(`[${func.name}] 函数部署成功`);
            }
            catch (e) {
                log && loading.fail(`[${func.name}] 函数部署失败`);
                throw new error_1.CloudBaseError(e.message);
            }
        }))());
        yield Promise.all(promises);
    });
}
exports.batchCreateFunctions = batchCreateFunctions;
