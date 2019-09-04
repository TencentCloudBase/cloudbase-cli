"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const ora_1 = __importDefault(require("ora"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const commander_1 = __importDefault(require("commander"));
const error_1 = require("../error");
const logger_1 = require("../logger");
const env_1 = require("../env");
commander_1.default
    .command('init')
    .option('--server', '创建 node 项目')
    .description('创建并初始化一个新的项目')
    .action(async function (cmd) {
    const load = ora_1.default('拉取环境列表').start();
    let envData = [];
    try {
        envData = (await env_1.listEnvs()) || [];
    }
    catch (e) {
        load.stop();
        throw e;
    }
    load.succeed('获取环境列表成功');
    const envs = envData.map(item => `${item.EnvId}:${item.PackageName}`);
    if (!envs.length) {
        throw new error_1.CloudBaseError('没有可以使用的环境，请先开通云开发环境（https://console.cloud.tencent.com/tcb）');
    }
    const { env } = await inquirer_1.default.prompt({
        type: 'list',
        name: 'env',
        message: '选择关联环境',
        choices: envs
    });
    const { name } = await inquirer_1.default.prompt({
        type: 'input',
        name: 'name',
        message: '请输入项目名称',
        default: 'cloudbase-demo'
    });
    const templatePath = path_1.default.resolve(__dirname, '../../templates', cmd.server ? 'server/node' : 'faas');
    const projectPath = path_1.default.join(process.cwd(), name);
    if (fs_1.default.existsSync(projectPath)) {
        const { cover } = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'cover',
            message: `已存在同名文件夹：${name}，是否覆盖？`,
            default: false
        });
        if (!cover) {
            throw new error_1.CloudBaseError('操作终止！');
        }
        else {
            fs_extra_1.default.removeSync(projectPath);
        }
    }
    fs_extra_1.default.copySync(templatePath, projectPath);
    fs_1.default.renameSync(path_1.default.join(projectPath, '_gitignore'), path_1.default.join(projectPath, '.gitignore'));
    const configFileJSONPath = path_1.default.join(projectPath, 'cloudbaserc.json');
    const configFileJSPath = path_1.default.join(projectPath, 'cloudbaserc.js');
    const configFilePath = [configFileJSPath, configFileJSONPath].find(item => fs_1.default.existsSync(item));
    const configContent = fs_1.default.readFileSync(configFilePath).toString();
    fs_1.default.writeFileSync(configFilePath, configContent.replace('{{envId}}', env.split(':')[0]));
    logger_1.successLog(`创建项目 ${name} 成功`);
});
