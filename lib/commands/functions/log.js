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
const error_1 = require("../../error");
const function_1 = require("../../function");
function log(ctx, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, options } = ctx;
        let { offset, limit, order, orderBy, error, success, startTime, endTime, reqId: functionRequestId } = options;
        if (!name) {
            throw new error_1.CloudBaseError('云函数名称不能为空');
        }
        const TimeLength = 19;
        if (typeof startTime !== 'undefined' &&
            typeof endTime !== 'undefined' &&
            (startTime.length !== TimeLength || endTime.length !== TimeLength)) {
            throw new error_1.CloudBaseError('时间格式错误，必须为 2019-05-16 20:59:59 类型');
        }
        if (new Date(endTime).getTime() < new Date(startTime).getTime()) {
            throw new error_1.CloudBaseError('开始时间不能晚于结束时间');
        }
        const OneDay = 86400000;
        if (new Date(endTime).getTime() - new Date(startTime).getTime() > OneDay) {
            throw new error_1.CloudBaseError('endTime 与 startTime 只能相差一天之内');
        }
        let params = {
            order,
            orderBy,
            startTime,
            endTime,
            functionRequestId,
            offset: Number(offset),
            limit: Number(limit)
        };
        error && (params.filter = { RetCode: 'not0' });
        success && (params.filter = { RetCode: 'is0' });
        params = JSON.parse(JSON.stringify(params));
        const logs = yield function_1.getFunctionLog(Object.assign({ envId, functionName: name }, params));
        const ResMap = {
            StartTime: '请求时间',
            FunctionName: '函数名称',
            BillDuration: '计费时间(ms)',
            Duration: '运行时间(ms)',
            InvokeFinished: '调用次数',
            MemUsage: '占用内存',
            RequestId: '请求 Id',
            RetCode: '调用状态',
            RetMsg: '返回结果'
        };
        console.log(chalk_1.default.green(`函数：${name} 调用日志：\n`));
        if (logs.length === 0) {
            return console.log('无调用日志');
        }
        logs.forEach(log => {
            const info = Object.keys(ResMap)
                .map(key => {
                if (key === 'RetCode') {
                    return `${ResMap[key]}：${Number(log[key]) === 0 ? '成功' : '失败'}\n`;
                }
                if (key === 'MemUsage') {
                    const str = Number(Number(log[key]) / 1024 / 1024).toFixed(3);
                    return `${ResMap[key]}：${str} MB\n`;
                }
                return `${ResMap[key]}：${log[key]} \n`;
            })
                .reduce((prev, next) => prev + next);
            console.log(info + `日志：\n ${log.Log} \n`);
        });
    });
}
exports.log = log;
