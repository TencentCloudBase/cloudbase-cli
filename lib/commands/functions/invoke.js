"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const error_1 = require("../../error");
const logger_1 = require("../../logger");
const function_1 = require("../../function");
async function invoke(ctx, jsonStringParams) {
    const { name, envId, functions } = ctx;
    let isBatchInvoke = false;
    if (!name) {
        const { isBatch } = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '无云函数名称，是否需要触发配置文件中的全部云函数？',
            default: false
        });
        isBatchInvoke = isBatch;
        if (!isBatchInvoke) {
            throw new error_1.CloudBaseError('请指定云函数名称！');
        }
    }
    let params;
    if (jsonStringParams) {
        try {
            params = JSON.parse(jsonStringParams);
        }
        catch (e) {
            console.log(e);
            throw new error_1.CloudBaseError('jsonStringParams 参数不是正确的 JSON 字符串');
        }
    }
    if (isBatchInvoke) {
        return await function_1.batchInvokeFunctions({
            envId,
            functions,
            log: true
        });
    }
    const func = functions.find(item => item.name === name);
    const configParams = func && func.params ? func.params : undefined;
    const result = await function_1.invokeFunction({
        envId,
        functionName: name,
        params: params || configParams
    });
    logger_1.successLog(`[${name}] 调用成功\n响应结果：\n`);
    console.log(result);
}
exports.invoke = invoke;
