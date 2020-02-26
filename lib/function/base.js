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
const manager_node_1 = __importDefault(require("@cloudbase/manager-node"));
const utils_1 = require("../utils");
const logger_1 = require("../logger");
const error_1 = require("../error");
const vpc_1 = require("./vpc");
const scfService = utils_1.CloudApiService.getInstance('scf');
function getFunctionService(envId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { secretId, secretKey, token } = yield utils_1.checkAndGetCredential(true);
        const app = new manager_node_1.default({
            secretId,
            secretKey,
            token,
            envId,
            proxy: utils_1.getProxy()
        });
        return app.functions;
    });
}
exports.getFunctionService = getFunctionService;
function listFunction(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { limit = 20, offset = 0, envId } = options;
        const res = yield scfService.request('ListFunctions', {
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
    });
}
exports.listFunction = listFunction;
function getFunctionDetail(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { functionName, envId, codeSecret } = options;
        const res = yield scfService.request('GetFunction', {
            FunctionName: functionName,
            Namespace: envId,
            ShowCode: 'TRUE',
            CodeSecret: codeSecret
        });
        const data = res;
        const { VpcId = '', SubnetId = '' } = data.VpcConfig || {};
        if (VpcId && SubnetId) {
            try {
                const vpcs = yield vpc_1.getVpcs();
                const subnets = yield vpc_1.getSubnets(VpcId);
                const vpc = vpcs.find(item => item.VpcId === VpcId);
                const subnet = subnets.find(item => item.SubnetId === SubnetId);
                data.VpcConfig = {
                    vpc,
                    subnet
                };
            }
            catch (e) {
                data.VpcConfig = {
                    vpc: VpcId,
                    subnet: SubnetId
                };
            }
        }
        return data;
    });
}
exports.getFunctionDetail = getFunctionDetail;
function batchGetFunctionsDetail({ names, envId, codeSecret }) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = [];
        const promises = names.map(name => (() => __awaiter(this, void 0, void 0, function* () {
            try {
                const info = yield getFunctionDetail({
                    envId,
                    codeSecret,
                    functionName: name
                });
                data.push(info);
            }
            catch (e) {
                throw new error_1.CloudBaseError(`${name} 获取信息失败：${e.message}`);
            }
        }))());
        yield Promise.all(promises);
        return data;
    });
}
exports.batchGetFunctionsDetail = batchGetFunctionsDetail;
function getFunctionLog(options) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const { Data = [] } = yield scfService.request('GetFunctionLogs', params);
        return Data;
    });
}
exports.getFunctionLog = getFunctionLog;
function updateFunctionConfig(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { functionName, config, envId } = options;
        const functionService = yield getFunctionService(envId);
        yield functionService.updateFunctionConfig(Object.assign({ name: functionName }, config));
    });
}
exports.updateFunctionConfig = updateFunctionConfig;
function batchUpdateFunctionConfig(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { functions, envId, log } = options;
        const promises = functions.map(func => (() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield updateFunctionConfig({
                    functionName: func.name,
                    config: func,
                    envId
                });
                log && logger_1.successLog(`[${func.name}] 更新云函数配置成功！`);
            }
            catch (e) {
                throw new error_1.CloudBaseError(`${func.name} 更新配置失败：${e.message}`);
            }
        }))());
        yield Promise.all(promises);
    });
}
exports.batchUpdateFunctionConfig = batchUpdateFunctionConfig;
function invokeFunction(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { functionName, envId, params = {} } = options;
        const _params = {
            FunctionName: functionName,
            Namespace: envId,
            ClientContext: JSON.stringify(params),
            LogType: 'Tail'
        };
        try {
            const { Result } = yield scfService.request('Invoke', _params);
            return Result;
        }
        catch (e) {
            throw new error_1.CloudBaseError(`[${functionName}] 调用失败：\n${e.message}`);
        }
    });
}
exports.invokeFunction = invokeFunction;
function batchInvokeFunctions(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { functions, envId, log = false } = options;
        const promises = functions.map(func => (() => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield invokeFunction({
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
        }))());
        return Promise.all(promises);
    });
}
exports.batchInvokeFunctions = batchInvokeFunctions;
function copyFunction(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, functionName, newFunctionName, targetEnvId, force, codeSecret } = options;
        if (!envId || !functionName || !newFunctionName) {
            throw new error_1.CloudBaseError('参数缺失');
        }
        yield scfService.request('CopyFunction', {
            FunctionName: functionName,
            NewFunctionName: newFunctionName,
            Namespace: envId,
            TargetNamespace: targetEnvId || envId,
            Override: force ? true : false,
            CodeSecret: codeSecret
        });
    });
}
exports.copyFunction = copyFunction;
