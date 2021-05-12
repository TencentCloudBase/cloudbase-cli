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
exports.describeRunVersion = exports.updateVersion = void 0;
const utils_1 = require("../../utils");
const tcbService = utils_1.CloudApiService.getInstance('tcb');
const updateVersion = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { Result, RunId } = yield tcbService.request('RollUpdateCloudBaseRunServerVersion', Object.assign({ EnvId: options.envId, ServerName: options.serverName, VersionName: options.versionName, ContainerPort: options.containerPort, UploadType: options.uploadType, FlowRatio: options.flowRatio, VersionRemark: options.versionRemark, EnableUnion: options.enableUnion, Cpu: String(options.cpu), Mem: String(options.mem), MinNum: String(options.minNum), MaxNum: String(options.maxNum), PolicyType: options.policyType, PolicyThreshold: String(options.policyThreshold), CustomLogs: options.customLogs, DockerfilePath: options.dockerfilePath, EnvParams: options.envParams, InitialDelaySeconds: options.initialDelaySeconds }, (options.uploadType === 'package' ? {
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
    })));
    return { Result, RunId };
});
exports.updateVersion = updateVersion;
const describeRunVersion = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield tcbService.request('DescribeCloudBaseRunServerVersion', {
        EnvId: options.envId,
        ServerName: options.serverName,
        VersionName: options.versionName
    });
    return res;
});
exports.describeRunVersion = describeRunVersion;
