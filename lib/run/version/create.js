"use strict";
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
exports.basicOperate = exports.logCreate = exports.createVersion = void 0;
const utils_1 = require("../../utils");
const tcbService = utils_1.CloudApiService.getInstance('tcb');
const createVersion = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { Result, RunId } = yield tcbService.request('CreateCloudBaseRunServerVersion', Object.assign({
        EnvId: options.envId,
        ServerName: options.serverName,
        ContainerPort: options.containerPort,
        UploadType: options.uploadType,
        FlowRatio: options.flowRatio,
        VersionRemark: options.versionRemark,
        EnableUnion: options.enableUnion,
        Cpu: options.cpu,
        Mem: options.mem,
        MinNum: options.minNum,
        MaxNum: options.maxNum,
        PolicyType: options.policyType,
        PolicyThreshold: options.policyThreshold,
        CustomLogs: options.customLogs,
        DockerfilePath: options.dockerfilePath,
        EnvParams: options.envParams,
        InitialDelaySeconds: options.initialDelaySeconds,
    }, options.uploadType === 'package' ? {
        PackageName: options.packageName,
        PackageVersion: options.packageVersion,
        DockerfilePath: options.dockerfilePath
    } : options.uploadType === 'image' ? {
        ImageInfo: options.imageInfo
    } : {
        RepositoryType: options.repositoryType,
        Branch: options.branch,
        CodeDetail: options.codeDetail,
        DockerfilePath: options.dockerfilePath
    }));
    return { Result, RunId };
});
exports.createVersion = createVersion;
const logCreate = (options) => __awaiter(void 0, void 0, void 0, function* () {
    let { Logs } = yield tcbService.request('DescribeCloudBaseRunProcessLog', {
        EnvId: options.envId,
        RunId: options.runId
    });
    return Logs;
});
exports.logCreate = logCreate;
const basicOperate = (options) => __awaiter(void 0, void 0, void 0, function* () {
    let { Percent, ActionDetail: { Status } } = yield tcbService.request('DescribeCloudBaseRunOperateBasic', {
        EnvId: options.envId,
        RunId: options.runId
    });
    return { Percent, Status };
});
exports.basicOperate = basicOperate;
