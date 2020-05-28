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
const utils_1 = require("../../utils");
const error_1 = require("../../error");
const decorators_1 = require("../../decorators");
const AclMap = {
    READONLY: '所有用户可读，仅创建者和管理员可写',
    PRIVATE: '仅创建者及管理员可读写',
    ADMINWRITE: '所有用户可读，仅管理员可写',
    ADMINONLY: '仅管理员可读写'
};
function getStorageService(envId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { storage } = yield utils_1.getMangerService(envId);
        return storage;
    });
}
function checkCloudPath(cloudPath) {
    if ((cloudPath === null || cloudPath === void 0 ? void 0 : cloudPath[0]) === '/') {
        throw new error_1.CloudBaseError('cloudPath 不能以 "/" 开头');
    }
}
let UploadCommand = class UploadCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'storage:upload <localPath> [cloudPath]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '上传文件/文件夹'
        };
    }
    execute(envId, params, log) {
        return __awaiter(this, void 0, void 0, function* () {
            const localPath = params === null || params === void 0 ? void 0 : params[0];
            const cloudPath = params === null || params === void 0 ? void 0 : params[1];
            const resolveLocalPath = path_1.default.resolve(localPath);
            if (!utils_1.checkFullAccess(resolveLocalPath)) {
                throw new error_1.CloudBaseError('文件未找到！');
            }
            const loading = utils_1.loadingFactory();
            loading.start('准备上传中...');
            const storageService = yield getStorageService(envId);
            const isDir = fs_1.default.statSync(resolveLocalPath).isDirectory();
            let totalFiles = 0;
            if (isDir) {
                let files = yield storageService.walkLocalDir(resolveLocalPath);
                files = files.filter((item) => !utils_1.isDirectory(item));
                totalFiles = files.length;
            }
            if (totalFiles > 1000) {
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
                !isDir && log.success('上传文件成功！');
            }, () => {
                loading.stop();
            });
            const successFiles = [];
            const failedFiles = [];
            if (isDir) {
                yield storageService.uploadDirectory({
                    localPath: resolveLocalPath,
                    cloudPath,
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
                }
            }
            else {
                const assignCloudPath = cloudPath || path_1.default.parse(resolveLocalPath).base;
                yield storageService.uploadFile({
                    localPath: resolveLocalPath,
                    cloudPath: assignCloudPath,
                    onProgress
                });
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
], UploadCommand.prototype, "execute", null);
UploadCommand = __decorate([
    common_1.ICommand()
], UploadCommand);
exports.UploadCommand = UploadCommand;
let DownloadCommand = class DownloadCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'storage:download <cloudPath> <localPath>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-d, --dir',
                    desc: '下载目标是否为文件夹'
                }
            ],
            desc: '下载文件/文件夹，文件夹需指定 --dir 选项'
        };
    }
    execute(envId, options, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const cloudPath = params === null || params === void 0 ? void 0 : params[0];
            const localPath = params === null || params === void 0 ? void 0 : params[1];
            const storageService = yield getStorageService(envId);
            const resolveLocalPath = path_1.default.resolve(localPath);
            const { dir } = options;
            const fileText = dir ? '文件夹' : '文件';
            if (dir && !utils_1.checkFullAccess(resolveLocalPath)) {
                throw new error_1.CloudBaseError('存储文件夹不存在！');
            }
            const loading = utils_1.loadingFactory();
            loading.start(`下载${fileText}中`);
            if (dir) {
                yield storageService.downloadDirectory({
                    localPath: resolveLocalPath,
                    cloudPath
                });
            }
            else {
                yield storageService.downloadFile({
                    cloudPath,
                    localPath: resolveLocalPath
                });
            }
            loading.succeed(`下载${fileText}成功！`);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()), __param(2, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], DownloadCommand.prototype, "execute", null);
DownloadCommand = __decorate([
    common_1.ICommand()
], DownloadCommand);
exports.DownloadCommand = DownloadCommand;
let DeleteFileCommand = class DeleteFileCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'storage:delete <cloudPath>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-d, --dir',
                    desc: '下载目标是否为文件夹'
                }
            ],
            desc: '删除文件/文件夹，文件夹需指定 --dir 选项'
        };
    }
    execute(envId, options, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const cloudPath = params === null || params === void 0 ? void 0 : params[0];
            const storageService = yield getStorageService(envId);
            const { dir } = options;
            const fileText = dir ? '文件夹' : '文件';
            const loading = utils_1.loadingFactory();
            loading.start(`删除${fileText}中`);
            if (dir) {
                yield storageService.deleteDirectory(cloudPath);
            }
            else {
                yield storageService.deleteFile([cloudPath]);
            }
            loading.succeed(`删除${fileText}成功！`);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsOptions()), __param(2, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], DeleteFileCommand.prototype, "execute", null);
DeleteFileCommand = __decorate([
    common_1.ICommand()
], DeleteFileCommand);
exports.DeleteFileCommand = DeleteFileCommand;
let StorageListCommand = class StorageListCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'storage:list [cloudPath]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '获取文件存储的文件列表，不指定路径时获取全部文件列表'
        };
    }
    execute(envId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const cloudPath = params === null || params === void 0 ? void 0 : params[0];
            const storageService = yield getStorageService(envId);
            const loading = utils_1.loadingFactory();
            loading.start('获取文件列表中...');
            const list = yield storageService.listDirectoryFiles(cloudPath);
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
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StorageListCommand.prototype, "execute", null);
StorageListCommand = __decorate([
    common_1.ICommand()
], StorageListCommand);
exports.StorageListCommand = StorageListCommand;
let GetUrlCommand = class GetUrlCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'storage:url <cloudPath>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '获取文件临时访问地址'
        };
    }
    execute(envId, params, log) {
        return __awaiter(this, void 0, void 0, function* () {
            const cloudPath = params === null || params === void 0 ? void 0 : params[0];
            const storageService = yield getStorageService(envId);
            const fileList = yield storageService.getTemporaryUrl([cloudPath]);
            const { url } = fileList[0];
            log.success(`文件临时访问地址：${url}`);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsParams()), __param(2, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], GetUrlCommand.prototype, "execute", null);
GetUrlCommand = __decorate([
    common_1.ICommand()
], GetUrlCommand);
exports.GetUrlCommand = GetUrlCommand;
let StorageDetailCommand = class StorageDetailCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'storage:detail <cloudPath>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '获取文件信息'
        };
    }
    execute(envId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const cloudPath = params === null || params === void 0 ? void 0 : params[0];
            const storageService = yield getStorageService(envId);
            const fileInfo = yield storageService.getFileInfo(cloudPath);
            const date = utils_1.formatDate(fileInfo.Date, 'yyyy-MM-dd hh:mm:ss');
            const logInfo = `文件大小：${fileInfo.Size}\n文件类型：${fileInfo.Type}\n修改日期：${date}\nETag：${fileInfo.ETag}
            `;
            console.log(logInfo);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.ArgsParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StorageDetailCommand.prototype, "execute", null);
StorageDetailCommand = __decorate([
    common_1.ICommand()
], StorageDetailCommand);
exports.StorageDetailCommand = StorageDetailCommand;
let GetAclCommand = class GetAclCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'storage:get-acl',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '获取文件存储权限信息'
        };
    }
    execute(envId) {
        return __awaiter(this, void 0, void 0, function* () {
            const storageService = yield getStorageService(envId);
            const acl = yield storageService.getStorageAcl();
            console.log(`当前权限【${AclMap[acl]}】`);
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GetAclCommand.prototype, "execute", null);
GetAclCommand = __decorate([
    common_1.ICommand()
], GetAclCommand);
exports.GetAclCommand = GetAclCommand;
let setAclCommand = class setAclCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'storage:set-acl',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '设置文件存储权限信息'
        };
    }
    execute(envId, log) {
        return __awaiter(this, void 0, void 0, function* () {
            const storageService = yield getStorageService(envId);
            const { acl } = yield inquirer_1.default.prompt({
                type: 'list',
                name: 'acl',
                message: '选择权限',
                choices: [
                    {
                        name: '所有用户可读，仅创建者和管理员可写',
                        value: 'READONLY'
                    },
                    {
                        name: '仅创建者及管理员可读写',
                        value: 'PRIVATE'
                    },
                    {
                        name: '所有用户可读，仅管理员可写',
                        value: 'ADMINWRITE'
                    },
                    {
                        name: '仅管理员可读写',
                        value: 'ADMINONLY'
                    }
                ]
            });
            yield storageService.setStorageAcl(acl);
            log.success('设置存储权限成功！');
        });
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.EnvId()), __param(1, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], setAclCommand.prototype, "execute", null);
setAclCommand = __decorate([
    common_1.ICommand()
], setAclCommand);
exports.setAclCommand = setAclCommand;
