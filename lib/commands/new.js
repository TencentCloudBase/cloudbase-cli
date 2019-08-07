"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const commander_1 = __importDefault(require("commander"));
const error_1 = require("../error");
const logger_1 = require("../logger");
commander_1.default
    .command('new')
    .description('创建一个新的项目')
    .action(async function () {
    const { type } = await inquirer_1.default.prompt({
        type: 'list',
        name: 'type',
        message: '请选择项目类型',
        choices: ['Node', 'Java', 'PHP'],
        default: 'Node'
    });
    const { name } = await inquirer_1.default.prompt({
        type: 'input',
        name: 'name',
        message: '请输入项目名称',
        default: 'tcb-demo'
    });
    const templatePath = path_1.default.resolve(__dirname, '../../templates', type.toLowerCase());
    const projectPath = path_1.default.join(process.cwd(), name);
    if (fs_1.default.existsSync(projectPath)) {
        const { cover } = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'cover',
            message: `已存在同名文件夹：${name}，是否覆盖？`,
            default: false
        });
        if (!cover) {
            throw new error_1.TcbError('操作终止！');
        }
        else {
            fs_extra_1.default.removeSync(projectPath);
        }
    }
    fs_extra_1.default.copySync(templatePath, projectPath);
    fs_1.default.renameSync(path_1.default.join(projectPath, '_gitignore'), path_1.default.join(projectPath, '.gitignore'));
    logger_1.successLog(`创建项目 ${name} 成功`);
});
