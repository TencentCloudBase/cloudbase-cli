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
const commander_1 = __importDefault(require("commander"));
const inquirer_1 = __importDefault(require("inquirer"));
const hosting_1 = require("../hosting");
const error_1 = require("../error");
const utils_1 = require("../utils");
const logger_1 = require("../logger");
const HostingStatusMap = {
    init: '初始化中',
    process: '处理中',
    online: '已上线',
    destroying: '销毁中',
    offline: '已下线',
    create_fail: '初始化失败',
    destroy_fail: '销毁失败'
};
commander_1.default
    .command('hosting:detail')
    .option('-e, --envId <envId>', '环境 Id')
    .description('查看静态网站服务信息')
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    const { parent: { configFile }, envId } = options;
    const assignEnvId = yield utils_1.getEnvId(envId, configFile);
    const res = yield hosting_1.getHostingInfo({ envId: assignEnvId });
    const website = res.data && res.data[0];
    if (!website) {
        const link = utils_1.genClickableLink('https://console.cloud.tencent.com/tcb');
        throw new error_1.CloudBaseError(`您还没有开启静态网站服务，请先到云开发控制台开启静态网站服务！\n 👉 ${link}`);
    }
    const link = utils_1.genClickableLink(`https://${website.cdnDomain}`);
    if (website.status !== 'offline') {
        console.log(`静态网站域名：${link}`);
    }
    console.log(`静态网站状态：【${HostingStatusMap[website.status]}】`);
}));
commander_1.default
    .command('hosting:deploy [filePath] [cloudPath]')
    .option('-e, --envId <envId>', '环境 Id')
    .description('部署静态网站文件')
    .action((filePath = '.', cloudPath = '', options) => __awaiter(void 0, void 0, void 0, function* () {
    const { parent: { configFile }, envId } = options;
    const assignEnvId = yield utils_1.getEnvId(envId, configFile);
    const isDir = utils_1.isDirectory(filePath);
    console.log('> 文件部署中...');
    try {
        const onProgress = utils_1.createOnProgressBar(() => {
            logger_1.successLog('文件部署成功！');
        });
        yield hosting_1.hostingDeploy({
            filePath,
            cloudPath,
            envId: assignEnvId,
            isDir,
            onProgress
        });
    }
    catch (e) {
        logger_1.errorLog('文件部署失败！');
        console.log(e.message);
    }
}));
commander_1.default
    .command('hosting:delete [cloudPath]')
    .option('-e, --envId <envId>', '环境 Id')
    .option('-d, --dir', '删除目标是否为文件夹')
    .description('删除静态网站文件/文件夹，文件夹需指定 --dir 选项')
    .action((cloudPath = '', options) => __awaiter(void 0, void 0, void 0, function* () {
    const { parent: { configFile }, envId } = options;
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
    const assignEnvId = yield utils_1.getEnvId(envId, configFile);
    const loading = utils_1.loadingFactory();
    loading.start(`删除${fileText}中...`);
    try {
        yield hosting_1.hostingDelete({
            isDir,
            cloudPath,
            envId: assignEnvId
        });
        loading.succeed(`删除${fileText}成功！`);
    }
    catch (e) {
        loading.fail(`删除${fileText}失败！`);
        console.log(e.message);
    }
}));
commander_1.default
    .command('hosting:list')
    .option('-e, --envId <envId>', '环境 Id')
    .description('展示文件列表')
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    const { parent: { configFile }, envId } = options;
    const assignEnvId = yield utils_1.getEnvId(envId, configFile);
    const loading = utils_1.loadingFactory();
    loading.start('获取文件列表中...');
    try {
        const list = yield hosting_1.hostingList({
            envId: assignEnvId
        });
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
    }
    catch (e) {
        loading.fail('获取文件列表失败！');
        console.log(e.message);
    }
}));
