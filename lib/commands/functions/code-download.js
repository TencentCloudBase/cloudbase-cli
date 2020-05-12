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
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const inquirer_1 = __importDefault(require("inquirer"));
const common_1 = require("../common");
const error_1 = require("../../error");
const decorators_1 = require("../../decorators");
const function_1 = require("../../function");
const utils_1 = require("../../utils");
let CodeDownload = class CodeDownload extends common_1.Command {
    get options() {
        return {
            cmd: 'functions:download <name> [dest]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                { flags: '-l, --limit <limit>', desc: '返回数据长度，默认值为 20' },
                {
                    flags: '--code-secret <codeSecret>',
                    desc: '代码加密的函数的 CodeSecret'
                }
            ],
            desc: '下载云函数代码'
        };
    }
    execute(ctx, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { envId, config, options } = ctx;
            const { codeSecret } = options;
            const name = params === null || params === void 0 ? void 0 : params[0];
            const dest = params === null || params === void 0 ? void 0 : params[1];
            if (!name) {
                throw new error_1.CloudBaseError('请指定云函数名称！');
            }
            try {
                yield function_1.getFunctionDetail({
                    envId,
                    codeSecret,
                    functionName: name
                });
            }
            catch (e) {
                if (e.code === 'ResourceNotFound.FunctionName') {
                    throw new error_1.CloudBaseError(`云函数 [${name}] 不存在！\n\n使用 ${utils_1.highlightCommand('cloudbase functions:list')} 命令查看已部署云函数`);
                }
                return;
            }
            let destPath = dest;
            if (!destPath) {
                destPath = path_1.default.resolve(config.functionRoot, name);
                if (utils_1.checkFullAccess(destPath)) {
                    const { override } = yield inquirer_1.default.prompt({
                        type: 'confirm',
                        name: 'override',
                        message: '函数已经存在，是否覆盖原文件？',
                        default: false
                    });
                    if (!override) {
                        throw new error_1.CloudBaseError('下载终止！');
                    }
                    utils_1.delSync([destPath]);
                }
                yield fs_extra_1.default.ensureDir(destPath);
            }
            const loading = utils_1.loadingFactory();
            loading.start('文件下载中...');
            yield function_1.downloadFunctionCode({
                envId,
                functionName: name,
                destPath: destPath,
                codeSecret: codeSecret,
                unzip: true
            });
            loading.succeed(`[${name}] 云函数代码下载成功！`);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.CmdContext()), __param(1, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CodeDownload.prototype, "execute", null);
CodeDownload = __decorate([
    common_1.ICommand()
], CodeDownload);
exports.CodeDownload = CodeDownload;
