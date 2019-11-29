import program from 'commander'
import { resolveCloudBaseConfig } from '../../utils'
import { deploy } from './deploy'
import { FunctionContext } from '../../types'
import { CloudBaseError } from '../../error'
import { codeUpdate } from './code-update'
import { list } from './list'
import { deleteFunc } from './delete'
import { detail } from './detail'
import { log } from './log'
import { configUpdate } from './config-update'
import { triggerCreate } from './trigger-create'
import { triggerDelete } from './trigger-delete'
import { invoke } from './invoke'
import { copy } from './copy'
import { codeDownload } from './code-download'
import { debugFunctionByPath, debugByConfig } from './debug'

async function getFunctionContext(
    name: string,
    envId: string,
    configPath: string
): Promise<FunctionContext> {
    const cloudBaseConfig = await resolveCloudBaseConfig(configPath)
    const assignEnvId = envId || cloudBaseConfig.envId

    if (!assignEnvId) {
        throw new CloudBaseError(
            '未识别到有效的环境 Id 变量，请在项目根目录进行操作或通过 envId 参数指定环境 Id'
        )
    }

    let { functions } = cloudBaseConfig

    const ctx: FunctionContext = {
        name: name,
        functions,
        envId: assignEnvId,
        config: cloudBaseConfig
    }

    return ctx
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
        handler: async (envId: string, options) => {
            const { configFile } = options.parent
            const ctx = await getFunctionContext('', envId, configFile)
            await list(ctx, options)
        }
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
        handler: async (name: string, dest: string, envId: string, options) => {
            const { configFile } = options.parent
            const ctx = await getFunctionContext(name, envId, configFile)
            await codeDownload(ctx, dest, options)
        }
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
        handler: async (name: string, envId: string, options) => {
            const { configFile } = options.parent
            const ctx = await getFunctionContext(name, envId, configFile)
            await deploy(ctx, options)
        }
    },
    {
        cmd: 'functions:delete [functionName] [envId]',
        options: [],
        desc: '删除云函数',
        handler: async (name: string, envId: string, options) => {
            const { configFile } = options.parent
            const ctx = await getFunctionContext(name, envId, configFile)
            await deleteFunc(ctx)
        }
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
        handler: async (name: string, envId: string, options) => {
            const { configFile } = options.parent
            const ctx = await getFunctionContext(name, envId, configFile)
            await detail(ctx, options)
        }
    },
    {
        cmd: 'functions:invoke [functionName] [params] [envId]',
        options: [],
        desc: '触发云函数',
        handler: async (name: string, jsonStringParams: string, envId: string, options) => {
            const { configFile } = options.parent
            const ctx = await getFunctionContext(name, envId, configFile)
            await invoke(ctx, jsonStringParams)
        }
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
        handler: async (name: string, envId: string, options) => {
            const { configFile } = options.parent
            const ctx = await getFunctionContext(name, envId, configFile)
            await codeUpdate(ctx, options)
        }
    },
    {
        cmd: 'functions:config:update [functionName] [envId]',
        options: [],
        desc: '更新云函数配置',
        handler: async (name: string, envId: string, options) => {
            const { configFile } = options.parent
            const ctx = await getFunctionContext(name, envId, configFile)
            await configUpdate(ctx)
        }
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
        handler: async (
            functionName: string,
            newFunctionName: string,
            envId?: string,
            targentEnvId?: string,
            options?
        ) => {
            const { configFile } = options.parent
            const ctx = await getFunctionContext(functionName, envId, configFile)
            await copy(ctx, newFunctionName, targentEnvId, options)
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
                desc:
                    '根据某个字段排序日志,支持以下字段：function_name, duration, mem_usage, start_time'
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
        handler: async (name: string, envId: string, options) => {
            const { configFile } = options.parent
            const ctx = await getFunctionContext(name, envId, configFile)
            await log(ctx, options)
        }
    },
    {
        cmd: 'functions:trigger:create [functionName] [envId]',
        options: [],
        desc: '创建云函数触发器',
        handler: async (name: string, envId: string, options) => {
            const { configFile } = options.parent
            const ctx = await getFunctionContext(name, envId, configFile)
            await triggerCreate(ctx)
        }
    },
    {
        cmd: 'functions:trigger:delete [functionName] [triggerName] [envId]',
        options: [],
        desc: '删除云函数触发器',
        handler: async (functionName: string, triggerName: string, envId: string, options) => {
            const { configFile } = options.parent
            const ctx = await getFunctionContext(functionName, envId, configFile)
            await triggerDelete(ctx, triggerName)
        }
    },
    {
        cmd: 'functions:invoke:local',
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
        desc: '本地运行云函数',
        handler: async (options: any) => {
            const { path } = options
            // 指定函数路径，以默认配置运行函数
            if (path) {
                await debugFunctionByPath(path, options)
            } else {
                const { name } = options
                const { configFile } = options.parent
                const ctx = await getFunctionContext(name, '', configFile)
                await debugByConfig(ctx, options)
            }
        }
    }
]

// 注册命令
commands.forEach(item => {
    let instance = program.command(item.cmd)
    // option
    item.options.forEach(option => {
        instance = instance.option(option.flags, option.desc)
    })

    instance.description(item.desc)
    instance.action(item.handler)
})
