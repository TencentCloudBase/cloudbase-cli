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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const log_symbols_1 = __importDefault(require("log-symbols"));
const utils_1 = require("../../utils");
const error_1 = require("../../error");
const logger_1 = require("../../logger");
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
function upload(ctx, localPath = '.', cloudPath = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const resolveLocalPath = path_1.default.resolve(localPath);
        if (!utils_1.checkFullAccess(resolveLocalPath)) {
            throw new error_1.CloudBaseError('文件未找到！');
        }
        const loading = utils_1.loadingFactory();
        loading.start('准备上传中...');
        const storageService = yield getStorageService(ctx.envId);
        const isDir = fs_1.default.statSync(resolveLocalPath).isDirectory();
        let totalFiles = 0;
        if (isDir) {
            let files = yield storageService.walkLocalDir(resolveLocalPath);
            files = files.filter(item => !utils_1.isDirectory(item));
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
        const onProgress = utils_1.createOnProgressBar(() => {
            !isDir && logger_1.successLog('上传文件成功！');
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
            logger_1.successLog(`文件共计 ${totalFiles} 个`);
            logger_1.successLog(`文件上传成功 ${successFiles.length} 个`);
            if (totalFiles <= 50) {
                utils_1.printHorizontalTable(['状态', '文件'], successFiles.map(item => [log_symbols_1.default.success, item]));
            }
            logger_1.errorLog(`文件上传失败 ${failedFiles.length} 个`);
            if (failedFiles.length) {
                if (totalFiles <= 50) {
                    utils_1.printHorizontalTable(['状态', '文件'], failedFiles.map(item => [log_symbols_1.default.error, item]));
                }
                else {
                    const errorLogPath = path_1.default.resolve('./cloudbase-error.log');
                    logger_1.errorLog('上传失败文件：');
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
exports.upload = upload;
function download(ctx, cloudPath, localPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, options } = ctx;
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
exports.download = download;
function deleteFile(ctx, cloudPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, options } = ctx;
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
exports.deleteFile = deleteFile;
function list(ctx, cloudPath = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const storageService = yield getStorageService(ctx.envId);
        const loading = utils_1.loadingFactory();
        loading.start('获取文件列表中...');
        const list = yield storageService.listDirectoryFiles(cloudPath);
        loading.stop();
        const head = ['序号', 'Key', 'LastModified', 'ETag', 'Size(KB)'];
        const notDir = item => !(Number(item.Size) === 0 && /\/$/g.test(item.Key));
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
exports.list = list;
function getUrl(ctx, cloudPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const storageService = yield getStorageService(ctx.envId);
        const fileList = yield storageService.getTemporaryUrl([cloudPath]);
        const { url } = fileList[0];
        logger_1.successLog(`文件临时访问地址：${url}`);
    });
}
exports.getUrl = getUrl;
function detail(ctx, cloudPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const storageService = yield getStorageService(ctx.envId);
        const fileInfo = yield storageService.getFileInfo(cloudPath);
        const date = utils_1.formatDate(fileInfo.Date, 'yyyy-MM-dd hh:mm:ss');
        const logInfo = `文件大小：${fileInfo.Size}\n文件类型：${fileInfo.Type}\n修改日期：${date}\nETag：${fileInfo.ETag}
        `;
        console.log(logInfo);
    });
}
exports.detail = detail;
function getAcl(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const storageService = yield getStorageService(ctx.envId);
        const acl = yield storageService.getStorageAcl();
        console.log(`当前权限【${AclMap[acl]}】`);
    });
}
exports.getAcl = getAcl;
function setAcl(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const storageService = yield getStorageService(ctx.envId);
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
        logger_1.successLog('设置存储权限成功！');
    });
}
exports.setAcl = setAcl;
