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
exports.CreateRun = void 0;
const enquirer_1 = require("enquirer");
const common_1 = require("../common");
const error_1 = require("../../error");
const run_1 = require("../../run");
const utils_1 = require("../../utils");
const decorators_1 = require("../../decorators");
const validator_1 = require("../../utils/validator");
const ZoneMap = {
    'shanghai': '上海',
    'guangzhou': '广州'
};
let CreateRun = class CreateRun extends common_1.Command {
    get options() {
        return {
            cmd: 'run',
            childCmd: 'create',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-n, --name <name>',
                    desc: '服务名称'
                }
            ],
            desc: '创建云托管服务'
        };
    }
    execute(envId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let { name, remark } = options;
            let vpcInfo = { VpcId: '', SubnetIds: [], CreateType: 1 };
            let logType = 'cls';
            let esInfo = { Ip: '', Port: 65535, Index: '', Account: '', Password: '' };
            let publicAccess = 1;
            let imageRepo;
            const loading = utils_1.loadingFactory();
            if (!name) {
                name = (yield enquirer_1.prompt({
                    type: 'input',
                    name: 'name',
                    message: '请输入服务的名称',
                })).name;
                if (name.length === 0)
                    throw new error_1.CloudBaseError('请输入合法有效的名字');
            }
            if (!remark) {
                remark = (yield enquirer_1.prompt({
                    type: 'input',
                    name: 'remark',
                    message: '请输入服务的备注',
                })).remark;
            }
            if ((yield enquirer_1.prompt({
                type: 'select',
                name: 'createType',
                message: '请选择云托管网络',
                choices: ['系统创建', '选择已有私有网络']
            })).createType === '选择已有私有网络') {
                vpcInfo.CreateType = 2;
                const vpcs = yield run_1.getVpcs();
                const { vpc } = (yield enquirer_1.prompt({
                    type: 'select',
                    name: 'vpc',
                    message: '请选择私有网络',
                    choices: vpcs.map(item => `${item.VpcId}|${item.VpcName}|${item.CidrBlock}`)
                }));
                vpcInfo.VpcId = vpc.split('|')[0];
                const subnets = yield run_1.getSubnets(vpcInfo.VpcId);
                const { subnet } = (yield enquirer_1.prompt({
                    type: 'multiselect',
                    name: 'subnet',
                    message: '请选择子网（空格选择）',
                    choices: subnets.map(item => `${item.SubnetId}|${item.SubnetName}|${item.CidrBlock}|${ZoneMap[item.Zone.split('-')[1]]}|${item.TotalIpAddressCount}剩余IP`)
                }));
                if (subnet.length === 0)
                    throw new error_1.CloudBaseError('请至少选择一个子网');
                vpcInfo.SubnetIds = subnet.map(item => item.split('|')[0]);
            }
            if ((yield enquirer_1.prompt({
                type: 'select',
                name: 'imageRepoType',
                message: '请选择镜像仓库类型',
                choices: ['使用系统默认', '绑定腾讯云已有镜像仓库']
            })).imageRepoType === '绑定腾讯云已有镜像仓库') {
                const imageRepos = yield run_1.getImageRepo();
                if (imageRepos.length === 0)
                    throw new error_1.CloudBaseError('没有可以绑定的镜像仓库');
                imageRepo = (yield enquirer_1.prompt({
                    type: 'select',
                    name: 'imageInfo',
                    message: '请选择镜像仓库',
                    choices: imageRepos.map(item => `${item.RepoName}|${item.RepoType}|${item.Description}`)
                })).imageInfo.split('|')[0];
            }
            if ((yield enquirer_1.prompt({
                type: 'select',
                name: 'logType',
                message: '选择日志管理方式',
                choices: ['系统默认', '自定义ElasticSearch']
            })).logType === '自定义ElasticSearch') {
                logType = 'es';
                let { esIp } = (yield enquirer_1.prompt({
                    type: 'input',
                    name: 'esIp',
                    message: '请输入ES-IP',
                }));
                if (!validator_1.validateIp(esIp))
                    throw new error_1.CloudBaseError('请输入合法有效的IP');
                esInfo.Ip = esIp;
                let { port } = (yield enquirer_1.prompt({
                    type: 'input',
                    name: 'port',
                    message: '请输入ES-端口',
                }));
                if (isNaN(Number(port)) || Number(port) < 0 || Number(port) > 65535)
                    throw new error_1.CloudBaseError('请输入合法有效的端口号');
                esInfo.Port = Number(port);
                let { index } = (yield enquirer_1.prompt({
                    type: 'input',
                    name: 'index',
                    message: '请输入ES-索引',
                }));
                if (index.length === 0)
                    throw new error_1.CloudBaseError('请输入合法有效的索引');
                esInfo.Index = index;
                let { account } = (yield enquirer_1.prompt({
                    type: 'input',
                    name: 'account',
                    message: '请输入ES-账号',
                }));
                if (account.length === 0)
                    throw new error_1.CloudBaseError('请输入合法有效的账号');
                esInfo.Account = account;
                let { pw } = (yield enquirer_1.prompt({
                    type: 'input',
                    name: 'pw',
                    message: '请输入ES-密码',
                }));
                if (pw.length === 0)
                    throw new error_1.CloudBaseError('请输入合法有效的密码');
                esInfo.Password = pw;
            }
            if ((yield enquirer_1.prompt({
                type: 'select',
                name: 'publicAccess',
                message: '请选择是否开启公网访问服务',
                choices: ['是', '否']
            })).publicAccess === '否')
                publicAccess = 2;
            const res = yield run_1.createRun({
                envId,
                name,
                remark,
                vpcInfo,
                imageRepo,
                logType,
                esInfo,
                publicAccess,
                isPublic: true
            });
            if (res === 'succ')
                loading.succeed(`云托管服务 ${name} 创建成功！`);
            else
                throw new error_1.CloudBaseError('创建失败，请查看是否已经有同名服务');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CreateRun.prototype, "execute", null);
CreateRun = __decorate([
    common_1.ICommand()
], CreateRun);
exports.CreateRun = CreateRun;
