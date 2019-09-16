"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const function_1 = require("../../function");
const logger_1 = require("../../logger");
const error_1 = require("../../error");
async function copy(ctx, newFunctionName, targentEnvId, options) {
    const { name, envId } = ctx;
    const { force } = options;
    if (!name || !newFunctionName) {
        throw new error_1.CloudBaseError('请指定函数名称！');
    }
    await function_1.copyFunction({
        force,
        envId,
        newFunctionName,
        functionName: name,
        targetEnvId: targentEnvId || envId
    });
    logger_1.successLog('拷贝函数成功');
}
exports.copy = copy;
