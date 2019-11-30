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
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const tar_fs_1 = __importDefault(require("tar-fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const inquirer_1 = __importDefault(require("inquirer"));
const commander_1 = __importDefault(require("commander"));
const error_1 = require("../error");
const logger_1 = require("../logger");
const env_1 = require("../env");
const utils_1 = require("../utils");
const listUrl = 'https://service-lqbcazn1-1252710547.ap-shanghai.apigateway.myqcloud.com/release/';
function extractTemplate(projectPath, templatePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://6261-base-830cab-1252710547.tcb.qcloud.la/cloudbase-templates/${templatePath}.tar.gz`;
        return utils_1.fetchStream(url).then((res) => __awaiter(this, void 0, void 0, function* () {
            if (res.status !== 200) {
                throw new error_1.CloudBaseError('未找到文件');
            }
            yield new Promise((resolve, reject) => {
                const extractor = tar_fs_1.default.extract(projectPath);
                res.body.on('error', reject);
                extractor.on('error', reject);
                extractor.on('finish', resolve);
                res.body.pipe(extractor);
            });
        }));
    });
}
function copyServerTemplate(projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const templatePath = path_1.default.resolve(__dirname, '../../templates', 'server/node');
        fs_extra_1.default.copySync(templatePath, projectPath);
    });
}
function initSuccessOutput(projectName) {
    logger_1.successLog(`创建项目 ${projectName} 成功！\n`);
    const command = chalk_1.default.bold.cyan(`cd ${projectName}`);
    console.log(`👉 运行 ${command} 开始您的项目！\n`);
    console.log('🎉 欢迎贡献你的模板 👉 https://github.com/TencentCloudBase/cloudbase-templates');
}
commander_1.default
    .command('init')
    .option('--server', '创建 node 项目')
    .description('创建并初始化一个新的项目')
    .action(function (cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        const loading = utils_1.loadingFactory();
        loading.start('拉取环境列表');
        let envData = [];
        try {
            envData = (yield env_1.listEnvs()) || [];
        }
        catch (e) {
            loading.stop();
            throw e;
        }
        loading.stop();
        const envs = envData
            .map(item => ({
            name: `${item.Alias} - [${item.EnvId}:${item.PackageName}]`,
            value: item.EnvId
        }))
            .sort();
        if (!envs.length) {
            throw new error_1.CloudBaseError('没有可以使用的环境，请先开通云开发服务并创建环境（https://console.cloud.tencent.com/tcb）');
        }
        const { env } = yield inquirer_1.default.prompt({
            type: 'list',
            name: 'env',
            message: '选择关联环境',
            choices: envs
        });
        const { projectName } = yield inquirer_1.default.prompt({
            type: 'input',
            name: 'projectName',
            message: '请输入项目名称',
            default: 'cloudbase-demo'
        });
        const { lang } = yield inquirer_1.default.prompt({
            type: 'list',
            name: 'lang',
            message: '选择模板语言',
            choices: ['PHP', 'Java', 'Node']
        });
        loading.start('拉取云开发模板列表中');
        const templateList = yield utils_1.fetch(listUrl);
        loading.stop();
        const templates = templateList.filter(item => item.lang === lang);
        const { selectTemplateName } = yield inquirer_1.default.prompt({
            type: 'list',
            name: 'selectTemplateName',
            message: '选择云开发模板',
            choices: templates.map(item => item.name)
        });
        const selectedTemplate = templates.find(item => item.name === selectTemplateName);
        const projectPath = path_1.default.join(process.cwd(), projectName);
        if (fs_1.default.existsSync(projectPath)) {
            const { cover } = yield inquirer_1.default.prompt({
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
        loading.start('下载文件中');
        if (cmd.server) {
            yield copyServerTemplate(projectPath);
            fs_1.default.renameSync(path_1.default.join(projectPath, '_gitignore'), path_1.default.join(projectPath, '.gitignore'));
        }
        else {
            yield extractTemplate(projectPath, selectedTemplate.path);
        }
        loading.stop();
        const configFileJSONPath = path_1.default.join(projectPath, 'cloudbaserc.json');
        const configFileJSPath = path_1.default.join(projectPath, 'cloudbaserc.js');
        const configFilePath = [configFileJSPath, configFileJSONPath].find(item => fs_1.default.existsSync(item));
        if (!configFilePath) {
            initSuccessOutput(projectName);
            return;
        }
        const configContent = fs_1.default.readFileSync(configFilePath).toString();
        fs_1.default.writeFileSync(configFilePath, configContent.replace('{{envId}}', env));
        initSuccessOutput(projectName);
    });
});
