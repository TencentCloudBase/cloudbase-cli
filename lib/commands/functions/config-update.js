"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const error_1 = require("../../error");
const function_1 = require("../../function");
const logger_1 = require("../../logger");
async function configUpdate(ctx) {
    const { name, envId, functions } = ctx;
    let isBathUpdate = false;
    if (!name) {
        const { isBatch } = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '无云函数名称，是否需要更新配置文件中的【全部云函数】的配置？',
            default: false
        });
        isBathUpdate = isBatch;
        if (!isBathUpdate) {
            throw new error_1.CloudBaseError('请指定云函数名称！');
        }
    }
    if (isBathUpdate) {
        await function_1.batchUpdateFunctionConfig({
            envId,
            functions,
            log: true
        });
        return;
    }
    const functionItem = functions.find(item => item.name === name);
    if (!functionItem) {
        throw new error_1.CloudBaseError('未找到相关函数配置，请检查函数名是否正确');
    }
    await function_1.updateFunctionConfig({
        envId,
        functionName: name,
        config: functionItem.config
    });
    logger_1.successLog(`[${name}] 更新云函数配置成功！`);
}
exports.configUpdate = configUpdate;
