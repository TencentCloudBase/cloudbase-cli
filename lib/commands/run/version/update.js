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
exports.UpdateVersion = void 0;
const enquirer_1 = require("enquirer");
const fs_1 = require("fs");
const common_1 = require("../../common");
const error_1 = require("../../../error");
const run_1 = require("../../../run");
const utils_1 = require("../../../utils");
const decorators_1 = require("../../../decorators");
const common_2 = require("./common");
const uploadTypeMap = {
    ['本地代码']: 'package',
    ['代码库拉取']: 'repository',
    ['镜像拉取']: 'image'
};
const memMap = {
    0.25: [2, 8],
    0.5: [2, 8],
    1: [1, 8],
    2: [2, 8],
    4: [2, 8],
    8: [2, 4],
    16: [2, 4]
};
const describeVersion = (base) => {
    console.log('目前的配置如下');
    console.log(`镜像名 ${base.ImageUrl.split(':')[1]}`);
    console.log(`上传方式 ${base.UploadType === 'image' ? '镜像拉取' : base.UploadType === 'package' ? '本地代码上传' : '代码仓库拉取'}`);
    console.log(`监听端口 ${base.VersionPort}`);
    console.log(`扩缩容条件 ${base.PolicyType}使用率 > ${base.PolicyThreshold}`);
    console.log(`规格 cpu ${base.Cpu}核 mem ${base.Mem}G`);
    console.log(`InitialDelaySeconds ${base.InitialDelaySeconds}`);
    console.log(`日志采集路径 ${base.InitialDelaySeconds}`);
    console.log(`环境变量 ${base.EnvParams}`);
};
let UpdateVersion = class UpdateVersion extends common_1.Command {
    get options() {
        return Object.assign(Object.assign({}, common_2.versionCommonOptions('update')), { options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '托管服务 name'
                },
                {
                    flags: '-v, --versionName <versionName>',
                    desc: '版本名称 Name'
                }
            ], desc: '创建云开发环境下云托管服务的版本' });
    }
    execute(envId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let { serviceName = '', versionName = '' } = options;
            if (serviceName.length === 0 || versionName.length === 0) {
                throw new error_1.CloudBaseError('必须输入 serviceName 和 versionName');
            }
            let path;
            let repositoryType;
            let branch;
            let codeDetail;
            let imageInfo;
            let containerPort;
            let flowRatio;
            let versionRemark;
            let cpu;
            let mem;
            let minNum;
            let maxNum;
            let policyType;
            let policyThreshold;
            let customLogs = 'stdout';
            let dockerfilePath = 'Dockerfile';
            let initialDelaySeconds = 2;
            let envParams = '{}';
            const uid = utils_1.random(4);
            const loading = utils_1.loadingFactory();
            let base = yield run_1.describeRunVersion({
                envId,
                serverName: serviceName,
                versionName
            });
            describeVersion(base);
            console.log('请填入新的配置');
            let { uploadType } = yield enquirer_1.prompt({
                type: 'select',
                name: 'uploadType',
                choices: ['本地代码', '代码库拉取', '镜像拉取'],
                message: `请选择上传方式`,
            });
            if (uploadType === '本地代码') {
                path = (yield enquirer_1.prompt({
                    type: 'input',
                    name: 'path',
                    message: '请输入文件的路径'
                })).path;
                if (fs_1.statSync(path).isDirectory()) {
                    loading.start('正在压缩中');
                    yield run_1.packDir(path, `./code${uid}.zip`);
                    loading.succeed('压缩完成');
                    path = `./code${uid}.zip`;
                }
            }
            else if (uploadType === '代码库拉取') {
                let { repoType } = yield enquirer_1.prompt({
                    type: 'select',
                    name: 'repoType',
                    choices: ['GitHub', 'Gitee', 'GitLab'],
                    message: '请选择代码库',
                });
                repositoryType = repoType.toLowerCase();
                let pageNumber = 1;
                while (true) {
                    const { IsFinished, RepoList, Error } = yield run_1.listRepo({ channel: repoType.toLowerCase(), pageNumber, pageSize: 50 });
                    if (Error)
                        throw new error_1.CloudBaseError('请检查是否授权');
                    if (!RepoList || RepoList.length === 0)
                        throw new error_1.CloudBaseError('没有可供选择的仓库');
                    const { repoName } = yield enquirer_1.prompt({
                        type: 'select',
                        name: 'repoName',
                        message: '选择仓库',
                        choices: IsFinished ? RepoList.map(item => item.FullName) : [...RepoList.map(item => item.FullName), '下一页']
                    });
                    if (repoName !== '下一页') {
                        codeDetail = { Name: { Name: repoName.split('/')[1], FullName: repoName } };
                        break;
                    }
                    pageNumber++;
                }
                pageNumber = 1;
                while (true) {
                    const { IsFinished, BranchList } = yield run_1.listBranch({
                        channel: repoType.toLowerCase(),
                        pageNumber,
                        pageSize: 50,
                        repoName: codeDetail['Name']
                    });
                    if (!BranchList || BranchList.length === 0)
                        throw new error_1.CloudBaseError('没有可供选择的分支');
                    const { branchName } = yield enquirer_1.prompt({
                        type: 'select',
                        name: 'branchName',
                        message: '选择分支',
                        choices: IsFinished ? BranchList.map(item => item.Name) : [...BranchList.map(item => item.Name), '下一页']
                    });
                    if (branchName !== '下一页') {
                        branch = branch;
                        break;
                    }
                    pageNumber++;
                }
            }
            else {
                let ImageUrl = yield utils_1.pagingSelectPromp('select', run_1.listImage, { envId, serviceName, limit: 0, offset: 0 }, '请选择镜像', item => true, item => item.ImageUrl);
                imageInfo = {
                    ImageUrl: ImageUrl,
                };
            }
            containerPort = Number((yield enquirer_1.prompt({
                type: 'input',
                name: 'port',
                message: '请输入监听端口号'
            })).port);
            cpu = Number((yield enquirer_1.prompt({
                type: 'select',
                name: 'cpu',
                message: '请输入cpu规格（核数）',
                choices: ['0.25', '0.5', '1', '2', '4', '8', '16']
            })).cpu);
            const memList = new Array(memMap[cpu][1] * cpu - Math.floor(memMap[cpu][0] * cpu) + 1)
                .fill(memMap[cpu][1] * cpu)
                .map((item, index, array) => String(item - (array.length - 1 - index)));
            memList[0] = String(Number(memList[0]) <= 0 ? 0.5 : memList[0]);
            mem = Number((yield enquirer_1.prompt({
                type: 'select',
                name: 'mem',
                message: '请输入内存规格（G）',
                choices: memList
            })).mem);
            minNum = Number((yield enquirer_1.prompt({
                type: 'input',
                name: 'num',
                message: '请输入最小副本个数',
            })).num);
            if (Number.isNaN(minNum) || minNum - Math.floor(minNum) !== 0)
                throw new error_1.CloudBaseError('请输入大于等于0的整数');
            maxNum = Number((yield enquirer_1.prompt({
                type: 'input',
                name: 'num',
                message: '请输入最大副本个数',
            })).num);
            if (Number.isNaN(maxNum) || maxNum - Math.floor(maxNum) !== 0)
                throw new error_1.CloudBaseError('请输入大于等于0的整数');
            policyType = (yield enquirer_1.prompt({
                type: 'select',
                name: 'type',
                message: '扩容条件是',
                choices: ['cpu使用率', '内存使用率']
            })).type === 'cpu使用率' ? 'cpu' : 'mem';
            policyThreshold = Number((yield enquirer_1.prompt({
                type: 'input',
                name: 'threshold',
                message: '边界条件值是（%）',
            })).threshold);
            if (Number.isNaN(policyThreshold) || policyThreshold <= 0 || policyThreshold > 100)
                throw new error_1.CloudBaseError('请输入合理的数字');
            if ((yield enquirer_1.prompt({
                type: 'select',
                name: 'type',
                message: '请问是否进行高级设置',
                choices: ['是', '否']
            })).type === '是') {
                if (uploadType !== '镜像拉取') {
                    customLogs = (yield enquirer_1.prompt({
                        type: 'input',
                        name: 'logs',
                        message: '请输入日志采集路径',
                    })).logs;
                }
                dockerfilePath = (yield enquirer_1.prompt({
                    type: 'input',
                    name: 'dockerfile',
                    message: '请输入dockerfile名称',
                })).dockerfile;
                initialDelaySeconds = Number((yield enquirer_1.prompt({
                    type: 'input',
                    name: 'seconds',
                    message: '请输入initialDelaySeconds',
                })).seconds);
                if (Number.isNaN(initialDelaySeconds))
                    throw new error_1.CloudBaseError('请输入正常数字');
                let _envParams = {};
                while (true) {
                    if ((yield enquirer_1.prompt({
                        type: 'select',
                        name: 'flag',
                        message: '请问是否要继续填入环境变量',
                        choices: ['是', '否']
                    })).flag === '否')
                        break;
                    let { key } = yield enquirer_1.prompt({
                        type: 'input',
                        name: 'key',
                        message: '请填入环境变量name',
                    });
                    let { value } = yield enquirer_1.prompt({
                        type: 'input',
                        name: 'value',
                        message: '请填入环境变量value',
                    });
                    _envParams[key] = value;
                }
                envParams = JSON.stringify(_envParams);
            }
            loading.start('加载中...');
            try {
                let res = '', runId = '';
                if (uploadType === '本地代码') {
                    loading.start('正在上传中');
                    let { PackageName, PackageVersion, UploadHeaders, UploadUrl } = yield run_1.createBuild({ envId, serviceName });
                    yield run_1.uploadZip(path, UploadUrl, UploadHeaders[0]);
                    loading.succeed('上传成功');
                    if (path === `./code${uid}.zip`) {
                        loading.start('删除本地压缩包');
                        fs_1.unlinkSync(path);
                        loading.succeed('成功删除本地压缩包');
                    }
                    let response = yield run_1.updateVersion({
                        envId,
                        serverName: serviceName,
                        versionName,
                        containerPort,
                        uploadType: uploadTypeMap[uploadType],
                        packageName: PackageName,
                        packageVersion: PackageVersion,
                        flowRatio,
                        versionRemark,
                        enableUnion: true,
                        cpu,
                        mem,
                        minNum,
                        maxNum,
                        policyType,
                        policyThreshold,
                        customLogs,
                        dockerfilePath,
                        envParams,
                        initialDelaySeconds,
                    });
                    res = response.Result;
                    runId = response.RunId;
                }
                else if (uploadType === '镜像拉取') {
                    let response = yield run_1.updateVersion({
                        envId,
                        serverName: serviceName,
                        versionName,
                        containerPort,
                        uploadType: uploadTypeMap[uploadType],
                        imageInfo,
                        flowRatio,
                        versionRemark,
                        enableUnion: true,
                        cpu,
                        mem,
                        minNum,
                        maxNum,
                        policyType,
                        policyThreshold,
                        customLogs,
                        envParams,
                        initialDelaySeconds,
                    });
                    res = response.Result;
                    runId = response.RunId;
                }
                else {
                    let response = yield run_1.updateVersion({
                        envId,
                        serverName: serviceName,
                        versionName,
                        containerPort,
                        uploadType: uploadTypeMap[uploadType],
                        repositoryType,
                        branch,
                        codeDetail,
                        flowRatio,
                        versionRemark,
                        enableUnion: true,
                        cpu,
                        mem,
                        minNum,
                        maxNum,
                        policyType,
                        policyThreshold,
                        customLogs,
                        dockerfilePath,
                        envParams,
                        initialDelaySeconds,
                    });
                    res = response.Result;
                    runId = response.RunId;
                }
                if (res !== 'succ')
                    throw new error_1.CloudBaseError('提交构建任务失败');
                loading.start('正在部署中');
                while (true) {
                    let { Percent, Status } = yield run_1.basicOperate({ envId, runId });
                    if (Status === 'build_fail') {
                        let logs = yield run_1.logCreate({ envId, runId });
                        fs_1.writeFileSync(`./log${runId}`, logs.reduce((res, item) => res + item + '\n', ''));
                        throw new error_1.CloudBaseError(`构建失败，日志写入./log${runId}中`);
                    }
                    else if (Status !== 'updating') {
                        break;
                    }
                    loading.start(`目前构建进度${Percent}%`);
                    yield new Promise(resolve => setTimeout(_ => resolve('again'), 2000));
                }
            }
            catch (e) {
                throw e;
            }
            loading.succeed('构建成功');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UpdateVersion.prototype, "execute", null);
UpdateVersion = __decorate([
    common_1.ICommand()
], UpdateVersion);
exports.UpdateVersion = UpdateVersion;
