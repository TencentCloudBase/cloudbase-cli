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
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const error_1 = require("../../error");
const logger_1 = require("../../logger");
const function_1 = require("../../function");
function invoke(ctx, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, config: { functions }, options } = ctx;
        let isBatchInvoke = false;
        if (!name) {
            const { isBatch } = yield inquirer_1.default.prompt({
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
        const jsonStringParams = options.params;
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
            return function_1.batchInvokeFunctions({
                envId,
                functions,
                log: true
            });
        }
        const func = functions.find(item => item.name === name);
        const configParams = (func === null || func === void 0 ? void 0 : func.params) ? func.params : undefined;
        const result = yield function_1.invokeFunction({
            envId,
            functionName: name,
            params: params || configParams
        });
        if (result.InvokeResult === 0) {
            logger_1.successLog(`[${name}] 调用成功\n`);
        }
        else {
            logger_1.errorLog(`[${name}] 调用失败\n`);
        }
        const ResMap = {
            Duration: '运行时间',
            MemUsage: '内存占用',
            BillDuration: '计费时间',
            FunctionRequestId: '请求 Id ',
            RetMsg: '返回结果',
            ErrMsg: '错误信息',
            Log: '调用日志'
        };
        const formatInfo = Object.assign(Object.assign({}, result), { Duration: Number(result.Duration).toFixed(2) + 'ms', MemUsage: Number(Number(result.MemUsage) / Math.pow(1024, 2)).toFixed(2) + 'MB', BillDuration: result.BillDuration + 'ms' });
        const logInfo = Object.keys(ResMap)
            .map(key => {
            if (key === 'Log') {
                return `${chalk_1.default.bold.cyan(ResMap[key])}：\n${formatInfo[key]}`;
            }
            else if (result.InvokeResult === 0 && key === 'ErrMsg') {
                return false;
            }
            else {
                return `${chalk_1.default.bold.cyan(ResMap[key])}：${formatInfo[key]}`;
            }
        })
            .filter(item => item)
            .join('\n');
        console.log(logInfo);
    });
}
exports.invoke = invoke;
