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
exports.Command = exports.registerCommands = exports.ICommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const Sentry = __importStar(require("@sentry/node"));
const events_1 = require("events");
const error_1 = require("../error");
const utils_1 = require("../utils");
const validOptions = (options) => {
    if (!options || !options.parent) {
        throw new error_1.CloudBaseError('参数异常，请检查您是否输入了正确的命令！');
    }
};
const registrableCommands = [];
const cmdMap = new Map();
function ICommand() {
    return (target) => {
        registrableCommands.push(target);
    };
}
exports.ICommand = ICommand;
function registerCommands() {
    registrableCommands.forEach((Command) => {
        const command = new Command();
        command.init();
    });
}
exports.registerCommands = registerCommands;
class Command extends events_1.EventEmitter {
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
    init() {
        const { cmd, desc, options, childCmd, requiredEnvId = true, withoutAuth = false } = this.options;
        let instance;
        if (cmdMap.has(cmd)) {
            instance = cmdMap.get(cmd);
        }
        else {
            instance = new commander_1.Command(cmd);
            cmdMap.set(cmd, instance);
        }
        if (childCmd) {
            instance = instance.command(childCmd);
        }
        instance.storeOptionsAsProperties(false).passCommandToAction(false);
        options.forEach((option) => {
            instance = instance.option(option.flags, option.desc);
        });
        instance.description(desc);
        instance.action((...args) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const params = args.slice(0, -1);
            const cmdOptions = args.splice(-1);
            const config = yield utils_1.getCloudBaseConfig((_a = cmdOptions === null || cmdOptions === void 0 ? void 0 : cmdOptions.parent) === null || _a === void 0 ? void 0 : _a.configFile);
            const envId = (cmdOptions === null || cmdOptions === void 0 ? void 0 : cmdOptions.envId) || (config === null || config === void 0 ? void 0 : config.envId);
            const loginState = yield utils_1.authSupevisor.getLoginState();
            if (!withoutAuth && !loginState) {
                throw new error_1.CloudBaseError('无有效身份信息，请使用 cloudbase login 登录');
            }
            if (!envId && requiredEnvId) {
                throw new error_1.CloudBaseError('未识别到有效的环境 Id，请使用 cloudbaserc 配置文件进行操作或通过 -e 参数指定环境 Id');
            }
            validOptions(cmdOptions);
            const ctx = {
                cmd,
                envId,
                config,
                params,
                options: cmdOptions
            };
            this.emit('preHandle', ctx, args);
            yield this.preHandle();
            yield this.execute(ctx);
            this.emit('afterHandle', ctx, args);
            this.afterHandle(ctx);
        }));
    }
    preHandle() {
        return __awaiter(this, void 0, void 0, function* () {
            const loading = utils_1.loadingFactory();
            try {
                loading.start('数据加载中...');
                const res = yield utils_1.getNotification();
                loading.stop();
                if (!res)
                    return;
                const { title, content } = res;
                console.log(chalk_1.default.bold.cyan(title));
                console.log(content, '\n');
            }
            catch (e) {
                loading.stop();
                Sentry.captureException(e);
            }
        });
    }
    afterHandle(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cmd } = ctx;
                const agree = yield utils_1.usageStore.get('agreeCollect');
                if (!agree)
                    return;
                yield utils_1.collectUsage(cmd);
            }
            catch (e) {
                Sentry.captureException(e);
            }
        });
    }
}
exports.Command = Command;
