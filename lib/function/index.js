"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ora_1 = __importDefault(require("ora"));
const utils_1 = require("../utils");
const tencentcloud_sdk_nodejs_1 = __importDefault(require("../../deps/tencentcloud-sdk-nodejs"));
const logger_1 = require("../logger");
const function_pack_1 = require("./function-pack");
const error_1 = require("../error");
async function tencentcloudScfRequest(interfaceName, params) {
    const credential = await utils_1.getCredential();
    const { secretId, secretKey, token } = credential;
    const ScfClient = tencentcloud_sdk_nodejs_1.default.scf.v20180416.Client;
    const models = tencentcloud_sdk_nodejs_1.default.scf.v20180416.Models;
    const Credential = tencentcloud_sdk_nodejs_1.default.common.Credential;
    let cred = new Credential(secretId, secretKey, token);
    let client = new ScfClient(cred, 'ap-shanghai');
    let req = new models[`${interfaceName}Request`]();
    const _params = Object.assign({ Region: 'ap-shanghai', Role: 'TCB_QcsRole', Stamp: 'MINI_QCBASE' }, params);
    req.deserialize(_params);
    return new Promise((resolve, reject) => {
        client[interfaceName](req, (err, response) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(response);
        });
    });
}
async function createFunctionTriggers(options) {
    const { functionName: name, triggers, envId } = options;
    const parsedTriggers = triggers.map(item => ({
        TriggerName: item.name,
        Type: item.type,
        TriggerDesc: item.config
    }));
    try {
        await tencentcloudScfRequest('BatchCreateTrigger', {
            FunctionName: name,
            Namespace: envId,
            Triggers: JSON.stringify(parsedTriggers),
            Count: parsedTriggers.length
        });
        logger_1.successLog(`[${name}] 创建云函数触发器成功！`);
    }
    catch (e) {
        throw new error_1.TcbError(`[${name}] 创建触发器失败：${e.message}`);
    }
}
exports.createFunctionTriggers = createFunctionTriggers;
async function batchCreateTriggers(options) {
    const { functions, envId } = options;
    const promises = functions.map(func => (async () => {
        try {
            await createFunctionTriggers({
                functionName: func.name,
                triggers: func.triggers,
                envId
            });
        }
        catch (e) {
            throw new error_1.TcbError(e.message);
        }
    })());
    await Promise.all(promises);
}
exports.batchCreateTriggers = batchCreateTriggers;
async function deleteFunctionTrigger(options) {
    const { functionName, triggerName, envId } = options;
    try {
        await tencentcloudScfRequest('DeleteTrigger', {
            FunctionName: functionName,
            Namespace: envId,
            TriggerName: triggerName,
            Type: 'timer'
        });
        logger_1.successLog(`[${functionName}] 删除云函数触发器 ${triggerName} 成功！`);
    }
    catch (e) {
        throw new error_1.TcbError(`[${functionName}] 删除触发器失败：${e.message}`);
    }
}
exports.deleteFunctionTrigger = deleteFunctionTrigger;
async function batchDeleteTriggers(options) {
    const { functions, envId } = options;
    const promises = functions.map(func => (async () => {
        try {
            func.triggers.forEach(async (trigger) => {
                await deleteFunctionTrigger({
                    functionName: func.name,
                    triggerName: trigger.name,
                    envId
                });
            });
        }
        catch (e) {
            throw new error_1.TcbError(e.message);
        }
    })());
    await Promise.all(promises);
}
exports.batchDeleteTriggers = batchDeleteTriggers;
function getJavaZipFilePath(funcPath, funcName) {
    const jarExist = fs_1.default.existsSync(`${funcPath}.jar`);
    const zipExist = fs_1.default.existsSync(`${funcPath}.zip`);
    if (!jarExist && !zipExist) {
        throw new error_1.TcbError(`${funcName} Java 编译文件不存在，部署终止。Java 仅支持编译打包后的 Zip/Jar 包`);
    }
    return jarExist ? `${funcPath}.jar` : `${funcPath}.zip`;
}
async function createFunction(options) {
    const { func, root = '', envId, force = false, zipFile = '' } = options;
    let base64;
    let packer;
    const funcName = func.name;
    const validRuntime = ['Nodejs8.9', 'Php7', 'Java8'];
    if (func.config.runtime && !validRuntime.includes(func.config.runtime)) {
        throw new error_1.TcbError(`${funcName} 非法的运行环境：${func.config.runtime}，当前支持环境：${validRuntime.join(', ')}`);
    }
    if (!zipFile) {
        let zipFilePath = '';
        const funcPath = path_1.default.join(root, 'functions', funcName);
        if (func.config.runtime === 'Java8') {
            zipFilePath = getJavaZipFilePath(funcPath, funcName);
        }
        else {
            if (!fs_1.default.existsSync(funcPath)) {
                throw new error_1.TcbError(`${funcName} 函数文件不存在，部署终止`);
            }
            const distPath = `${funcPath}/dist`;
            packer = new function_pack_1.FunctionPack(funcPath, distPath);
            await packer.clean();
            await packer.build(funcName);
            zipFilePath = path_1.default.join(distPath, 'dist.zip');
        }
        base64 = fs_1.default.readFileSync(zipFilePath).toString('base64');
    }
    else {
        base64 = zipFile;
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
    envVariables.length && (params.Environment = { Variables: envVariables });
    params.Timeout = func.config.timeout || 3;
    params.Runtime = func.config.runtime || 'Nodejs8.9';
    params.Handler = func.handler || 'index.main';
    const uploadSpin = ora_1.default('云函数上传中').start();
    console.log(params);
    try {
        await tencentcloudScfRequest('CreateFunction', params);
        !zipFile && packer && (await packer.clean());
        uploadSpin.succeed(`函数 "${funcName}" 上传成功！`);
        await createFunctionTriggers({
            functionName: funcName,
            triggers: func.triggers,
            envId
        });
        logger_1.successLog(`[${funcName}] 云函数部署成功!`);
    }
    catch (e) {
        if (e.code === 'ResourceInUse.FunctionName' && force) {
            await tencentcloudScfRequest('UpdateFunctionCode', params);
            uploadSpin.succeed(`已存在同名函数 "${funcName}"，覆盖成功！`);
            await createFunctionTriggers({
                functionName: funcName,
                triggers: func.triggers,
                envId
            });
            logger_1.successLog(`[${funcName}] 云函数部署成功!`);
        }
        if (e.message && !force) {
            uploadSpin.fail(chalk_1.default.red(`[${funcName}] 部署失败： ${e.message}`));
            !zipFile && packer && (await packer.clean());
        }
    }
}
exports.createFunction = createFunction;
async function batchCreateFunctions(options) {
    const { functions, root, envId, force } = options;
    const promises = functions.map(func => (async () => {
        try {
            await createFunction({
                func,
                root,
                envId,
                force
            });
        }
        catch (e) {
            throw new error_1.TcbError(e.message);
        }
    })());
    await Promise.all(promises);
}
exports.batchCreateFunctions = batchCreateFunctions;
async function listFunction(options) {
    const { limit = 20, offset = 0, envId } = options;
    const res = await tencentcloudScfRequest('ListFunctions', {
        Namespace: envId,
        Limit: limit,
        Offset: offset
    });
    const { Functions = [] } = res;
    const data = [];
    Functions.forEach(func => {
        const { FunctionName, Runtime, AddTime, Description } = func;
        data.push({
            FunctionName,
            Runtime,
            AddTime,
            Description
        });
    });
    return data;
}
exports.listFunction = listFunction;
async function deleteFunction({ functionName, envId }) {
    try {
        await tencentcloudScfRequest('DeleteFunction', {
            FunctionName: functionName,
            Namespace: envId
        });
        logger_1.successLog(`删除函数 [${functionName}] 成功！`);
    }
    catch (e) {
        throw new error_1.TcbError(`[${functionName}] 删除操作失败：${e.message}！`);
    }
}
exports.deleteFunction = deleteFunction;
async function batchDeleteFunctions({ names, envId }) {
    const promises = names.map(name => (async () => {
        try {
            await deleteFunction({ functionName: name, envId });
        }
        catch (e) {
            throw new error_1.TcbError(e.message);
        }
    })());
    await Promise.all(promises);
}
exports.batchDeleteFunctions = batchDeleteFunctions;
async function getFunctionDetail(options) {
    const { functionName, envId } = options;
    const res = await tencentcloudScfRequest('GetFunction', {
        FunctionName: functionName,
        Namespace: envId
    });
    const data = {};
    const validKeys = [
        'Status',
        'CodeInfo',
        'CodeSize',
        'Description',
        'Environment',
        'FunctionName',
        'FunctionVersion',
        'Handler',
        'MemorySize',
        'ModTime',
        'Namespace',
        'Runtime',
        'Timeout',
        'Triggers'
    ];
    Object.keys(res).forEach(key => {
        if (!validKeys.includes(key))
            return;
        data[key] = res[key];
    });
    return data;
}
exports.getFunctionDetail = getFunctionDetail;
async function batchGetFunctionsDetail({ names, envId }) {
    const data = [];
    const promises = names.map(name => (async () => {
        try {
            const info = await getFunctionDetail({
                name,
                envId
            });
            data.push(info);
        }
        catch (e) {
            throw new error_1.TcbError(`${name} 获取信息失败：${e.message}`);
        }
    })());
    await Promise.all(promises);
    return data;
}
exports.batchGetFunctionsDetail = batchGetFunctionsDetail;
async function getFunctionLog(options) {
    const { envId } = options;
    const params = {
        Namespace: envId
    };
    Object.keys(options).forEach(key => {
        if (key === 'envId')
            return;
        const keyFirstCharUpperCase = key.charAt(0).toUpperCase() + key.slice(1);
        params[keyFirstCharUpperCase] = options[key];
    });
    const { Data = [] } = await tencentcloudScfRequest('GetFunctionLogs', params);
    return Data;
}
exports.getFunctionLog = getFunctionLog;
async function updateFunctionConfig(options) {
    const { functionName, config, envId } = options;
    const envVariables = Object.keys(config.envVariables || {}).map(key => ({
        Key: key,
        Value: config.envVariables[key]
    }));
    const params = {
        FunctionName: functionName,
        Namespace: envId
    };
    envVariables.length && (params.Environment = { Variables: envVariables });
    config.timeout && (params.Timeout = config.timeout);
    await tencentcloudScfRequest('UpdateFunctionConfiguration', params);
}
exports.updateFunctionConfig = updateFunctionConfig;
async function batchUpdateFunctionConfig(options) {
    const { functions, envId } = options;
    const promises = functions.map(func => (async () => {
        try {
            await updateFunctionConfig({
                functionName: func.name,
                config: func.config,
                envId
            });
        }
        catch (e) {
            throw new error_1.TcbError(`${func.name} 更新配置失败：${e.message}`);
        }
    })());
    await Promise.all(promises);
}
exports.batchUpdateFunctionConfig = batchUpdateFunctionConfig;
async function invokeFunction(options) {
    const { functionName, envId, params = {} } = options;
    const _params = {
        FunctionName: functionName,
        Namespace: envId,
        ClientContext: JSON.stringify(params)
    };
    const { Result } = await tencentcloudScfRequest('Invoke', _params);
    logger_1.successLog(`${functionName} 调用成功\n响应结果：\n`);
    console.log(Result);
    return Result;
}
exports.invokeFunction = invokeFunction;
async function batchInvokeFunctions(options) {
    const { functions, envId } = options;
    const promises = functions.map(func => (async () => {
        try {
            await invokeFunction({
                functionName: func.name,
                params: func.params,
                envId
            });
        }
        catch (e) {
            throw new error_1.TcbError(`${func.name} 函数调用失败：${e.message}`);
        }
    })());
    await Promise.all(promises);
}
exports.batchInvokeFunctions = batchInvokeFunctions;
