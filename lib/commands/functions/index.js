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
const utils_1 = require("../../utils");
const deploy_1 = require("./deploy");
const error_1 = require("../../error");
const code_update_1 = require("./code-update");
const list_1 = require("./list");
const delete_1 = require("./delete");
const detail_1 = require("./detail");
const log_1 = require("./log");
const config_update_1 = require("./config-update");
const trigger_create_1 = require("./trigger-create");
const trigger_delete_1 = require("./trigger-delete");
const invoke_1 = require("./invoke");
const copy_1 = require("./copy");
const code_download_1 = require("./code-download");
const run_1 = require("./run");
function getFunctionContext(name, envId, configPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const cloudBaseConfig = yield utils_1.resolveCloudBaseConfig(configPath);
        const assignEnvId = envId || cloudBaseConfig.envId;
        if (!assignEnvId) {
            throw new error_1.CloudBaseError('未识别到有效的环境 Id 变量，请在项目根目录进行操作或通过 envId 参数指定环境 Id');
        }
        let { functions } = cloudBaseConfig;
        const ctx = {
            name: name,
            functions,
            envId: assignEnvId,
            config: cloudBaseConfig
        };
        return ctx;
    });
}
const commands = [
    {
        cmd: 'functions:list [envId]',
        options: [
            { flags: '-l, --limit <limit>', desc: '返回数据长度，默认值为 20' },
            {
                flags: '-o, --offset <offset>',
                desc: '数据偏移量，默认值为 0'
            }
        ],
        desc: '展示云函数列表',
        handler: (envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getFunctionContext('', envId, configFile);
            yield list_1.list(ctx, options);
        })
    },
    {
        cmd: 'functions:download <functionName> [dest] [envId]',
        options: [
            { flags: '-l, --limit <limit>', desc: '返回数据长度，默认值为 20' },
            {
                flags: '--code-secret <codeSecret>',
                desc: '代码加密的函数的 CodeSecret'
            }
        ],
        desc: '下载云函数代码',
        handler: (name, dest, envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getFunctionContext(name, envId, configFile);
            yield code_download_1.codeDownload(ctx, dest, options);
        })
    },
    {
        cmd: 'functions:deploy [functionName] [envId]',
        options: [
            {
                flags: '--code-secret <codeSecret>',
                desc: '传入此参数将保护代码，格式为 36 位大小字母和数字'
            },
            {
                flags: '--force',
                desc: '如果存在同名函数，上传后覆盖同名函数'
            }
        ],
        desc: '部署云函数',
        handler: (name, envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getFunctionContext(name, envId, configFile);
            yield deploy_1.deploy(ctx, options);
        })
    },
    {
        cmd: 'functions:delete [functionName] [envId]',
        options: [],
        desc: '删除云函数',
        handler: (name, envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getFunctionContext(name, envId, configFile);
            yield delete_1.deleteFunc(ctx);
        })
    },
    {
        cmd: 'functions:detail [functionName] [envId]',
        options: [
            {
                flags: '--code-secret <codeSecret>',
                desc: '代码加密的函数的 CodeSecret'
            }
        ],
        desc: '获取云函数信息',
        handler: (name, envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getFunctionContext(name, envId, configFile);
            yield detail_1.detail(ctx, options);
        })
    },
    {
        cmd: 'functions:code:update <functionName> [envId]',
        options: [
            {
                flags: '--code-secret <codeSecret>',
                desc: '传入此参数将保护代码，格式为 36 位大小字母和数字'
            }
        ],
        desc: '更新云函数代码',
        handler: (name, envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getFunctionContext(name, envId, configFile);
            yield code_update_1.codeUpdate(ctx, options);
        })
    },
    {
        cmd: 'functions:config:update [functionName] [envId]',
        options: [],
        desc: '更新云函数配置',
        handler: (name, envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getFunctionContext(name, envId, configFile);
            yield config_update_1.configUpdate(ctx);
        })
    },
    {
        cmd: 'functions:copy <functionName> <newFunctionName> [envId] [targentEnvId]',
        options: [
            {
                flags: '--code-secret <codeSecret>',
                desc: '代码加密的函数的 CodeSecret'
            },
            {
                flags: '--force',
                desc: '如果目标环境下存在同名函数，覆盖原函数'
            }
        ],
        desc: '拷贝云函数',
        handler: (functionName, newFunctionName, envId, targentEnvId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getFunctionContext(functionName, envId, configFile);
            yield copy_1.copy(ctx, newFunctionName, targentEnvId, options);
        })
    },
    {
        cmd: 'functions:log <functionName> [envId]',
        options: [
            { flags: '-i, --reqId <reqId>', desc: '函数请求 Id' },
            {
                flags: '-o, --offset <offset>',
                desc: '数据的偏移量，Offset + Limit不能大于10000'
            },
            {
                flags: '-l, --limit <limit>',
                desc: '返回数据的长度，Offset + Limit不能大于10000'
            },
            {
                flags: '--order <order>',
                desc: '以升序还是降序的方式对日志进行排序，可选值 desc 和 asc'
            },
            {
                flags: '--orderBy <orderBy>',
                desc: '根据某个字段排序日志,支持以下字段：function_name, duration, mem_usage, start_time'
            },
            {
                flags: '--startTime <startTime>',
                desc: '查询的具体日期，例如：2019-05-16 20:00:00，只能与 endtime 相差一天之内'
            },
            {
                flags: '--endTime <endTime>',
                desc: '查询的具体日期，例如：2019-05-16 20:59:59，只能与 startTime 相差一天之内'
            },
            { flags: '-e, --error', desc: '只返回错误类型的日志' },
            { flags: '-s, --success', desc: '只返回正确类型的日志' }
        ],
        desc: '打印云函数日志',
        handler: (name, envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getFunctionContext(name, envId, configFile);
            yield log_1.log(ctx, options);
        })
    },
    {
        cmd: 'functions:trigger:create [functionName] [envId]',
        options: [],
        desc: '创建云函数触发器',
        handler: (name, envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getFunctionContext(name, envId, configFile);
            yield trigger_create_1.triggerCreate(ctx);
        })
    },
    {
        cmd: 'functions:trigger:delete [functionName] [triggerName] [envId]',
        options: [],
        desc: '删除云函数触发器',
        handler: (functionName, triggerName, envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getFunctionContext(functionName, envId, configFile);
            yield trigger_delete_1.triggerDelete(ctx, triggerName);
        })
    },
    {
        cmd: 'functions:invoke [functionName] [params] [envId]',
        options: [],
        desc: '触发云端部署的云函数',
        handler: (name, jsonStringParams, envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getFunctionContext(name, envId, configFile);
            yield invoke_1.invoke(ctx, jsonStringParams);
        })
    },
    {
        cmd: 'functions:run',
        options: [
            {
                flags: '--path <path>',
                desc: '云函数路径，使用默认配置直接调用云函数，无需配置文件'
            },
            {
                flags: '--name <name>',
                desc: '指定云函数的名称进行调用，需要配置文件'
            },
            {
                flags: '--params <params>',
                desc: '调用函数传入的参数，JSON 字符串格式'
            },
            {
                flags: '--port <port>',
                desc: '启动调试时监听的端口号，默认为 9229'
            },
            {
                flags: '--debug',
                desc: '启动调试模式'
            }
        ],
        desc: '本地运行云函数（当前仅支持 Node）',
        handler: (options) => __awaiter(void 0, void 0, void 0, function* () {
            const { path } = options;
            if (path) {
                yield run_1.debugFunctionByPath(path, options);
            }
            else {
                const { name } = options;
                const { configFile } = options.parent;
                const ctx = yield getFunctionContext(name, '', configFile);
                yield run_1.debugByConfig(ctx, options);
            }
        })
    }
];
commands.forEach(item => {
    let instance = commander_1.default.command(item.cmd);
    item.options.forEach(option => {
        instance = instance.option(option.flags, option.desc);
    });
    instance.description(item.desc);
    instance.action(item.handler);
});
