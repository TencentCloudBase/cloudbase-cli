"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const utils_1 = require("../utils");
const error_1 = require("../error");
const trigger_1 = require("./trigger");
const _packer_1 = require("./_packer");
const scfService = new utils_1.CloudService('scf', '2018-04-16', {
    Role: 'TCB_QcsRole',
    Stamp: 'MINI_QCBASE'
});
async function createFunction(options) {
    const { func, root = '', envId, force = false, base64Code = '' } = options;
    let base64;
    let packer;
    const funcName = func.name;
    const validRuntime = ['Nodejs8.9', 'Php7', 'Java8'];
    if (func.config.runtime && !validRuntime.includes(func.config.runtime)) {
        throw new error_1.TcbError(`${funcName} Invalid runtime value：${func.config.runtime}. Now only support: ${validRuntime.join(', ')}`);
    }
    if (!base64Code) {
        packer = new _packer_1.FunctionPacker(root, funcName);
        const type = func.config.runtime === 'Java8' ? _packer_1.CodeType.JavaFile : _packer_1.CodeType.File;
        base64 = await packer.build(type);
        if (!base64) {
            throw new error_1.TcbError('函数不存在！');
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
        MemorySize: 256
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
    try {
        await scfService.request('CreateFunction', params);
        await trigger_1.createFunctionTriggers({
            functionName: funcName,
            triggers: func.triggers,
            envId
        });
    }
    catch (e) {
        if (e.code === 'ResourceInUse.FunctionName' && force) {
            params.ZipFile = base64;
            await scfService.request('UpdateFunctionConfiguration', params);
            delete params.Code;
            await scfService.request('UpdateFunctionCode', params);
            await trigger_1.createFunctionTriggers({
                functionName: funcName,
                triggers: func.triggers,
                envId
            });
            return;
        }
        if (e.message && !force) {
            throw new error_1.TcbError(`[${funcName}] 部署失败：\n ${e.message}`, {
                code: e.code
            });
        }
    }
}
exports.createFunction = createFunction;
async function batchCreateFunctions(options) {
    const { functions, root, envId, force, log = false } = options;
    const promises = functions.map(func => (async () => {
        const spinner = ora_1.default(`[${func.name}] 函数部署中...`);
        try {
            log && spinner.start();
            await createFunction({
                func,
                root,
                envId,
                force
            });
            log && spinner.succeed(`[${func.name}] 函数部署成功`);
        }
        catch (e) {
            log && spinner.fail(`[${func.name}] 函数部署失败`);
            throw new error_1.TcbError(e.message);
        }
    })());
    await Promise.all(promises);
}
exports.batchCreateFunctions = batchCreateFunctions;
async function updateFunctionCode(options) {
    const { func, root = '', envId, base64Code = '' } = options;
    let base64;
    let packer;
    const funcName = func.name;
    const validRuntime = ['Nodejs8.9', 'Php7', 'Java8'];
    if (func.config.runtime && !validRuntime.includes(func.config.runtime)) {
        throw new error_1.TcbError(`${funcName} 非法的运行环境：${func.config.runtime}，当前支持环境：${validRuntime.join(', ')}`);
    }
    if (!base64Code) {
        packer = new _packer_1.FunctionPacker(root, funcName);
        const type = func.config.runtime === 'Java8' ? _packer_1.CodeType.JavaFile : _packer_1.CodeType.File;
        base64 = await packer.build(type);
        if (!base64) {
            throw new error_1.TcbError('函数不存在！');
        }
    }
    else {
        base64 = base64Code;
    }
    const params = {
        FunctionName: funcName,
        Namespace: envId,
        ZipFile: base64,
        Handler: func.handler || 'index.main'
    };
    try {
        await scfService.request('UpdateFunctionCode', params);
    }
    catch (e) {
        throw new error_1.TcbError(`[${funcName}] 函数代码更新失败： ${e.message}`, {
            code: e.code
        });
    }
}
exports.updateFunctionCode = updateFunctionCode;
