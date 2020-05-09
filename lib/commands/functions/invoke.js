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
const inquirer_1 = __importDefault(require("inquirer"));
const common_1 = require("../common");
const error_1 = require("../../error");
const function_1 = require("../../function");
const decorators_1 = require("../../decorators");
let InvokeFunction = class InvokeFunction extends common_1.Command {
    get options() {
        return {
            cmd: 'functions:invoke [name]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '--params <params>',
                    desc: '调用函数的入参，JSON 字符串形式'
                }
            ],
            desc: '触发云端部署的云函数'
        };
    }
    execute(ctx, argsParams, log) {
        return __awaiter(this, void 0, void 0, function* () {
            const { envId, config: { functions }, options } = ctx;
            const name = argsParams === null || argsParams === void 0 ? void 0 : argsParams[0];
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
            const func = functions.find((item) => item.name === name);
            const configParams = (func === null || func === void 0 ? void 0 : func.params) ? func.params : undefined;
            const result = yield function_1.invokeFunction({
                envId,
                functionName: name,
                params: params || configParams
            });
            if (result.InvokeResult === 0) {
                log.success(`[${name}] 调用成功\n`);
            }
            else {
                log.error(`[${name}] 调用失败\n`);
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
                .map((key) => {
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
                .filter((item) => item)
                .join('\n');
            console.log(logInfo);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.CmdContext()), __param(1, decorators_1.ArgsParams()), __param(2, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], InvokeFunction.prototype, "execute", null);
InvokeFunction = __decorate([
    common_1.ICommand()
], InvokeFunction);
exports.InvokeFunction = InvokeFunction;
