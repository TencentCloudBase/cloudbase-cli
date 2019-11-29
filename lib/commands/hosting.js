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
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = __importDefault(require("commander"));
const inquirer_1 = __importDefault(require("inquirer"));
const hosting_1 = require("../hosting");
const error_1 = require("../error");
const utils_1 = require("../utils");
const logger_1 = require("../logger");
const HostingStatusMap = {
    init: '初始化中',
    process: '处理中',
    online: '上线',
    destroying: '销毁中',
    offline: '下线'
};
commander_1.default
    .command('hosting:enable [envId]')
    .description('开启静态网站服务')
    .action((envId, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { configFile } = options.parent;
    const assignEnvId = yield utils_1.getEnvId(envId, configFile);
    const res = yield hosting_1.enableHosting({ envId: assignEnvId });
    if (res.code === 0) {
        logger_1.successLog('静态网站服务开启成功！');
    }
    else {
        throw new error_1.CloudBaseError('静态网站服务失败！');
    }
}));
commander_1.default
    .command('hosting:detail [envId]')
    .description('查看静态网站服务信息')
    .action((envId, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { configFile } = options.parent;
    const assignEnvId = yield utils_1.getEnvId(envId, configFile);
    const res = yield hosting_1.getHostingInfo({ envId: assignEnvId });
    const website = res.data && res.data[0];
    if (!website) {
        throw new error_1.CloudBaseError('你还没有开启静态网站服务，请使用 cloudbase hosting:enable 命令启用静态网站服务！');
    }
    const url = `https://${website.CdnDomain}`;
    console.log(`静态网站域名：${chalk_1.default.bold.underline(url)}\n静态网站状态：${HostingStatusMap[website.Status]}`);
}));
commander_1.default
    .command('hosting:destroy [envId]')
    .description('关闭静态网站服务')
    .action((envId, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { configFile } = options.parent;
    const assignEnvId = yield utils_1.getEnvId(envId, configFile);
    const { confirm } = yield inquirer_1.default.prompt({
        type: 'confirm',
        name: 'confirm',
        message: '确定要关闭静态网站服务吗，关闭后您的所有静态网站资源将被销毁，无法恢复！',
        default: false
    });
    if (!confirm) {
        throw new error_1.CloudBaseError('操作终止！');
    }
    const loading = utils_1.loadingFactory();
    loading.start('静态网站销毁中');
    const res = yield hosting_1.destroyHosting({ envId: assignEnvId });
    if (res.code === 0) {
        loading.succeed('静态网站服务销毁成功！');
    }
    else {
        loading.fail('静态网站服务销毁失败！');
    }
}));
commander_1.default
    .command('hosting:deploy [filePath] [cloudPath] [envId]')
    .description('部署静态网站文件')
    .action((filePath, cloudPath = '', envId, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { configFile } = options.parent;
    const assignEnvId = yield utils_1.getEnvId(envId, configFile);
    const isDir = utils_1.isDirectory(filePath);
    const loading = utils_1.loadingFactory();
    loading.start('文件部署中...');
    try {
        yield hosting_1.hostingDeploy({
            filePath,
            cloudPath,
            envId: assignEnvId,
            isDir
        });
        loading.succeed('文件部署中...');
    }
    catch (error) {
        loading.fail('文件部署失败！');
    }
}));
commander_1.default
    .command('hosting:delete [cloudPath] [envId]')
    .option('-d, --dir', '删除文件夹')
    .description('删除静态网站文件/文件夹')
    .action((cloudPath = '', envId, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { configFile } = options.parent;
    const { dir } = options;
    const fileText = dir ? '文件夹' : '文件';
    const assignEnvId = yield utils_1.getEnvId(envId, configFile);
    const loading = utils_1.loadingFactory();
    loading.start(`删除${fileText}中...`);
    try {
        yield hosting_1.hostingDelete({
            cloudPath,
            envId: assignEnvId,
            isDir: dir
        });
        loading.succeed(`删除${fileText}成功...`);
    }
    catch (error) {
        loading.fail(`删除${fileText}失败...`);
    }
}));
commander_1.default
    .command('hosting:list [envId]')
    .description('展示文件列表')
    .action((envId, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { configFile } = options.parent;
    const assignEnvId = yield utils_1.getEnvId(envId, configFile);
    const loading = utils_1.loadingFactory();
    loading.start('获取文件列表中...');
    try {
        const list = yield hosting_1.hostingList({
            envId: assignEnvId
        });
        loading.stop();
        const head = ['序号', 'Key', 'LastModified', 'ETag', 'Size(B)'];
        const notDir = item => !(Number(item.Size) === 0 && /\/$/g.test(item.Key));
        const tableData = list
            .filter(notDir)
            .map((item, index) => [
            index + 1,
            item.Key,
            utils_1.formatDate(item.LastModified, 'yyyy-MM-dd hh:mm:ss'),
            item.ETag,
            String(item.Size)
        ]);
        utils_1.printHorizontalTable(head, tableData);
    }
    catch (error) {
        loading.fail('获取文件列表失败');
    }
}));
