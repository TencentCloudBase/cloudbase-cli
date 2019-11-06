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
const scfService = new utils_1.CloudService('scf', '2018-04-16', {
    Role: 'TCB_QcsRole',
    Stamp: 'MINI_QCBASE'
});
function createFunction(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { func, functionRootPath = '', envId, force = false, base64Code = '', codeSecret } = options;
        let base64;
        let packer;
        const funcName = func.name;
        if (codeSecret && !/^[A-Za-z0-9+=/]{1,160}$/.test(codeSecret)) {
            throw new error_1.CloudBaseError('CodeSecret 格式错误，格式为 1-160 位大小字母，数字+=/');
        }
        const validRuntime = ['Nodejs8.9', 'Php7', 'Java8'];
        if (func.config.runtime && !validRuntime.includes(func.config.runtime)) {
            throw new error_1.CloudBaseError(`${funcName} Invalid runtime value：${func.config.runtime}. Now only support: ${validRuntime.join(', ')}`);
        }
        if (!base64Code) {
            packer = new utils_1.FunctionPacker(functionRootPath, funcName, func.ignore);
            const type = func.config.runtime === 'Java8' ? utils_1.CodeType.JavaFile : utils_1.CodeType.File;
            base64 = yield packer.build(type);
            if (!base64) {
                throw new error_1.CloudBaseError('函数不存在！');
            }
        }
        else {
            base64 = base64Code;
        }
        const envVariables = Object.keys(func.config.envVariables || {}).map(key => ({
            Key: key,
            Value: func.config.envVariables[key]
        }));
        const params = {
            FunctionName: funcName,
            Namespace: envId,
            Code: {
                ZipFile: base64
            },
            CodeSecret: codeSecret,
            MemorySize: 256,
            L5Enable: func.config && func.config.l5 ? 'TRUE' : null
        };
        const { config } = func;
        envVariables.length && (params.Environment = { Variables: envVariables });
        params.Handler = func.handler || 'index.main';
        params.Timeout = Number(config.timeout) || 20;
        params.Runtime = config.runtime || 'Nodejs8.9';
        params.VpcConfig = {
            SubnetId: (config.vpc && config.vpc.subnetId) || '',
            VpcId: (config.vpc && config.vpc.vpcId) || ''
        };
        params.InstallDependency =
            typeof config.installDependency === 'undefined'
                ? null
                : config.installDependency
                    ? 'TRUE'
                    : 'FALSE';
        try {
            yield scfService.request('CreateFunction', params);
            yield trigger_1.createFunctionTriggers({
                functionName: funcName,
                triggers: func.triggers,
                envId
            });
        }
        catch (e) {
            if (e.code === 'ResourceInUse.FunctionName' && force) {
                params.ZipFile = base64;
                yield scfService.request('UpdateFunctionConfiguration', params);
                delete params.Code;
                yield scfService.request('UpdateFunctionCode', params);
                yield trigger_1.createFunctionTriggers({
                    functionName: funcName,
                    triggers: func.triggers,
                    envId
                });
                return;
            }
            if (e.message && !force) {
                throw new error_1.CloudBaseError(`[${funcName}] 部署失败：\n${e.message}`, {
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
        if (func.config.runtime && !validRuntime.includes(func.config.runtime)) {
            throw new error_1.CloudBaseError(`${funcName} 非法的运行环境：${func.config.runtime}，当前支持环境：${validRuntime.join(', ')}`);
        }
        if (!base64Code) {
            packer = new utils_1.FunctionPacker(functionRootPath, funcName, func.ignore);
            const type = func.config.runtime === 'Java8' ? utils_1.CodeType.JavaFile : utils_1.CodeType.File;
            base64 = yield packer.build(type);
            if (!base64) {
                throw new error_1.CloudBaseError('函数不存在！');
            }
        }
        else {
            base64 = base64Code;
        }
        const installDependency = typeof func.config.installDependency === 'undefined'
            ? null
            : func.config.installDependency
                ? 'TRUE'
                : 'FALSE';
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
