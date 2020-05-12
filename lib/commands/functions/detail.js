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
const utils_1 = require("../../utils");
const decorators_1 = require("../../decorators");
const StatusMap = {
    Active: '部署完成',
    Creating: '创建中',
    CreateFailed: '创建失败',
    Updating: '更新中',
    UpdateFailed: '更新失败'
};
let FunctionDetail = class FunctionDetail extends common_1.Command {
    get options() {
        return {
            cmd: 'functions:detail <name>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '--code-secret <codeSecret>',
                    desc: '代码加密的函数的 CodeSecret'
                }
            ],
            desc: '获取云函数信息'
        };
    }
    execute(ctx, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { envId, options } = ctx;
            const { codeSecret } = options;
            const name = params === null || params === void 0 ? void 0 : params[0];
            if (!name) {
                throw new error_1.CloudBaseError('请指定云函数名称！');
            }
            const loading = utils_1.loadingFactory();
            loading.start('获取函数信息中...');
            try {
                const data = yield function_1.getFunctionDetail({
                    envId,
                    functionName: name,
                    codeSecret
                });
                loading.stop();
                this.logDetail(data, name);
            }
            catch (e) {
                if (e.code === 'ResourceNotFound.FunctionName') {
                    throw new error_1.CloudBaseError(`[${name}] 函数不存在`);
                }
                throw e;
            }
            finally {
                loading.stop();
            }
        });
    }
    logDetail(info, name, log) {
        const ResMap = {
            Namespace: '环境 Id',
            FunctionName: '函数名称',
            Status: '状态',
            CodeSize: '代码大小（B）',
            Environment: '环境变量(key=value)',
            Handler: '执行方法',
            MemorySize: '内存配置(MB)',
            Runtime: '运行环境',
            Timeout: '超时时间(S)',
            VpcConfig: '网络配置',
            Triggers: '触发器',
            ModTime: '修改时间',
            InstallDependency: '自动安装依赖'
        };
        const head = ['信息', '值'];
        const tableData = Object.keys(ResMap).map((key) => {
            if (key === 'Status') {
                return [ResMap[key], StatusMap[info[key]]];
            }
            if (key === 'Environment') {
                const data = info[key].Variables.map((item) => `${item.Key}=${item.Value}`).join('; ') ||
                    '无';
                return [ResMap[key], data];
            }
            if (key === 'Triggers') {
                let data = info[key]
                    .map((item) => `${item.TriggerName}：${item.TriggerDesc}`)
                    .join('\n');
                data = data.length ? `${data}\n` : '无';
                return [ResMap[key], data];
            }
            if (key === 'VpcConfig') {
                const { vpc, subnet } = info[key];
                if (typeof vpc === 'string') {
                    return [ResMap[key], `${vpc}/${subnet}`];
                }
                else if (vpc && subnet) {
                    const data = `${vpc.VpcId}(${vpc.VpcName} | ${subnet.CidrBlock}) / ${subnet.SubnetId}(${subnet.SubnetName})`;
                    return [ResMap[key], data];
                }
                else {
                    return [ResMap[key], '无'];
                }
            }
            if (key === 'CodeInfo') {
                return [ResMap[key], info[key]];
            }
            return [ResMap[key], info[key]];
        });
        if (info.StatusDesc) {
            tableData.push(['状态描述', info.StatusDesc]);
        }
        log.info(chalk_1.default.green(`云函数 [${name}] 详情：`));
        utils_1.printHorizontalTable(head, tableData);
        log.info('函数代码（Java 函数以及入口大于 1 M 的函数不会显示）\n');
        log.log(info['CodeInfo']);
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.CmdContext()), __param(1, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FunctionDetail.prototype, "execute", null);
__decorate([
    decorators_1.InjectParams(),
    __param(2, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, decorators_1.Logger]),
    __metadata("design:returntype", void 0)
], FunctionDetail.prototype, "logDetail", null);
FunctionDetail = __decorate([
    common_1.ICommand()
], FunctionDetail);
exports.FunctionDetail = FunctionDetail;
