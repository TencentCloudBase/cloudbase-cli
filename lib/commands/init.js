"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const tar_fs_1 = __importDefault(require("tar-fs"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const inquirer_1 = __importDefault(require("inquirer"));
const commander_1 = __importDefault(require("commander"));
const error_1 = require("../error");
const logger_1 = require("../logger");
const env_1 = require("../env");
const utils_1 = require("../utils");
const listUrl = 'https://service-lqbcazn1-1252710547.ap-shanghai.apigateway.myqcloud.com/release/';
async function extractTemplate(projectPath, templatePath) {
    const url = `https://6261-base-830cab-1252710547.tcb.qcloud.la/cloudbase-examples/${templatePath}.tar.gz`;
    return utils_1.fetchStream(url).then(async (res) => {
        if (res.status !== 200) {
            throw new error_1.CloudBaseError('未找到文件');
        }
        await new Promise((resolve, reject) => {
            const extractor = tar_fs_1.default.extract(projectPath);
            res.body.on('error', reject);
            extractor.on('error', reject);
            extractor.on('finish', resolve);
            res.body.pipe(extractor);
        });
    });
}
async function copyServerTemplate(projectPath) {
    const templatePath = path_1.default.resolve(__dirname, '../../templates', 'server/node');
    fs_extra_1.default.copySync(templatePath, projectPath);
}
commander_1.default
    .command('init')
    .option('--server', '创建 node 项目')
    .description('创建并初始化一个新的项目')
    .action(async function (cmd) {
    let cancelLoading = utils_1.loading('拉取环境列表');
    let envData = [];
    try {
        envData = (await env_1.listEnvs()) || [];
    }
    catch (e) {
        cancelLoading();
        throw e;
    }
    cancelLoading();
    const envs = envData
        .map(item => `${item.EnvId}:${item.PackageName}`)
        .sort();
    if (!envs.length) {
        throw new error_1.CloudBaseError('没有可以使用的环境，请先开通云开发服务并创建环境（https://console.cloud.tencent.com/tcb）');
    }
    const { env } = await inquirer_1.default.prompt({
        type: 'list',
        name: 'env',
        message: '选择关联环境',
        choices: envs
    });
    const { projectName } = await inquirer_1.default.prompt({
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称',
        default: 'cloudbase-demo'
    });
    const { lang } = await inquirer_1.default.prompt({
        type: 'list',
        name: 'lang',
        message: '选择模板语言',
        choices: ['PHP', 'Java', 'Node']
    });
    cancelLoading = utils_1.loading('拉取云开发模板列表中');
    const templateList = await utils_1.fetch(listUrl);
    cancelLoading();
    const templates = templateList.filter(item => item.lang === lang);
    const { selectTemplateName } = await inquirer_1.default.prompt({
        type: 'list',
        name: 'selectTemplateName',
        message: '选择云开发模板',
        choices: templates.map(item => item.name)
    });
    const selectedTemplate = templates.find(item => item.name === selectTemplateName);
    const projectPath = path_1.default.join(process.cwd(), projectName);
    if (fs_1.default.existsSync(projectPath)) {
        const { cover } = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'cover',
            message: `已存在同名文件夹：${projectName}，是否覆盖？`,
            default: false
        });
        if (!cover) {
            throw new error_1.CloudBaseError('操作终止！');
        }
        else {
            fs_extra_1.default.removeSync(projectPath);
        }
    }
    cancelLoading = utils_1.loading('下载文件中');
    if (cmd.server) {
        await copyServerTemplate(projectPath);
        fs_1.default.renameSync(path_1.default.join(projectPath, '_gitignore'), path_1.default.join(projectPath, '.gitignore'));
    }
    else {
        await extractTemplate(projectPath, selectedTemplate.path);
    }
    cancelLoading();
    const configFileJSONPath = path_1.default.join(projectPath, 'cloudbaserc.json');
    const configFileJSPath = path_1.default.join(projectPath, 'cloudbaserc.js');
    const configFilePath = [configFileJSPath, configFileJSONPath].find(item => fs_1.default.existsSync(item));
    if (!configFilePath) {
        logger_1.successLog(`创建项目 ${projectName} 成功`);
        return;
    }
    const configContent = fs_1.default.readFileSync(configFilePath).toString();
    fs_1.default.writeFileSync(configFilePath, configContent.replace('{{envId}}', env.split(':')[0]));
    logger_1.successLog(`创建项目 ${projectName} 成功！\n`);
    console.log('🎉 欢迎贡献你的模板 👉 https://github.com/TencentCloudBase/cloudbase-examples');
});
