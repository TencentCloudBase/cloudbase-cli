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
exports.checkEnvAvaliable = exports.checkEnvStatus = exports.checkTcbService = exports.getSelectRegion = exports.getSelectedEnv = void 0;
const open_1 = __importDefault(require("open"));
const enquirer_1 = require("enquirer");
const toolbox_1 = require("@cloudbase/toolbox");
const error_1 = require("../error");
const env_1 = require("../env");
const constant_1 = require("../constant");
const net_1 = require("./net");
const output_1 = require("./output");
const log_1 = require("./log");
const tcbService = net_1.CloudApiService.getInstance('tcb');
const ENV_INIT_TIP = '环境初始化中，预计需要三分钟';
const CREATE_ENV = 'CREATE';
const consoleUrl = 'https://console.cloud.tencent.com/tcb/env/index?action=CreateEnv&from=cli';
function getSelectedEnv(inputEnvId) {
    return __awaiter(this, void 0, void 0, function* () {
        const isInitNow = yield checkTcbService();
        let envData = [];
        if (isInitNow) {
            envData = yield output_1.execWithLoading(() => {
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
            envData = yield output_1.execWithLoading(() => env_1.listEnvs(), {
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
            message: '请选择关联环境',
            result(choice) {
                return this.map(choice)[choice];
            }
        });
        if (env === CREATE_ENV) {
            log_1.logger.success('已打开控制台，请前往控制台创建环境');
            const { envId } = yield toolbox_1.getDataFromWeb((port) => `${consoleUrl}&port=${port}`, 'getData');
            if (!envId) {
                throw new error_1.CloudBaseError('接收环境 Id 信息失败，请重新运行 init 命令！');
            }
            log_1.logger.success(`创建环境成功，环境 Id: ${envId}`);
            env = envId;
        }
        yield checkEnvStatus(env);
        return env;
    });
}
exports.getSelectedEnv = getSelectedEnv;
function getSelectRegion() {
    return __awaiter(this, void 0, void 0, function* () {
        const { region } = yield enquirer_1.prompt({
            choices: [
                {
                    name: '上海',
                    value: 'ap-shanghai'
                },
                {
                    name: '广州',
                    value: 'ap-guangzhou'
                }
            ],
            type: 'select',
            name: 'region',
            message: '请选择环境所在地域',
            result(choice) {
                return this.map(choice)[choice];
            }
        });
        tcbService.region = region;
        return region;
    });
}
exports.getSelectRegion = getSelectRegion;
function checkTcbService() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield net_1.getMangerService();
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
            log_1.logger.success('已打开云开发控制台，请登录并在云开发控制台中开通服务！');
            yield output_1.execWithLoading(() => waitForServiceEnable(), {
                startTip: '等待云开发服务开通中',
                successTip: '云开发服务开通成功！'
            });
            return true;
        }
        return false;
    });
}
exports.checkTcbService = checkTcbService;
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
exports.checkEnvStatus = checkEnvStatus;
function checkEnvAvaliable(envId) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = 0;
        yield output_1.execWithLoading((flush) => {
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
exports.checkEnvAvaliable = checkEnvAvaliable;
function waitForServiceEnable() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                const app = yield net_1.getMangerService();
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
