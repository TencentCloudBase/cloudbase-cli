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
const inquirer_1 = __importDefault(require("inquirer"));
const common_1 = require("../common");
const logger_1 = require("../../logger");
const error_1 = require("../../error");
const function_1 = require("../../function");
const decorators_1 = require("../../decorators");
let CreateTrigger = class CreateTrigger extends common_1.Command {
    get options() {
        return {
            cmd: 'functions:trigger:create [functionName]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '创建云函数触发器'
        };
    }
    execute(ctx, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { envId, config: { functions } } = ctx;
            const name = params === null || params === void 0 ? void 0 : params[0];
            let isBatchCreateTrigger = false;
            if (!name) {
                const { isBatch } = yield inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'isBatch',
                    message: '无云函数名称，是否需要部署配置文件中的【全部云函数】的全部触发器？',
                    default: false
                });
                isBatchCreateTrigger = isBatch;
                if (!isBatchCreateTrigger) {
                    throw new error_1.CloudBaseError('请指定云函数名称！');
                }
            }
            if (isBatchCreateTrigger) {
                return function_1.batchCreateTriggers({
                    envId,
                    functions
                });
            }
            const functionItem = functions.find((item) => item.name === name);
            if (!functionItem) {
                throw new error_1.CloudBaseError('未找到相关函数配置，请检查函数名是否正确');
            }
            const { triggers } = functionItem;
            if (!triggers || !triggers.length) {
                throw new error_1.CloudBaseError('触发器配置不能为空');
            }
            yield function_1.createFunctionTriggers({
                envId,
                functionName: name,
                triggers
            });
            logger_1.successLog(`[${name}] 创建云函数触发器成功！`);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.CmdContext()), __param(1, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CreateTrigger.prototype, "execute", null);
CreateTrigger = __decorate([
    common_1.ICommand()
], CreateTrigger);
exports.CreateTrigger = CreateTrigger;
