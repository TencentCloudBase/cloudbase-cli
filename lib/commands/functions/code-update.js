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
exports.CodeUpdate = void 0;
const path_1 = __importDefault(require("path"));
const common_1 = require("../common");
const error_1 = require("../../error");
const utils_1 = require("../../utils");
const function_1 = require("../../function");
const decorators_1 = require("../../decorators");
let CodeUpdate = class CodeUpdate extends common_1.Command {
    get options() {
        return {
            cmd: 'fn',
            childCmd: {
                cmd: 'code',
                desc: '函数代码管理'
            },
            childSubCmd: 'update <name>',
            deprecateCmd: 'functions:code:update <name>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '--code-secret <codeSecret>',
                    desc: '传入此参数将保护代码，格式为 36 位大小写字母和数字'
                }
            ],
            desc: '更新云函数代码'
        };
    }
    execute(ctx, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { envId, config, options } = ctx;
            const { codeSecret } = options;
            const name = params === null || params === void 0 ? void 0 : params[0];
            if (!name) {
                throw new error_1.CloudBaseError('请指定云函数名称！');
            }
            const func = config.functions.find((item) => item.name === name) || { name };
            const loading = utils_1.loadingFactory();
            loading.start(`[${func.name}] 函数代码更新中...`);
            try {
                yield function_1.updateFunctionCode({
                    func,
                    envId,
                    codeSecret,
                    functionRootPath: path_1.default.join(process.cwd(), config.functionRoot)
                });
                loading.succeed(`[${func.name}] 函数代码更新成功！`);
            }
            catch (e) {
                loading.stop();
                throw e;
            }
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.CmdContext()), __param(1, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CodeUpdate.prototype, "execute", null);
CodeUpdate = __decorate([
    common_1.ICommand()
], CodeUpdate);
exports.CodeUpdate = CodeUpdate;
