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
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const tar_fs_1 = __importDefault(require("tar-fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const enquirer_1 = require("enquirer");
const toolbox_1 = require("@cloudbase/toolbox");
const common_1 = require("../common");
const env_1 = require("../../env");
const error_1 = require("../../error");
const decorators_1 = require("../../decorators");
const utils_1 = require("../../utils");
const listUrl = 'https://cli.service.tcloudbase.com/list';
let InitCommand = class InitCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'init',
            options: [
                {
                    flags: '--template <template>',
                    desc: '指定项目模板名称'
                },
                {
                    flags: '--project <project>',
                    desc: '指定项目名称'
                },
                {
                    flags: '--server',
                    desc: '创建派主机 Node 项目'
                }
            ],
            desc: '创建并初始化一个新的云开发项目',
            requiredEnvId: false
        };
    }
    execute(options, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const loading = utils_1.loadingFactory();
            loading.start('拉取环境列表中');
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
                .filter((item) => item.Status === 'NORMAL')
                .map((item) => ({
                name: `${item.Alias} - [${item.EnvId}:${item.PackageName || '空'}]`,
                value: item.EnvId
            }))
                .sort();
            if (!envs.length) {
                throw new error_1.CloudBaseError('没有可以使用的环境，请使用 cloudbase env:create $name 命令创建免费环境！');
            }
            const { env } = yield enquirer_1.prompt({
                type: 'select',
                name: 'env',
                message: '选择关联环境',
                choices: envs,
                result(choice) {
                    return this.map(choice)[choice];
                }
            });
            let projectName;
            if (options.project) {
                projectName = options.project;
            }
            else {
                const { projectName: promptProjectName } = yield enquirer_1.prompt({
                    type: 'input',
                    name: 'projectName',
                    message: '请输入项目名称',
                    initial: 'cloudbase-demo'
                });
                projectName = promptProjectName;
            }
            loading.start('拉取云开发模板列表中');
            const templates = yield utils_1.fetch(listUrl);
            loading.stop();
            let templateName;
            if (options.template) {
                templateName = options.template;
            }
            else {
                let { selectTemplateName } = yield enquirer_1.prompt({
                    type: 'select',
                    name: 'selectTemplateName',
                    message: '选择云开发模板',
                    choices: templates.map((item) => item.name)
                });
                templateName = selectTemplateName;
            }
            const selectedTemplate = templates.find((item) => item.name === templateName);
            if (!selectedTemplate) {
                logger.info(`模板 \`${templateName}\` 不存在`);
                return;
            }
            const projectPath = path_1.default.join(process.cwd(), projectName);
            if (utils_1.checkFullAccess(projectPath)) {
                const { cover } = yield enquirer_1.prompt({
                    type: 'confirm',
                    name: 'cover',
                    message: `已存在同名文件夹：${projectName}，是否覆盖？`,
                    initial: false
                });
                if (!cover) {
                    throw new error_1.CloudBaseError('操作终止！');
                }
                else {
                    fs_extra_1.default.removeSync(projectPath);
                }
            }
            loading.start('下载文件中');
            if (options.server) {
                yield this.copyServerTemplate(projectPath);
                fs_1.default.renameSync(path_1.default.join(projectPath, '_gitignore'), path_1.default.join(projectPath, '.gitignore'));
            }
            else {
                yield this.extractTemplate(projectPath, selectedTemplate.path);
            }
            loading.stop();
            const { filepath } = yield toolbox_1.searchConfig(projectPath);
            if (!filepath) {
                this.initSuccessOutput(projectName);
                return;
            }
            const configContent = fs_1.default.readFileSync(filepath).toString();
            fs_1.default.writeFileSync(filepath, configContent.replace('{{envId}}', env));
            this.initSuccessOutput(projectName);
        });
    }
    extractTemplate(projectPath, templatePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://636c-cli-1252710547.tcb.qcloud.la/cloudbase-templates/${templatePath}.tar.gz`;
            return utils_1.fetchStream(url).then((res) => __awaiter(this, void 0, void 0, function* () {
                if (!res) {
                    throw new error_1.CloudBaseError('请求异常');
                }
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
    copyServerTemplate(projectPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const templatePath = path_1.default.resolve(__dirname, '../../templates', 'server/node');
            fs_extra_1.default.copySync(templatePath, projectPath);
        });
    }
    initSuccessOutput(projectName, log) {
        log.success(`创建项目 ${projectName} 成功！\n`);
        const command = chalk_1.default.bold.cyan(`cd ${projectName}`);
        log.info('🎉 欢迎贡献你的模板 👉');
        log.printClickableLink('https://github.com/TencentCloudBase/cloudbase-templates');
        log.info(`👉 执行命令 ${command} 进入项目文件夹，👉 执行命令 ${chalk_1.default.bold.cyan('cloudbase framework:deploy')} 一键部署`);
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.ArgsOptions()), __param(1, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], InitCommand.prototype, "execute", null);
__decorate([
    decorators_1.InjectParams(),
    __param(1, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, decorators_1.Logger]),
    __metadata("design:returntype", void 0)
], InitCommand.prototype, "initSuccessOutput", null);
InitCommand = __decorate([
    common_1.ICommand()
], InitCommand);
exports.InitCommand = InitCommand;
