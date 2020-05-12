"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const common_1 = require("../common");
const error_1 = require("../../error");
const function_1 = require("../../function");
const decorators_1 = require("../../decorators");
let FunctionLog = class FunctionLog extends common_1.Command {
    get options() {
        return {
            cmd: 'functions:log <name>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                { flags: '-i, --reqId <reqId>', desc: '函数请求 Id' },
                {
                    flags: '-o, --offset <offset>',
                    desc: '数据的偏移量，Offset + Limit不能大于10000'
                },
                {
                    flags: '-l, --limit <limit>',
                    desc: '返回数据的长度，Offset + Limit不能大于10000'
                },
                {
                    flags: '--order <order>',
                    desc: '以升序还是降序的方式对日志进行排序，可选值 desc 和 asc'
                },
                {
                    flags: '--orderBy <orderBy>',
                    desc: '根据某个字段排序日志,支持以下字段：function_name, duration, mem_usage, start_time'
                },
                {
                    flags: '--startTime <startTime>',
                    desc: '查询的具体日期，例如：2019-05-16 20:00:00，只能与 endtime 相差一天之内'
                },
                {
                    flags: '--endTime <endTime>',
                    desc: '查询的具体日期，例如：2019-05-16 20:59:59，只能与 startTime 相差一天之内'
                },
                { flags: '-e, --error', desc: '只返回错误类型的日志' },
                { flags: '-s, --success', desc: '只返回正确类型的日志' }
            ],
            desc: '打印云函数日志'
        };
    }
    execute(ctx, argsParams, log) {
        return __awaiter(this, void 0, void 0, function* () {
            const { envId, options } = ctx;
            const name = argsParams === null || argsParams === void 0 ? void 0 : argsParams[0];
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
            log.success(chalk_1.default.green(`函数：${name} 调用日志：\n`));
            if (logs.length === 0) {
                return log.info('无调用日志');
            }
            logs.forEach((log) => {
                const info = Object.keys(ResMap)
                    .map((key) => {
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
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.CmdContext()), __param(1, decorators_1.ArgsParams()), __param(2, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], FunctionLog.prototype, "execute", null);
FunctionLog = __decorate([
    common_1.ICommand()
], FunctionLog);
exports.FunctionLog = FunctionLog;
