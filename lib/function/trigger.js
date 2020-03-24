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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const logger_1 = require("../logger");
const error_1 = require("../error");
const scfService = utils_1.CloudApiService.getInstance('scf');
function createFunctionTriggers(options) {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield scfService.request('BatchCreateTrigger', {
                FunctionName: functionName,
                Namespace: envId,
                Triggers: JSON.stringify(parsedTriggers),
                Count: parsedTriggers.length
            });
        }
        catch (e) {
            throw new error_1.CloudBaseError(`[${functionName}] 创建触发器失败：${e.message}`, {
                action: e.action,
                code: e.code
            });
        }
    });
}
exports.createFunctionTriggers = createFunctionTriggers;
function batchCreateTriggers(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { functions, envId } = options;
        const promises = functions.map(func => (() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield createFunctionTriggers({
                    functionName: func.name,
                    triggers: func.triggers,
                    envId
                });
                logger_1.successLog(`[${func.name}] 创建云函数触发器成功！`);
            }
            catch (e) {
                throw new error_1.CloudBaseError(e.message);
            }
        }))());
        yield Promise.all(promises);
    });
}
exports.batchCreateTriggers = batchCreateTriggers;
function deleteFunctionTrigger(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { functionName, triggerName, envId } = options;
        try {
            yield scfService.request('DeleteTrigger', {
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
    });
}
exports.deleteFunctionTrigger = deleteFunctionTrigger;
function batchDeleteTriggers(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { functions, envId } = options;
        const promises = functions.map(func => (() => __awaiter(this, void 0, void 0, function* () {
            try {
                func.triggers.forEach((trigger) => __awaiter(this, void 0, void 0, function* () {
                    yield deleteFunctionTrigger({
                        functionName: func.name,
                        triggerName: trigger.name,
                        envId
                    });
                }));
            }
            catch (e) {
                throw new error_1.CloudBaseError(e.message);
            }
        }))());
        yield Promise.all(promises);
    });
}
exports.batchDeleteTriggers = batchDeleteTriggers;
