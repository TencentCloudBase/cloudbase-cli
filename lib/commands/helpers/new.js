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
exports.isGitUrl = exports.NewCommand = void 0;
const fs_1 = __importDefault(require("fs"));
const lodash_1 = __importDefault(require("lodash"));
const open_1 = __importDefault(require("open"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const execa_1 = __importDefault(require("execa"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const enquirer_1 = require("enquirer");
const toolbox_1 = require("@cloudbase/toolbox");
const common_1 = require("../common");
const error_1 = require("../../error");
const env_1 = require("../../env");
const utils_1 = require("../../utils");
const auth_1 = require("../../auth");
const constant_1 = require("../../constant");
const decorators_1 = require("../../decorators");
const listUrl = 'https://tcli.service.tcloudbase.com/templates';
const consoleUrl = 'https://console.cloud.tencent.com/tcb/env/index?action=CreateEnv&from=cli';
const CREATE_ENV = 'CREATE';
const getTemplateAddress = (templatePath) => `https://7463-tcli-1258016615.tcb.qcloud.la/cloudbase-templates/${templatePath}.zip`;
const ENV_INIT_TIP = '环境初始化中，预计需要三分钟';
let NewCommand = class NewCommand extends common_1.Command {
    get options() {
        return {
            cmd: 'new [appName] [templateUri]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '创建一个新的云开发应用',
            requiredEnvId: false,
            withoutAuth: true
        };
    }
    execute(ctx, log) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { params, envId } = ctx;
            let appName = params === null || params === void 0 ? void 0 : params[0];
            const templateUri = params === null || params === void 0 ? void 0 : params[1];
            yield this.checkLogin();
            const env = yield this.getSelectedEnv(envId);
            yield this.checkEnvStatus(env);
            let projectPath;
            if (templateUri && isGitUrl(templateUri)) {
                yield execa_1.default('git', ['clone', templateUri, appName], {
                    stdio: 'inherit'
                });
                projectPath = path_1.default.join(process.cwd(), appName);
            }
            else {
                const templates = yield utils_1.execWithLoading(() => utils_1.fetch(listUrl), {
                    startTip: '获取应用模板列表中'
                });
                let templateName;
                let tempateId;
                if (templateUri) {
                    tempateId = templateUri;
                }
                else {
                    let { selectTemplateName } = yield enquirer_1.prompt({
                        type: 'select',
                        name: 'selectTemplateName',
                        message: '选择应用模板',
                        choices: templates.map((item) => item.name)
                    });
                    templateName = selectTemplateName;
                }
                const selectedTemplate = templateName
                    ? templates.find((item) => item.name === templateName)
                    : templates.find((item) => item.path === tempateId);
                if (!selectedTemplate) {
                    log.info(`模板 \`${templateName || tempateId}\` 不存在`);
                    return;
                }
                if (!appName) {
                    const { projectName } = yield enquirer_1.prompt({
                        type: 'input',
                        name: 'projectName',
                        message: '请输入项目名称',
                        initial: selectedTemplate.path
                    });
                    appName = projectName;
                }
                projectPath = path_1.default.join(process.cwd(), appName);
                if (utils_1.checkFullAccess(projectPath)) {
                    const { cover } = yield enquirer_1.prompt({
                        type: 'confirm',
                        name: 'cover',
                        message: `已存在同名文件夹：${appName}，是否覆盖？`,
                        initial: false
                    });
                    if (!cover) {
                        throw new error_1.CloudBaseError('操作终止！');
                    }
                    else {
                        fs_extra_1.default.removeSync(projectPath);
                    }
                }
                yield utils_1.execWithLoading(() => __awaiter(this, void 0, void 0, function* () {
                    yield utils_1.templateDownloadReport(selectedTemplate.path, selectedTemplate.name);
                    yield this.extractTemplate(projectPath, selectedTemplate.path, selectedTemplate.url);
                }), {
                    startTip: '下载文件中'
                });
            }
            let filepath = (_a = (yield toolbox_1.searchConfig(projectPath))) === null || _a === void 0 ? void 0 : _a.filepath;
            if (!filepath) {
                fs_1.default.writeFileSync(path_1.default.join(projectPath, 'cloudbaserc.json'), JSON.stringify({
                    envId: env,
                    version: '2.0',
                    $schema: 'https://framework-1258016615.tcloudbaseapp.com/schema/latest.json'
                }));
            }
            else {
                const configContent = fs_1.default.readFileSync(filepath).toString();
                fs_1.default.writeFileSync(filepath, configContent.replace('{{envId}}', env));
            }
            this.initSuccessOutput(appName);
        });
    }
    getSelectedEnv(inputEnvId, log) {
        return __awaiter(this, void 0, void 0, function* () {
            const isInitNow = yield this.checkTcbService();
            let envData = [];
            if (isInitNow) {
                envData = yield utils_1.execWithLoading(() => {
                    return new Promise((resolve) => {
                        const timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                            const envs = yield env_1.listEnvs();
                            if (envs.length) {
                                clearInterval(timer);
                                resolve(envs);
                            }
                        }), 2000);
                    });
                }, {
                    startTip: '获取环境列表中'
                });
            }
            else {
                envData = yield utils_1.execWithLoading(() => env_1.listEnvs(), {
                    startTip: '获取环境列表中'
                });
            }
            envData = envData || [];
            if ((envData === null || envData === void 0 ? void 0 : envData.length) && inputEnvId) {
                const inputEnvIdExist = envData.find((_) => _.EnvId === inputEnvId);
                if (!inputEnvIdExist) {
                    throw new error_1.CloudBaseError(`你指定的环境 Id ${inputEnvId} 不存在，请指定正确的环境 Id！`);
                }
                return inputEnvId;
            }
            const envs = envData
                .map((item) => {
                let name = `${item.Alias} - [${item.EnvId}:${item.PackageName || '按量计费'}]`;
                if (item.Status !== "NORMAL") {
                    name += `（${constant_1.STATUS_TEXT[item.Status]}）`;
                }
                return {
                    name,
                    value: item.EnvId
                };
            })
                .sort((prev, next) => prev.value.charCodeAt(0) - next.value.charCodeAt(0));
            const choices = [
                ...envs,
                {
                    name: envData.length ? '创建新环境' : '无可用环境，创建新环境',
                    value: CREATE_ENV
                }
            ];
            let { env } = yield enquirer_1.prompt({
                choices,
                type: 'select',
                name: 'env',
                message: '选择关联的云开发环境',
                result(choice) {
                    return this.map(choice)[choice];
                }
            });
            if (env === CREATE_ENV) {
                log.success('已打开控制台，请前往控制台创建环境');
                const { envId } = yield toolbox_1.getDataFromWeb((port) => `${consoleUrl}&port=${port}`, 'getData');
                if (!envId) {
                    throw new error_1.CloudBaseError('接收环境 Id 信息失败，请重新运行 init 命令！');
                }
                log.success(`创建环境成功，环境 Id: ${envId}`);
                env = envId;
            }
            return env;
        });
    }
    checkLogin(log) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const credential = yield utils_1.checkAndGetCredential();
            if (lodash_1.default.isEmpty(credential)) {
                log.info('你还没有登录，请在控制台中授权登录');
                const res = yield utils_1.execWithLoading(() => auth_1.login(), {
                    startTip: '获取授权中...',
                    successTip: '授权登录成功！'
                });
                const envId = (_a = res === null || res === void 0 ? void 0 : res.credential) === null || _a === void 0 ? void 0 : _a.envId;
                if (envId) {
                    const env = yield env_1.getEnvInfo(envId);
                    if (env.Status === "UNAVAILABLE") {
                        yield this.checkEnvAvaliable(envId);
                    }
                }
            }
        });
    }
    checkEnvStatus(envId) {
        return __awaiter(this, void 0, void 0, function* () {
            const env = yield env_1.getEnvInfo(envId);
            if (env.Status === "UNAVAILABLE") {
                yield this.checkEnvAvaliable(envId);
            }
            else if (env.Status !== "NORMAL") {
                throw new error_1.CloudBaseError('所有环境状态异常');
            }
        });
    }
    checkEnvAvaliable(envId) {
        return __awaiter(this, void 0, void 0, function* () {
            let count = 0;
            yield utils_1.execWithLoading((flush) => {
                const increase = setInterval(() => {
                    flush(`${ENV_INIT_TIP}  ${++count}S`);
                }, 1000);
                return new Promise((resolve) => {
                    const timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                        const env = yield env_1.getEnvInfo(envId);
                        if (env.Status === "NORMAL") {
                            clearInterval(timer);
                            clearInterval(increase);
                            resolve();
                        }
                    }), 3000);
                });
            }, {
                startTip: ENV_INIT_TIP,
                successTip: `环境 ${envId} 初始化成功`
            });
        });
    }
    checkTcbService(log) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = yield utils_1.getMangerService();
            let Initialized;
            try {
                Initialized = (yield app.env.checkTcbService()).Initialized;
            }
            catch (e) {
                if (!toolbox_1.isCamRefused(e)) {
                    throw e;
                }
            }
            if (!Initialized) {
                const { jump } = yield enquirer_1.prompt({
                    type: 'confirm',
                    name: 'jump',
                    message: '你还没有开通云开发服务，是否跳转到控制台开通云开发服务？（取消将无法继续操作）',
                    initial: true
                });
                if (!jump) {
                    throw new error_1.CloudBaseError('init 操作终止，请开通云开发服务后再进行操作！');
                }
                open_1.default(consoleUrl);
                log.success('已打开云开发控制台，请登录并在云开发控制台中开通服务！');
                yield utils_1.execWithLoading(() => this.waitForServiceEnable(), {
                    startTip: '等待云开发服务开通中',
                    successTip: '云开发服务开通成功！'
                });
                return true;
            }
            return false;
        });
    }
    waitForServiceEnable() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    const app = yield utils_1.getMangerService();
                    try {
                        const { Initialized } = yield app.env.checkTcbService();
                        if (Initialized) {
                            clearInterval(timer);
                            setTimeout(() => {
                                resolve();
                            }, 5000);
                        }
                    }
                    catch (e) {
                        if (!toolbox_1.isCamRefused(e)) {
                            throw e;
                        }
                    }
                }), 3000);
            });
        });
    }
    extractTemplate(projectPath, templatePath, remoteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = remoteUrl || getTemplateAddress(templatePath);
            return utils_1.fetchStream(url).then((res) => __awaiter(this, void 0, void 0, function* () {
                if (!res) {
                    throw new error_1.CloudBaseError('请求异常');
                }
                if (res.status !== 200) {
                    throw new error_1.CloudBaseError('未找到文件');
                }
                yield toolbox_1.unzipStream(res.body, projectPath);
            }));
        });
    }
    initSuccessOutput(appName, log) {
        log.success(appName ? `创建应用 ${appName} 成功！\n` : '创建应用成功！');
        if (appName) {
            const command = chalk_1.default.bold.cyan(`cd ${appName}`);
            log.info(`👉 执行命令 ${command} 进入文件夹`);
        }
        log.info(`👉 开发完成后，执行命令 ${chalk_1.default.bold.cyan('tcb')} 一键部署`);
    }
};
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.CmdContext()), __param(1, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], NewCommand.prototype, "execute", null);
__decorate([
    __param(1, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], NewCommand.prototype, "getSelectedEnv", null);
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], NewCommand.prototype, "checkLogin", null);
__decorate([
    decorators_1.InjectParams(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewCommand.prototype, "checkEnvStatus", null);
__decorate([
    decorators_1.InjectParams(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewCommand.prototype, "checkEnvAvaliable", null);
__decorate([
    decorators_1.InjectParams(),
    __param(0, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [decorators_1.Logger]),
    __metadata("design:returntype", Promise)
], NewCommand.prototype, "checkTcbService", null);
__decorate([
    decorators_1.InjectParams(),
    __param(1, decorators_1.Log()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, decorators_1.Logger]),
    __metadata("design:returntype", void 0)
], NewCommand.prototype, "initSuccessOutput", null);
NewCommand = __decorate([
    common_1.ICommand()
], NewCommand);
exports.NewCommand = NewCommand;
function isGitUrl(url) {
    const regex = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
    return regex.test(url);
}
exports.isGitUrl = isGitUrl;
