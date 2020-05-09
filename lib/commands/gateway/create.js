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
const enquirer_1 = require("enquirer");
const common_1 = require("../common");
const error_1 = require("../../error");
const gateway_1 = require("../../gateway");
const function_1 = require("../../function");
const validator_1 = require("../../utils/validator");
const utils_1 = require("../../utils");
const decorators_1 = require("../../decorators");
let CreateService = class CreateService extends common_1.Command {
    get options() {
        return {
            cmd: 'service:create',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-p, --service-path <servicePath>',
                    desc: 'Service Path，必须以 "/" 开头'
                },
                {
                    flags: '-f, --function <name>',
                    desc: 'HTTP Service 路径绑定的云函数名称'
                }
            ],
            desc: '创建 HTTP Service'
        };
    }
    execute(envId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let { function: functionName, servicePath } = options;
            const loading = utils_1.loadingFactory();
            if (!servicePath || !functionName) {
                loading.start('数据加载中...');
                const functions = yield function_1.listFunction({
                    envId,
                    limit: 100,
                    offset: 0
                });
                loading.stop();
                if (!functions.length) {
                    throw new error_1.CloudBaseError('当前环境下不存在可用的云函数，请先创建云函数！');
                }
                let { name } = yield enquirer_1.prompt({
                    type: 'select',
                    name: 'name',
                    message: '请选择创建 HTTP Service 的云函数',
                    choices: functions.map((item) => item.FunctionName)
                });
                let { path } = yield enquirer_1.prompt({
                    type: 'input',
                    name: 'path',
                    message: '请输入 HTTP Service 路径（以 / 开头）'
                });
                functionName = name;
                servicePath = path;
            }
            validator_1.assertTruthy(servicePath, '请指定需要创建的 HTTP Service 路径！');
            loading.start(`[${functionName}] 云函数 HTTP Service 创建中...`);
            try {
                const functionList = yield function_1.listFunction({
                    envId,
                    limit: 100
                });
                const isExisted = functionList.filter((item) => item.FunctionName === functionName);
                if (isExisted.length <= 0) {
                    throw new error_1.CloudBaseError(`[${functionName}] 云函数不存在！`);
                }
                yield gateway_1.createGateway({
                    envId,
                    path: servicePath,
                    name: functionName
                });
                const link = utils_1.genClickableLink(`https://${envId}.service.tcloudbase.com${servicePath}`);
                loading.succeed(`云函数 HTTP Service 创建成功！\n点击访问> ${link}`);
            }
            catch (e) {
                loading.stop();
                if (e.code === 'InvalidParameter.APICreated') {
                    throw new error_1.CloudBaseError('路径已存在！');
                }
                throw e;
            }
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CreateService.prototype, "execute", null);
CreateService = __decorate([
    common_1.ICommand()
], CreateService);
exports.CreateService = CreateService;
