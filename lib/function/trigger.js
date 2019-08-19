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
    const { functionName: name, triggers = [], envId } = options;
    const parsedTriggers = triggers.map(item => ({
        TriggerName: item.name,
        Type: item.type,
        TriggerDesc: item.config
    }));
    try {
        await scfService.request('BatchCreateTrigger', {
            FunctionName: name,
            Namespace: envId,
            Triggers: JSON.stringify(parsedTriggers),
            Count: parsedTriggers.length
        });
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
        await scfService.request('DeleteTrigger', {
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
