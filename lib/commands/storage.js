"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const commander_1 = __importDefault(require("commander"));
const manager_node_1 = __importDefault(require("@cloudbase/manager-node"));
const utils_1 = require("../utils");
const error_1 = require("../error");
const logger_1 = require("../logger");
const utils_2 = require("../utils");
async function getStorageService(envId) {
    const { secretId, secretKey, token } = await utils_1.getCredential();
    const app = new manager_node_1.default({
        secretId,
        secretKey,
        token,
        envId
    });
    return app.storage;
}
commander_1.default
    .command('storage:upload <localPath> <cloudPath> [envId]')
    .description('上传文件/文件夹')
    .action(async function (localPath, cloudPath, envId, options) {
    const { configFile } = options.parent;
    const assignEnvId = await utils_1.getEnvId(envId, configFile);
    const storageService = await getStorageService(assignEnvId);
    const resolveLocalPath = path_1.default.resolve(localPath);
    if (!fs_1.default.existsSync(resolveLocalPath)) {
        throw new error_1.CloudBaseError('文件未找到！');
    }
    const isDir = fs_1.default.statSync(resolveLocalPath).isDirectory();
    let cancelLoading = utils_1.loading('上传文件中');
    if (isDir) {
        await storageService.uploadDirectory(resolveLocalPath, cloudPath);
    }
    else {
        await storageService.uploadFile(resolveLocalPath, cloudPath);
    }
    cancelLoading();
    logger_1.successLog('上传文件成功！');
});
commander_1.default
    .command('storage:download <cloudPath> <localPath> [envId]')
    .option('-d, --dir', '下载目标是否为文件夹')
    .description('下载文件/文件夹，文件夹需指定 --dir 选项')
    .action(async function (cloudPath, localPath, envId, options) {
    const { configFile } = options.parent;
    const assignEnvId = await utils_1.getEnvId(envId, configFile);
    const storageService = await getStorageService(assignEnvId);
    const resolveLocalPath = path_1.default.resolve(localPath);
    const { dir } = options;
    if (dir && !fs_1.default.existsSync(resolveLocalPath)) {
        throw new error_1.CloudBaseError('存储文件夹不存在！');
    }
    let cancelLoading = utils_1.loading('下载文件中');
    if (dir) {
        await storageService.downloadDirectory(cloudPath, resolveLocalPath);
    }
    else {
        await storageService.downloadFile(cloudPath, resolveLocalPath);
    }
    cancelLoading();
    logger_1.successLog('下载文件成功！');
});
commander_1.default
    .command('storage:delete <cloudPath> [envId]')
    .option('-d, --dir', '下载目标是否为文件夹')
    .description('删除文件/文件夹，文件夹需指定 --dir 选项')
    .action(async function (cloudPath, envId, options) {
    const { configFile } = options.parent;
    const assignEnvId = await utils_1.getEnvId(envId, configFile);
    const storageService = await getStorageService(assignEnvId);
    const { dir } = options;
    if (dir) {
        await storageService.deleteDirectory(cloudPath);
    }
    else {
        await storageService.deleteFile([cloudPath]);
    }
    logger_1.successLog('删除文件成功！');
});
commander_1.default
    .command('storage:list <cloudPath> [envId]')
    .option('--max', '传输数据的最大条数')
    .option('--markder', '起始路径名，后（不含）按照 UTF-8 字典序返回条目')
    .description('获取文件夹中的文件列表')
    .action(async function (cloudPath, envId, options) {
    const { configFile } = options.parent;
    const assignEnvId = await utils_1.getEnvId(envId, configFile);
    const storageService = await getStorageService(assignEnvId);
    const list = await storageService.listDirectoryFiles(cloudPath);
    const head = ['序号', 'Key', 'LastModified', 'ETag', 'Size(B)'];
    const notDir = item => !(Number(item.Size) === 0 && /\/$/g.test(item.Key));
    const tableData = list
        .filter(notDir)
        .map((item, index) => [
        index + 1,
        item.Key,
        utils_2.formatDate(item.LastModified, 'yyyy-MM-dd hh:mm:ss'),
        item.ETag,
        String(item.Size)
    ]);
    utils_2.printCliTable(head, tableData);
});
commander_1.default
    .command('storage:url <cloudPath> [envId]')
    .description('获取文件临时访问地址')
    .action(async function (cloudPath, envId, options) {
    const { configFile } = options.parent;
    const assignEnvId = await utils_1.getEnvId(envId, configFile);
    const storageService = await getStorageService(assignEnvId);
    const fileList = await storageService.getTemporaryUrl([cloudPath]);
    const { url } = fileList[0];
    logger_1.successLog(`文件临时访问地址：${url}`);
});
commander_1.default
    .command('storage:detail <cloudPath> [envId]')
    .description('获取文件信息')
    .action(async function (cloudPath, envId, options) {
    const { configFile } = options.parent;
    const assignEnvId = await utils_1.getEnvId(envId, configFile);
    const storageService = await getStorageService(assignEnvId);
    const fileInfo = await storageService.getFileInfo(cloudPath);
    const date = utils_2.formatDate(fileInfo.Date, 'yyyy-MM-dd hh:mm:ss');
    const logInfo = `文件大小：${fileInfo.Size}\n文件类型：${fileInfo.Type}\n修改日期：${date}\nETag：${fileInfo.ETag}
        `;
    console.log(logInfo);
});
commander_1.default
    .command('storage:get-acl [envId]')
    .description('获取文件存储权限信息')
    .action(async function (envId, options) {
    const { configFile } = options.parent;
    const assignEnvId = await utils_1.getEnvId(envId, configFile);
    const storageService = await getStorageService(assignEnvId);
    const acl = await storageService.getStorageAcl();
    console.log(acl);
});
commander_1.default
    .command('storage:set-acl <acl> [envId]')
    .description('设置文件存储权限信息')
    .action(async function (acl, envId, options) {
    const validAcl = ['READONLY', 'PRIVATE', 'ADMINWRITE', 'ADMINONLY'];
    if (!validAcl.includes(acl)) {
        throw new error_1.CloudBaseError('非法的权限值，仅支持：READONLY, PRIVATE, ADMINWRITE, ADMINONLY');
    }
    const { configFile } = options.parent;
    const assignEnvId = await utils_1.getEnvId(envId, configFile);
    const storageService = await getStorageService(assignEnvId);
    await storageService.setStorageAcl(acl);
});
