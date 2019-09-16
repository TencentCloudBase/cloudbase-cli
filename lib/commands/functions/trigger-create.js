"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const error_1 = require("../../error");
const logger_1 = require("../../logger");
const function_1 = require("../../function");
async function triggerCreate(ctx) {
    const { name, envId, functions } = ctx;
    let isBatchCreateTrigger = false;
    if (!name) {
        const { isBatch } = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '无云函数名称，是否需要部署配置文件中的【全部云函数】的全部触发器？',
            default: false
        });
        isBatchCreateTrigger = isBatch;
        if (!isBatchCreateTrigger) {
            throw new error_1.CloudBaseError('请指定云函数名称！');
        }
    }
    if (isBatchCreateTrigger) {
        return await function_1.batchCreateTriggers({
            envId,
            functions
        });
    }
    const functionItem = functions.find(item => item.name === name);
    if (!functionItem) {
        throw new error_1.CloudBaseError('未找到相关函数配置，请检查函数名是否正确');
    }
    const { triggers } = functionItem;
    if (!triggers || !triggers.length) {
        throw new error_1.CloudBaseError('触发器配置不能为空');
    }
    await function_1.createFunctionTriggers({
        envId,
        functionName: name,
        triggers
    });
    logger_1.successLog(`[${name}] 创建云函数触发器成功！`);
}
exports.triggerCreate = triggerCreate;
