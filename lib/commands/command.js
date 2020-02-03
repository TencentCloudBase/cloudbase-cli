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
const commander_1 = __importDefault(require("commander"));
const events_1 = require("events");
const utils_1 = require("../utils");
const error_1 = require("../error");
const validOptions = options => {
    if (!options || !options.parent) {
        throw new error_1.CloudBaseError('参数异常，请检查您是否输入了正确的命令！');
    }
};
class Command extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.options = options;
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
    init() {
        const { cmd, options, desc, handler, requiredEnvId = true } = this.options;
        let instance = commander_1.default.command(cmd);
        options.forEach(option => {
            instance = instance.option(option.flags, option.desc);
        });
        instance.description(desc);
        instance.action((...args) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const cmdOptions = (_a = args.splice(-1)) === null || _a === void 0 ? void 0 : _a[0];
            const configPath = (_c = (_b = cmdOptions) === null || _b === void 0 ? void 0 : _b.parent) === null || _c === void 0 ? void 0 : _c.configFile;
            const config = yield utils_1.resolveCloudBaseConfig(configPath);
            const envId = yield utils_1.getEnvId(cmdOptions);
            if (!envId && requiredEnvId) {
                throw new error_1.CloudBaseError('未识别到有效的环境 Id 变量，请在项目根目录进行操作或通过 -e 参数指定环境 Id');
            }
            validOptions(cmdOptions);
            const ctx = {
                cmd,
                envId,
                config,
                options: cmdOptions
            };
            this.emit('pre-run', ctx, args);
            this.preRun();
            handler(ctx, ...args);
        }));
    }
    preRun() { }
}
exports.Command = Command;
