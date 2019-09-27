"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const logger_1 = require("../logger");
const error_1 = require("../error");
const vpc_1 = require("./vpc");
__export(require("./create"));
__export(require("./trigger"));
const scfService = new utils_1.CloudService('scf', '2018-04-16', {
    Role: 'TCB_QcsRole',
    Stamp: 'MINI_QCBASE'
});
async function listFunction(options) {
    const { limit = 20, offset = 0, envId } = options;
    const res = await scfService.request('ListFunctions', {
        Namespace: envId,
        Limit: limit,
        Offset: offset
    });
    const { Functions = [] } = res;
    const data = [];
    Functions.forEach(func => {
        const { FunctionId, FunctionName, Runtime, AddTime, ModTime, Status } = func;
        data.push({
            FunctionId,
            FunctionName,
            Runtime,
            AddTime,
            ModTime,
            Status
        });
    });
    return data;
}
exports.listFunction = listFunction;
async function deleteFunction({ functionName, envId }) {
    try {
        await scfService.request('DeleteFunction', {
            FunctionName: functionName,
            Namespace: envId
        });
    }
    catch (e) {
        throw new error_1.CloudBaseError(`[${functionName}] 删除操作失败：${e.message}！`);
    }
}
exports.deleteFunction = deleteFunction;
async function batchDeleteFunctions({ names, envId }) {
    const promises = names.map(name => (async () => {
        try {
            await deleteFunction({ functionName: name, envId });
            logger_1.successLog(`[${name}] 函数删除成功！`);
        }
        catch (e) {
            throw new error_1.CloudBaseError(e.message);
        }
    })());
    await Promise.all(promises);
}
exports.batchDeleteFunctions = batchDeleteFunctions;
async function getFunctionDetail(options) {
    const { functionName, envId, codeSecret } = options;
    const res = await scfService.request('GetFunction', {
        FunctionName: functionName,
        Namespace: envId,
        ShowCode: 'TRUE',
        CodeSecret: codeSecret
    });
    const data = {};
    const validKeys = [
        'Status',
        'CodeInfo',
        'CodeSize',
        'Environment',
        'FunctionName',
        'Handler',
        'MemorySize',
        'ModTime',
        'Namespace',
        'Runtime',
        'Timeout',
        'Triggers',
        'VpcConfig'
    ];
    Object.keys(res).forEach(key => {
        if (!validKeys.includes(key))
            return;
        data[key] = res[key];
    });
    const { VpcId = '', SubnetId = '' } = data.VpcConfig || {};
    if (VpcId && SubnetId) {
        try {
            const vpcs = await vpc_1.getVpcs();
            const subnets = await vpc_1.getSubnets(VpcId);
            const vpc = vpcs.find(item => item.VpcId === VpcId);
            const subnet = subnets.find(item => item.SubnetId === SubnetId);
            data.VpcConfig = {
                vpc,
                subnet
            };
        }
        catch (e) {
            data.VPC = {
                vpc: '',
                subnet: ''
            };
        }
    }
    return data;
}
exports.getFunctionDetail = getFunctionDetail;
async function batchGetFunctionsDetail({ names, envId, codeSecret }) {
    const data = [];
    const promises = names.map(name => (async () => {
        try {
            const info = await getFunctionDetail({
                name,
                envId,
                codeSecret
            });
            data.push(info);
        }
        catch (e) {
            throw new error_1.CloudBaseError(`${name} 获取信息失败：${e.message}`);
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
    const { Data = [] } = await scfService.request('GetFunctionLogs', params);
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
    config.runtime && (params.Runtime = config.runtime);
    params.VpcConfig = {
        SubnetId: (config.vpc && config.vpc.subnetId) || '',
        VpcId: (config.vpc && config.vpc.vpcId) || ''
    };
    await scfService.request('UpdateFunctionConfiguration', params);
}
exports.updateFunctionConfig = updateFunctionConfig;
async function batchUpdateFunctionConfig(options) {
    const { functions, envId, log } = options;
    const promises = functions.map(func => (async () => {
        try {
            await updateFunctionConfig({
                functionName: func.name,
                config: func.config,
                envId
            });
            log && logger_1.successLog(`[${func.name}] 更新云函数配置成功！`);
        }
        catch (e) {
            throw new error_1.CloudBaseError(`${func.name} 更新配置失败：${e.message}`);
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
        ClientContext: JSON.stringify(params),
        LogType: 'Tail'
    };
    try {
        const { Result } = await scfService.request('Invoke', _params);
        return Result;
    }
    catch (e) {
        throw new error_1.CloudBaseError(`[${functionName}] 调用失败：\n${e.message}`);
    }
}
exports.invokeFunction = invokeFunction;
async function batchInvokeFunctions(options) {
    const { functions, envId, log = false } = options;
    const promises = functions.map(func => (async () => {
        try {
            const result = await invokeFunction({
                functionName: func.name,
                params: func.params,
                envId
            });
            if (log) {
                logger_1.successLog(`[${func.name}] 调用成功\n响应结果：\n`);
                console.log(result);
            }
            return result;
        }
        catch (e) {
            throw new error_1.CloudBaseError(`${func.name} 函数调用失败：${e.message}`);
        }
    })());
    return await Promise.all(promises);
}
exports.batchInvokeFunctions = batchInvokeFunctions;
async function copyFunction(options) {
    const { envId, functionName, newFunctionName, targetEnvId, force, codeSecret } = options;
    if (!envId || !functionName || !newFunctionName) {
        throw new error_1.CloudBaseError('参数缺失');
    }
    await scfService.request('CopyFunction', {
        FunctionName: functionName,
        NewFunctionName: newFunctionName,
        Namespace: envId,
        TargetNamespace: targetEnvId || envId,
        Override: force ? true : false,
        CodeSecret: codeSecret
    });
}
exports.copyFunction = copyFunction;
