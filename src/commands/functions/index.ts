import program from 'commander'
import { resolveCloudBaseConfig, getEnvId } from '../../utils'
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
import { debugFunctionByPath, debugByConfig } from './run'

async function getFunctionContext(name: string, options): Promise<FunctionContext> {
    const configPath = options?.parent?.configFile
    const cloudBaseConfig = await resolveCloudBaseConfig(configPath)
    const assignEnvId = await getEnvId(options)

    if (!assignEnvId) {
        throw new CloudBaseError(
            '未识别到有效的环境 Id 变量，请在项目根目录进行操作或通过 -e 参数指定环境 Id'
        )
    }

    let { functions = [] } = cloudBaseConfig

    const ctx: FunctionContext = {
        name,
        functions,
        envId: assignEnvId,
        config: cloudBaseConfig
    }

    return ctx
}

const validOptions = options => {
    if (!options || !options.parent) {
        throw new CloudBaseError('参数异常，请检查您是否输入了正确的命令！')
    }
}

const commands = [
    {
        cmd: 'functions:list',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            { flags: '-l, --limit <limit>', desc: '返回数据长度，默认值为 20' },
            {
                flags: '-o, --offset <offset>',
                desc: '数据偏移量，默认值为 0'
            }
        ],
        desc: '展示云函数列表',
        handler: async options => {
            const ctx = await getFunctionContext('', options)
            await list(ctx, options)
        }
    },
    {
        cmd: 'functions:download <functionName> [dest]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            { flags: '-l, --limit <limit>', desc: '返回数据长度，默认值为 20' },
            {
                flags: '--code-secret <codeSecret>',
                desc: '代码加密的函数的 CodeSecret'
            }
        ],
        desc: '下载云函数代码',
        handler: async (name: string, dest: string, options) => {
            const ctx = await getFunctionContext(name, options)
            await codeDownload(ctx, dest, options)
        }
    },
    {
        cmd: 'functions:deploy [functionName]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--code-secret <codeSecret>',
                desc: '传入此参数将保护代码，格式为 36 位大小字母和数字'
            },
            {
                flags: '--force',
                desc: '如果存在同名函数，上传后覆盖同名函数'
            },
            {
                flags: '--verbose',
                desc: '输出云函数部署细节'
            }
        ],
        desc: '部署云函数',
        handler: async (name: string, options) => {
            const ctx = await getFunctionContext(name, options)
            await deploy(ctx, options)
        }
    },
    {
        cmd: 'functions:delete [functionName]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '删除云函数',
        handler: async (name: string, options) => {
            const ctx = await getFunctionContext(name, options)
            await deleteFunc(ctx)
        }
    },
    {
        cmd: 'functions:detail [functionName]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--code-secret <codeSecret>',
                desc: '代码加密的函数的 CodeSecret'
            }
        ],
        desc: '获取云函数信息',
        handler: async (name: string, options) => {
            const ctx = await getFunctionContext(name, options)
            await detail(ctx, options)
        }
    },
    {
        cmd: 'functions:code:update <functionName>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--code-secret <codeSecret>',
                desc: '传入此参数将保护代码，格式为 36 位大小字母和数字'
            }
        ],
        desc: '更新云函数代码',
        handler: async (name: string, options) => {
            const ctx = await getFunctionContext(name, options)
            await codeUpdate(ctx, options)
        }
    },
    {
        cmd: 'functions:config:update [functionName]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '更新云函数配置',
        handler: async (name: string, options) => {
            const ctx = await getFunctionContext(name, options)
            await configUpdate(ctx)
        }
    },
    {
        cmd: 'functions:copy <functionName> [newFunctionName]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '-t, --target <targetEnvId>',
                desc: '目标环境 Id'
            },
            // {
            //     flags: '--code-secret <codeSecret>',
            //     desc: '代码加密的函数的 CodeSecret'
            // },
            {
                flags: '--force',
                desc: '如果目标环境下存在同名函数，覆盖原函数'
            }
        ],
        desc: '拷贝云函数',
        handler: async (functionName: string, newFunctionName: string, options?) => {
            const { target } = options
            const ctx = await getFunctionContext(functionName, options)
            await copy(ctx, newFunctionName, target, options)
        }
    },
    {
        cmd: 'functions:log <functionName>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
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
        handler: async (name: string, options) => {
            const ctx = await getFunctionContext(name, options)
            await log(ctx, options)
        }
    },
    {
        cmd: 'functions:trigger:create [functionName]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '创建云函数触发器',
        handler: async (name: string, options) => {
            const ctx = await getFunctionContext(name, options)
            await triggerCreate(ctx)
        }
    },
    {
        cmd: 'functions:trigger:delete [functionName] [triggerName]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '删除云函数触发器',
        handler: async (functionName: string, triggerName: string, options) => {
            const ctx = await getFunctionContext(functionName, options)
            await triggerDelete(ctx, triggerName)
        }
    },
    {
        cmd: 'functions:invoke [functionName]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--params <params>',
                desc: '调用函数的入参，JSON 字符串形式'
            }
        ],
        desc: '触发云端部署的云函数',
        handler: async (name: string, options) => {
            const { params } = options
            const ctx = await getFunctionContext(name, options)
            await invoke(ctx, params)
        }
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
        handler: async (options: any) => {
            const { path, name } = options
            // 指定函数路径，以默认配置运行函数
            if (path) {
                await debugFunctionByPath(path, options)
            } else if (typeof name === 'string') {
                const { name } = options
                const ctx = await getFunctionContext(name, options)
                await debugByConfig(ctx, options)
            } else {
                throw new CloudBaseError(
                    '请指定运行函数的名称或函数的路径\n\n例如 cloudbase functions:run --name app'
                )
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
    instance.action((...args) => {
        const option = args.slice(-1)[0]
        // 校验 option 是否正确
        validOptions(option)
        item.handler.apply(null, args)
    })
})
