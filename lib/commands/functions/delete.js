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
const error_1 = require("../../error");
const utils_1 = require("../../utils");
const function_1 = require("../../function");
const decorators_1 = require("../../decorators");
let DeleteFunction = class DeleteFunction extends common_1.Command {
    get options() {
        return {
            cmd: 'functions:delete [name]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '删除云函数'
        };
    }
    execute(ctx, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = params === null || params === void 0 ? void 0 : params[0];
            const { envId, config: { functions } } = ctx;
            let isBatchDelete = false;
            if (!name) {
                const answer = yield inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'isBatch',
                    message: '无云函数名称，是否需要删除配置文件中的全部云函数？',
                    default: false
                });
                if (answer.isBatch) {
                    const { reConfirm } = yield inquirer_1.default.prompt({
                        type: 'confirm',
                        name: 'reConfirm',
                        message: '确定要删除配置文件中的全部云函数？',
                        default: false
                    });
                    isBatchDelete = reConfirm;
                }
                if (!isBatchDelete) {
                    throw new error_1.CloudBaseError('请指定需要删除的云函数名称！');
                }
            }
            if (isBatchDelete) {
                const names = functions.map((item) => item.name);
                return function_1.batchDeleteFunctions({
                    names,
                    envId
                });
            }
            const loading = utils_1.loadingFactory();
            loading.start(`删除函数 [${name}] 中...`);
            yield function_1.deleteFunction({
                envId,
                functionName: name
            });
            loading.succeed(`删除函数 [${name}] 成功！`);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.CmdContext()), __param(1, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeleteFunction.prototype, "execute", null);
DeleteFunction = __decorate([
    common_1.ICommand()
], DeleteFunction);
exports.DeleteFunction = DeleteFunction;
