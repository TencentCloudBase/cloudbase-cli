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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const error_1 = require("../../error");
const function_1 = require("../../function");
const decorators_1 = require("../../decorators");
let FunctionCopy = class FunctionCopy extends common_1.Command {
    get options() {
        return {
            cmd: 'functions:copy <name> [newFunctionName]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-t, --target <targetEnvId>',
                    desc: '目标环境 Id'
                },
                {
                    flags: '--force',
                    desc: '如果目标环境下存在同名函数，覆盖原函数'
                }
            ],
            desc: '拷贝云函数'
        };
    }
    execute(envId, options, params, log) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = params === null || params === void 0 ? void 0 : params[0];
            const newFunctionName = params === null || params === void 0 ? void 0 : params[1];
            const { force, codeSecret, targetEnvId } = options;
            if (!name) {
                throw new error_1.CloudBaseError('请指定函数名称！');
            }
            yield function_1.copyFunction({
                force,
                envId,
                codeSecret,
                functionName: name,
                newFunctionName: newFunctionName || name,
                targetEnvId: targetEnvId || envId
            });
            log.success('拷贝函数成功');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()),
    __param(1, decorators_1.ArgsOptions()),
    __param(2, decorators_1.ArgsParams()),
    __param(3, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], FunctionCopy.prototype, "execute", null);
FunctionCopy = __decorate([
    common_1.ICommand()
], FunctionCopy);
exports.FunctionCopy = FunctionCopy;
