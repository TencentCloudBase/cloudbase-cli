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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const log_symbols_1 = __importDefault(require("log-symbols"));
const common_1 = require("../common");
const hosting_1 = require("../../hosting");
const error_1 = require("../../error");
const utils_1 = require("../../utils");
const decorators_1 = require("../../decorators");
const HostingStatusMap = {
    init: '初始化中',
    process: '处理中',
    online: '已上线',
    destroying: '销毁中',
    offline: '已下线',
    create_fail: '初始化失败',
    destroy_fail: '销毁失败'
};
let HostingDetail = class HostingDetail extends common_1.Command {
    get options() {
        return {
            cmd: 'hosting:detail',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '查看静态网站服务信息'
        };
    }
    execute(envId, log) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield hosting_1.getHostingInfo({ envId });
            const website = res.data && res.data[0];
            if (!website) {
                const link = utils_1.genClickableLink('https://console.cloud.tencent.com/tcb');
                throw new error_1.CloudBaseError(`您还没有开启静态网站服务，请先到云开发控制台开启静态网站服务！\n 👉 ${link}`);
            }
            const link = utils_1.genClickableLink(`https://${website.cdnDomain}`);
            if (website.status !== 'offline') {
                log.info(`静态网站域名：${link}`);
            }
            log.info(`静态网站状态：【${HostingStatusMap[website.status]}】`);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], HostingDetail.prototype, "execute", null);
HostingDetail = __decorate([
    common_1.ICommand()
], HostingDetail);
exports.HostingDetail = HostingDetail;
let HostingDeploy = class HostingDeploy extends common_1.Command {
    get options() {
        return {
            cmd: 'hosting:deploy [filePath] [cloudPath]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '部署静态网站文件'
        };
    }
    execute(envId, params, log) {
        return __awaiter(this, void 0, void 0, function* () {
            const localPath = params === null || params === void 0 ? void 0 : params[0];
            const cloudPath = (params === null || params === void 0 ? void 0 : params[1]) || '';
            log.verbose('本地目录', localPath);
            const resolveLocalPath = path_1.default.resolve(localPath);
            utils_1.checkFullAccess(resolveLocalPath, true);
            const isDir = utils_1.isDirectory(resolveLocalPath);
            const loading = utils_1.loadingFactory();
            loading.start('准备上传中...');
            let totalFiles = 0;
            if (isDir) {
                let files = yield hosting_1.walkLocalDir(envId, resolveLocalPath);
                files = files.filter((item) => !utils_1.isDirectory(item));
                totalFiles = files.length;
            }
            if (totalFiles > 1000) {
                loading.stop();
                const { confirm } = yield inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'confirm',
                    message: '上传文件数量大于 1000，是否继续',
                    default: false
                });
                if (!confirm) {
                    throw new error_1.CloudBaseError('上传中止');
                }
            }
            const onProgress = utils_1.createUploadProgressBar(() => {
                !isDir && log.success('文件部署成功！');
            }, () => {
                loading.stop();
            });
            const successFiles = [];
            const failedFiles = [];
            yield hosting_1.hostingDeploy({
                filePath: resolveLocalPath,
                cloudPath,
                envId,
                isDir,
                onProgress,
                onFileFinish: (...args) => {
                    const error = args[0];
                    const fileInfo = args[2];
                    if (error) {
                        failedFiles.push(fileInfo.Key);
                    }
                    else {
                        successFiles.push(fileInfo.Key);
                    }
                }
            });
            const info = yield hosting_1.getHostingInfo({
                envId
            });
            const website = info.data && info.data[0];
            const link = utils_1.genClickableLink(`https://${website.cdnDomain}`);
            log.success(`\n部署完成 👉 ${link}`);
            if (isDir) {
                log.success(`文件共计 ${totalFiles} 个`);
                log.success(`文件上传成功 ${successFiles.length} 个`);
                if (totalFiles <= 50) {
                    utils_1.printHorizontalTable(['状态', '文件'], successFiles.map((item) => [log_symbols_1.default.success, item]));
                }
                log.error(`文件上传失败 ${failedFiles.length} 个`);
                if (failedFiles.length) {
                    if (totalFiles <= 50) {
                        utils_1.printHorizontalTable(['状态', '文件'], failedFiles.map((item) => [log_symbols_1.default.error, item]));
                    }
                    else {
                        const errorLogPath = path_1.default.resolve('./cloudbase-error.log');
                        log.error('上传失败文件：');
                        console.log(errorLogPath);
                        fs_1.default.writeFileSync(errorLogPath, failedFiles.join('\n'));
                    }
                    throw new error_1.CloudBaseError('部分文件上传失败，进程退出');
                }
            }
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsParams()), __param(2, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], HostingDeploy.prototype, "execute", null);
HostingDeploy = __decorate([
    common_1.ICommand()
], HostingDeploy);
exports.HostingDeploy = HostingDeploy;
let HostingDeleteFiles = class HostingDeleteFiles extends common_1.Command {
    get options() {
        return {
            cmd: 'hosting:delete [cloudPath]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-d, --dir',
                    desc: '删除目标是否为文件夹'
                }
            ],
            desc: '删除静态网站文件/文件夹，文件夹需指定 --dir 选项'
        };
    }
    execute(envId, options, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const cloudPath = (params === null || params === void 0 ? void 0 : params[0]) || '';
            let isDir = options.dir;
            if (cloudPath === '') {
                const { confirm } = yield inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'confirm',
                    message: '指定云端路径为空，将会删除所有文件，是否继续',
                    default: false
                });
                if (!confirm) {
                    throw new error_1.CloudBaseError('操作终止！');
                }
                isDir = true;
            }
            const fileText = isDir ? '文件夹' : '文件';
            const loading = utils_1.loadingFactory();
            loading.start(`删除${fileText}中...`);
            try {
                yield hosting_1.hostingDelete({
                    isDir,
                    cloudPath,
                    envId
                });
                loading.succeed(`删除${fileText}成功！`);
            }
            catch (e) {
                loading.fail(`删除${fileText}失败！`);
                throw new error_1.CloudBaseError(e.message);
            }
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()), __param(2, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], HostingDeleteFiles.prototype, "execute", null);
HostingDeleteFiles = __decorate([
    common_1.ICommand()
], HostingDeleteFiles);
exports.HostingDeleteFiles = HostingDeleteFiles;
let HostingList = class HostingList extends common_1.Command {
    get options() {
        return {
            cmd: 'hosting:list',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '展示文件列表'
        };
    }
    execute(envId) {
        return __awaiter(this, void 0, void 0, function* () {
            const loading = utils_1.loadingFactory();
            loading.start('获取文件列表中...');
            try {
                const list = yield hosting_1.hostingList({
                    envId
                });
                loading.stop();
                const head = ['序号', 'Key', 'LastModified', 'ETag', 'Size(KB)'];
                const notDir = (item) => !(Number(item.Size) === 0 && /\/$/g.test(item.Key));
                const tableData = list
                    .filter(notDir)
                    .map((item, index) => [
                    index + 1,
                    item.Key,
                    utils_1.formatDate(item.LastModified, 'yyyy-MM-dd hh:mm:ss'),
                    item.ETag,
                    String(utils_1.formateFileSize(item.Size, 'KB'))
                ]);
                utils_1.printHorizontalTable(head, tableData);
            }
            catch (e) {
                loading.fail('获取文件列表失败！');
                throw new error_1.CloudBaseError(e.message);
            }
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HostingList.prototype, "execute", null);
HostingList = __decorate([
    common_1.ICommand()
], HostingList);
exports.HostingList = HostingList;
