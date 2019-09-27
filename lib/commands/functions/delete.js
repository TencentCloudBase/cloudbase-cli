"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const error_1 = require("../../error");
const function_1 = require("../../function");
const logger_1 = require("../../logger");
const env_1 = require("../../env");
async function deleteFunc(ctx) {
    const { name, envId, functions } = ctx;
    const envInfo = await env_1.getEnvInfo(envId);
    if (envInfo.Source === 'miniapp') {
        throw new error_1.CloudBaseError('无法删除小程序云函数！');
    }
    let isBatchDelete = false;
    if (!name) {
        const answer = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '无云函数名称，是否需要删除配置文件中的全部云函数？',
            default: false
        });
        if (answer.isBatch) {
            const { reConfirm } = await inquirer_1.default.prompt({
                type: 'confirm',
                name: 'reConfirm',
                message: '确定要删除配置文件中的全部云函数？',
                default: false
            });
            isBatchDelete = reConfirm;
        }
        if (!isBatchDelete) {
            throw new error_1.CloudBaseError('请指定需要删除的云函数名称！');
        }
    }
    if (isBatchDelete) {
        const names = functions.map(item => item.name);
        return await function_1.batchDeleteFunctions({
            names,
            envId
        });
    }
    await function_1.deleteFunction({
        envId,
        functionName: name
    });
    logger_1.successLog(`删除函数 [${name}] 成功！`);
}
exports.deleteFunc = deleteFunc;
