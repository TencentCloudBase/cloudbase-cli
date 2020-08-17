"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.smartDeploy = void 0;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const lodash_1 = __importDefault(require("lodash"));
const open_1 = __importDefault(require("open"));
const path_1 = __importDefault(require("path"));
const enquirer_1 = require("enquirer");
const framework_core_1 = require("@cloudbase/framework-core");
const toolbox_1 = require("@cloudbase/toolbox");
const error_1 = require("../error");
const env_1 = require("../env");
const utils_1 = require("../utils");
const auth_1 = require("../auth");
const decorators_1 = require("../decorators");
const Hosting = __importStar(require("../hosting"));
const Function = __importStar(require("../function"));
const constant_1 = require("../constant");
const chalk_1 = __importDefault(require("chalk"));
const listUrl = 'https://tcli.service.tcloudbase.com/templates';
const consoleUrl = 'https://console.cloud.tencent.com/tcb/env/index?action=CreateEnv&from=cli';
const CREATE_ENV = 'CREATE';
const getTemplateAddress = (templatePath) => `https://7463-tcli-1258016615.tcb.qcloud.la/cloudbase-templates/${templatePath}.zip`;
const ENV_INIT_TIP = '环境初始化中，预计需要三分钟';
const log = new decorators_1.Logger();
function smartDeploy() {
    return __awaiter(this, void 0, void 0, function* () {
        const loading = utils_1.loadingFactory();
        loading.start('环境检测中');
        yield checkLogin();
        const isInitNow = yield checkTcbService();
        const files = yield fs_1.default.promises.readdir(process.cwd());
        loading.stop();
        const home = os_1.default.homedir();
        const current = process.cwd();
        let relative = current;
        if (current.indexOf(home) > -1) {
            relative = path_1.default.relative(home, current);
        }
        if (!files.length) {
            log.info('当期目录为空，初始化云开发项目\n');
            const envId = yield selectEnv(isInitNow);
            yield initProjectWithTemplate(envId);
        }
        const { setup } = yield enquirer_1.prompt({
            type: 'confirm',
            name: 'setup',
            message: `是否使用云开发部署当期项目 <${chalk_1.default.bold.cyan(relative)}> ？`,
            initial: true
        });
        if (!setup) {
            return;
        }
        const config = yield utils_1.getCloudBaseConfig();
        if (!(config === null || config === void 0 ? void 0 : config.envId)) {
            const envId = yield selectEnv(isInitNow);
            fs_1.default.writeFileSync(path_1.default.join(process.cwd(), 'cloudbaserc.json'), JSON.stringify({ envId }));
        }
        yield callFramework(config.envId, config);
    });
}
exports.smartDeploy = smartDeploy;
function initProjectWithTemplate(envId, projectPath = process.cwd()) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const templates = yield utils_1.execWithLoading(() => utils_1.fetch(listUrl), {
            startTip: '拉取云开发模板列表中'
        });
        const { templateName } = yield enquirer_1.prompt({
            type: 'select',
            name: 'templateName',
            message: '选择云开发模板',
            choices: templates.map((item) => item.name)
        });
        const selectedTemplate = templates.find((item) => item.name === templateName);
        yield utils_1.execWithLoading(() => __awaiter(this, void 0, void 0, function* () {
            yield utils_1.templateDownloadReport(selectedTemplate.path, selectedTemplate.name);
            yield extractTemplate(projectPath, selectedTemplate.path, selectedTemplate.url);
        }), {
            startTip: '下载文件中'
        });
        let filepath = (_a = (yield toolbox_1.searchConfig(projectPath))) === null || _a === void 0 ? void 0 : _a.filepath;
        if (!filepath) {
            fs_1.default.writeFileSync(path_1.default.join(projectPath, 'cloudbaserc.json'), JSON.stringify({ envId }));
        }
        else {
            const configContent = fs_1.default.readFileSync(filepath).toString();
            fs_1.default.writeFileSync(filepath, configContent.replace('{{envId}}', envId));
        }
        log.success('初始化项目成功！\n');
    });
}
function selectEnv(isInitNow) {
    return __awaiter(this, void 0, void 0, function* () {
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
            message: '选择关联环境',
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
        yield checkEnvStatus(env);
        return env;
    });
}
function callFramework(envId, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const loginState = yield utils_1.authSupevisor.getLoginState();
        const { token, secretId, secretKey } = loginState;
        yield framework_core_1.run({
            projectPath: process.cwd(),
            cloudbaseConfig: {
                secretId,
                secretKey,
                token,
                envId
            },
            config,
            logLevel: process.argv.includes('--verbose') ? 'debug' : 'info',
            resourceProviders: {
                hosting: Hosting,
                function: Function
            }
        }, 'deploy', '');
    });
}
function checkLogin() {
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
                    yield checkEnvAvaliable(envId);
                }
            }
        }
    });
}
function checkEnvStatus(envId) {
    return __awaiter(this, void 0, void 0, function* () {
        const env = yield env_1.getEnvInfo(envId);
        if (env.Status === "UNAVAILABLE") {
            yield checkEnvAvaliable(envId);
        }
        else if (env.Status !== "NORMAL") {
            throw new error_1.CloudBaseError('所有环境状态异常');
        }
    });
}
function checkEnvAvaliable(envId) {
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
function checkTcbService() {
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
            yield utils_1.execWithLoading(() => waitForServiceEnable(), {
                startTip: '等待云开发服务开通中',
                successTip: '云开发服务开通成功！'
            });
            return true;
        }
        return false;
    });
}
function waitForServiceEnable() {
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
function extractTemplate(projectPath, templatePath, remoteUrl) {
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
