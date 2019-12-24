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
const commander_1 = __importDefault(require("commander"));
const manager_node_1 = __importDefault(require("@cloudbase/manager-node"));
const utils_1 = require("../utils");
const error_1 = require("../error");
const logger_1 = require("../logger");
function getStorageService(envId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { secretId, secretKey, token } = yield utils_1.checkAndGetCredential();
        const app = new manager_node_1.default({
            secretId,
            secretKey,
            token,
            envId,
            proxy: utils_1.getProxy()
        });
        return app.storage;
    });
}
const AclMap = {
    READONLY: '所有用户可读，仅创建者和管理员可写',
    PRIVATE: '仅创建者及管理员可读写',
    ADMINWRITE: '所有用户可读，仅管理员可写',
    ADMINONLY: '仅管理员可读写'
};
commander_1.default
    .command('storage:upload <localPath> [cloudPath]')
    .option('-e, --envId <envId>', '环境 Id')
    .description('上传文件/文件夹')
    .action(function (localPath, cloudPath = '', options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { parent: { configFile }, envId } = options;
        const assignEnvId = yield utils_1.getEnvId(envId, configFile);
        const storageService = yield getStorageService(assignEnvId);
        const resolveLocalPath = path_1.default.resolve(localPath);
        console.log(resolveLocalPath);
        if (!fs_1.default.existsSync(resolveLocalPath)) {
            throw new error_1.CloudBaseError('文件未找到！');
        }
        const isDir = fs_1.default.statSync(resolveLocalPath).isDirectory();
        const fileText = isDir ? '文件夹' : '文件';
        const onProgress = utils_1.createOnProgressBar(() => {
            logger_1.successLog(`上传${fileText}成功！`);
        });
        if (isDir) {
            yield storageService.uploadDirectory(resolveLocalPath, cloudPath, {
                onProgress
            });
        }
        else {
            yield storageService.uploadFile(resolveLocalPath, cloudPath, onProgress);
        }
    });
});
commander_1.default
    .command('storage:download <cloudPath> <localPath>')
    .option('-e, --envId <envId>', '环境 Id')
    .option('-d, --dir', '下载目标是否为文件夹')
    .description('下载文件/文件夹，文件夹需指定 --dir 选项')
    .action(function (cloudPath, localPath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { parent: { configFile }, envId } = options;
        const assignEnvId = yield utils_1.getEnvId(envId, configFile);
        const storageService = yield getStorageService(assignEnvId);
        const resolveLocalPath = path_1.default.resolve(localPath);
        const { dir } = options;
        const fileText = dir ? '文件夹' : '文件';
        if (dir && !fs_1.default.existsSync(resolveLocalPath)) {
            throw new error_1.CloudBaseError('存储文件夹不存在！');
        }
        const loading = utils_1.loadingFactory();
        loading.start(`下载${fileText}中`);
        if (dir) {
            yield storageService.downloadDirectory(cloudPath, resolveLocalPath);
        }
        else {
            yield storageService.downloadFile(cloudPath, resolveLocalPath);
        }
        loading.succeed(`下载${fileText}成功！`);
    });
});
commander_1.default
    .command('storage:delete <cloudPath>')
    .option('-e, --envId <envId>', '环境 Id')
    .option('-d, --dir', '下载目标是否为文件夹')
    .description('删除文件/文件夹，文件夹需指定 --dir 选项')
    .action(function (cloudPath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { parent: { configFile }, envId } = options;
        const assignEnvId = yield utils_1.getEnvId(envId, configFile);
        const storageService = yield getStorageService(assignEnvId);
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
});
commander_1.default
    .command('storage:list [cloudPath]')
    .option('-e, --envId <envId>', '环境 Id')
    .option('--max', '传输数据的最大条数')
    .option('--markder', '起始路径名，后（不含）按照 UTF-8 字典序返回条目')
    .description('获取文件存储的文件列表')
    .action(function (cloudPath = '', options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { parent: { configFile }, envId } = options;
        const assignEnvId = yield utils_1.getEnvId(envId, configFile);
        const storageService = yield getStorageService(assignEnvId);
        const list = yield storageService.listDirectoryFiles(cloudPath);
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
});
commander_1.default
    .command('storage:url <cloudPath>')
    .option('-e, --envId <envId>', '环境 Id')
    .description('获取文件临时访问地址')
    .action(function (cloudPath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { parent: { configFile }, envId } = options;
        const assignEnvId = yield utils_1.getEnvId(envId, configFile);
        const storageService = yield getStorageService(assignEnvId);
        const fileList = yield storageService.getTemporaryUrl([cloudPath]);
        const { url } = fileList[0];
        logger_1.successLog(`文件临时访问地址：${url}`);
    });
});
commander_1.default
    .command('storage:detail <cloudPath>')
    .option('-e, --envId <envId>', '环境 Id')
    .description('获取文件信息')
    .action(function (cloudPath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { parent: { configFile }, envId } = options;
        const assignEnvId = yield utils_1.getEnvId(envId, configFile);
        const storageService = yield getStorageService(assignEnvId);
        const fileInfo = yield storageService.getFileInfo(cloudPath);
        const date = utils_1.formatDate(fileInfo.Date, 'yyyy-MM-dd hh:mm:ss');
        const logInfo = `文件大小：${fileInfo.Size}\n文件类型：${fileInfo.Type}\n修改日期：${date}\nETag：${fileInfo.ETag}
        `;
        console.log(logInfo);
    });
});
commander_1.default
    .command('storage:get-acl')
    .option('-e, --envId <envId>', '环境 Id')
    .description('获取文件存储权限信息')
    .action(function (options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { parent: { configFile }, envId } = options;
        const assignEnvId = yield utils_1.getEnvId(envId, configFile);
        const storageService = yield getStorageService(assignEnvId);
        const acl = yield storageService.getStorageAcl();
        console.log(`当前权限【${AclMap[acl]}】`);
    });
});
commander_1.default
    .command('storage:set-acl')
    .option('-e, --envId <envId>', '环境 Id')
    .description('设置文件存储权限信息')
    .action(function (options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { parent: { configFile }, envId } = options;
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
        const assignEnvId = yield utils_1.getEnvId(envId, configFile);
        const storageService = yield getStorageService(assignEnvId);
        yield storageService.setStorageAcl(acl);
        logger_1.successLog('设置存储权限成功！');
    });
});
