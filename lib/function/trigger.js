"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const logger_1 = require("../logger");
const error_1 = require("../error");
const scfService = new utils_1.CloudService('scf', '2018-04-16', {
    Role: 'TCB_QcsRole',
    Stamp: 'MINI_QCBASE'
});
async function createFunctionTriggers(options) {
    const { functionName, triggers = [], envId } = options;
    const parsedTriggers = triggers.map(item => {
        if (item.type !== 'timer') {
            throw new error_1.CloudBaseError(`不支持的触发器类型 [${item.type}]，目前仅支持定时触发器（timer）！`);
        }
        return {
            TriggerName: item.name,
            Type: item.type,
            TriggerDesc: item.config
        };
    });
    try {
        await scfService.request('BatchCreateTrigger', {
            FunctionName: functionName,
            Namespace: envId,
            Triggers: JSON.stringify(parsedTriggers),
            Count: parsedTriggers.length
        });
    }
    catch (e) {
        throw new error_1.CloudBaseError(`[${functionName}] 创建触发器失败：${e.message}`);
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
            logger_1.successLog(`[${func.name}] 创建云函数触发器成功！`);
        }
        catch (e) {
            throw new error_1.CloudBaseError(e.message);
        }
    })());
    await Promise.all(promises);
}
exports.batchCreateTriggers = batchCreateTriggers;
async function deleteFunctionTrigger(options) {
    const { functionName, triggerName, envId } = options;
    try {
        await scfService.request('DeleteTrigger', {
            FunctionName: functionName,
            Namespace: envId,
            TriggerName: triggerName,
            Type: 'timer'
        });
        logger_1.successLog(`[${functionName}] 删除云函数触发器 ${triggerName} 成功！`);
    }
    catch (e) {
        throw new error_1.CloudBaseError(`[${functionName}] 删除触发器失败：${e.message}`);
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
            throw new error_1.CloudBaseError(e.message);
        }
    })());
    await Promise.all(promises);
}
exports.batchDeleteTriggers = batchDeleteTriggers;
