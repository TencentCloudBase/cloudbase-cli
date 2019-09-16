"use strict";
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
async function getFunctionContext(name, envId, configPath) {
    const cloudBaseConfig = await utils_1.resolveCloudBaseConfig(configPath);
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
        handler: async (envId, options) => {
            const { configFile } = options.parent;
            const ctx = await getFunctionContext('', envId, configFile);
            await list_1.list(ctx, options);
        }
    },
    {
        cmd: 'functions:deploy [functionName] [envId]',
        options: [
            {
                flags: '--force',
                desc: '如果存在同名函数，上传后覆盖同名函数'
            }
        ],
        desc: '创建云函数',
        handler: async (name, envId, options) => {
            const { configFile } = options.parent;
            const ctx = await getFunctionContext(name, envId, configFile);
            await deploy_1.deploy(ctx, options);
        }
    },
    {
        cmd: 'functions:delete [functionName] [envId]',
        options: [],
        desc: '删除云函数',
        handler: async (name, envId, options) => {
            const { configFile } = options.parent;
            const ctx = await getFunctionContext(name, envId, configFile);
            await delete_1.deleteFunc(ctx);
        }
    },
    {
        cmd: 'functions:detail [functionName] [envId]',
        options: [],
        desc: '获取云函数信息',
        handler: async (name, envId, options) => {
            const { configFile } = options.parent;
            const ctx = await getFunctionContext(name, envId, configFile);
            await detail_1.detail(ctx);
        }
    },
    {
        cmd: 'functions:invoke [functionName] [params] [envId]',
        options: [],
        desc: '触发云函数',
        handler: async (name, jsonStringParams, envId, options) => {
            const { configFile } = options.parent;
            const ctx = await getFunctionContext(name, envId, configFile);
            await invoke_1.invoke(ctx, jsonStringParams);
        }
    },
    {
        cmd: 'functions:code:update <functionName> [envId]',
        options: [],
        desc: '更新云函数代码',
        handler: async (name, envId, options) => {
            const { configFile } = options.parent;
            const ctx = await getFunctionContext(name, envId, configFile);
            await code_update_1.codeUpdate(ctx);
        }
    },
    {
        cmd: 'functions:config:update [functionName] [envId]',
        options: [],
        desc: '更新云函数配置',
        handler: async (name, envId, options) => {
            const { configFile } = options.parent;
            const ctx = await getFunctionContext(name, envId, configFile);
            await config_update_1.configUpdate(ctx);
        }
    },
    {
        cmd: 'functions:copy <functionName> <newFunctionName> [envId] [targentEnvId]',
        options: [
            {
                flags: '--force',
                desc: '如果目标环境下存在同名函数，覆盖原函数'
            }
        ],
        desc: '拷贝云函数',
        handler: async (functionName, newFunctionName, envId, targentEnvId, options) => {
            const { configFile } = options.parent;
            const ctx = await getFunctionContext(functionName, envId, configFile);
            await copy_1.copy(ctx, newFunctionName, targentEnvId, options);
        }
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
        handler: async (name, envId, options) => {
            const { configFile } = options.parent;
            const ctx = await getFunctionContext(name, envId, configFile);
            await log_1.log(ctx, options);
        }
    },
    {
        cmd: 'functions:trigger:create [functionName] [envId]',
        options: [],
        desc: '创建云函数触发器',
        handler: async (name, envId, options) => {
            const { configFile } = options.parent;
            const ctx = await getFunctionContext(name, envId, configFile);
            await trigger_create_1.triggerCreate(ctx);
        }
    },
    {
        cmd: 'functions:trigger:delete [functionName] [triggerName] [envId]',
        options: [],
        desc: '删除云函数触发器',
        handler: async (functionName, triggerName, envId, options) => {
            const { configFile } = options.parent;
            const ctx = await getFunctionContext(functionName, envId, configFile);
            await trigger_delete_1.triggerDelete(ctx, triggerName);
        }
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
