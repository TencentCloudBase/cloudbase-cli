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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = __importDefault(require("commander"));
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
        const { cmd, options, desc, requiredEnvId = true } = this.options;
        let instance = commander_1.default.command(cmd);
        options.forEach((option) => {
            instance = instance.option(option.flags, option.desc);
        });
        instance.description(desc);
        instance.action((...args) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const params = args.slice(0, -1);
            const cmdOptions = (_a = args.splice(-1)) === null || _a === void 0 ? void 0 : _a[0];
            const config = yield utils_1.getCloudBaseConfig((_b = cmdOptions === null || cmdOptions === void 0 ? void 0 : cmdOptions.parent) === null || _b === void 0 ? void 0 : _b.configFile);
            const envId = (cmdOptions === null || cmdOptions === void 0 ? void 0 : cmdOptions.envId) || (config === null || config === void 0 ? void 0 : config.envId);
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
