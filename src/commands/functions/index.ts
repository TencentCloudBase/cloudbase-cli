import { deploy } from './deploy'
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
import { Command } from '../command'
import {
    createFileLayer,
    listFileLayer,
    attachFileLayer,
    unAttachFileLayer,
    downloadFileLayer,
    sortFileLayer,
    deleteFileLayer
} from './layer'

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
        handler: list
    },
    {
        cmd: 'functions:download <name> [dest]',
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
        handler: codeDownload
    },
    {
        cmd: 'functions:deploy [name]',
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
            },
            {
                flags: '--path <path>',
                desc: '指定云函数的文件夹路径'
            },
            {
                flags: '--all',
                desc: '部署配置文件中的包含的全部云函数'
            }
        ],
        desc: '部署云函数',
        handler: deploy
    },
    {
        cmd: 'functions:delete [name]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '删除云函数',
        handler: deleteFunc
    },
    {
        cmd: 'functions:detail <name>',
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
        handler: detail
    },
    {
        cmd: 'functions:code:update <name>',
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
        handler: codeUpdate
    },
    {
        cmd: 'functions:config:update [name]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '更新云函数配置',
        handler: configUpdate
    },
    {
        cmd: 'functions:copy <name> [newFunctionName]',
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
        handler: copy
    },
    {
        cmd: 'functions:log <name>',
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
        handler: log
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
        handler: triggerCreate
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
        handler: triggerDelete
    },
    {
        cmd: 'functions:invoke [name]',
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
        handler: invoke
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
        handler: async (ctx) => {
            const { options } = ctx
            const { path, name } = options
            // 指定函数路径，以默认配置运行函数
            if (path) {
                await debugFunctionByPath(path, options)
            } else if (typeof name === 'string') {
                await debugByConfig(ctx, name)
            } else {
                throw new CloudBaseError(
                    '请指定运行函数的名称或函数的路径\n\n例如 cloudbase functions:run --name app'
                )
            }
        }
    },
    {
        cmd: 'functions:layer:create <alias>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--file, <file>',
                desc: '文件路径'
            }
        ],
        desc: '创建函数文件层',
        handler: createFileLayer
    },
    {
        cmd: 'functions:layer:list',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--name, <name>',
                desc: '函数名称'
            },
            {
                flags: '--layer, <layer>',
                desc: '文件层别名'
            },
            {
                flags: '--code-secret, <codeSecret>',
                desc: '代码加密的函数的 CodeSecret'
            }
        ],
        desc: '展示文件层列表',
        handler: listFileLayer,
        requiredEnvId: false
    },
    {
        cmd: 'functions:layer:bind <name>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--code-secret, <codeSecret>',
                desc: '代码加密的函数的 CodeSecret'
            }
        ],
        desc: '绑定文件层到云函数',
        handler: attachFileLayer
    },
    {
        cmd: 'functions:layer:unbind <name>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--code-secret, <codeSecret>',
                desc: '代码加密的函数的 CodeSecret'
            }
        ],
        desc: '删除云函数绑定的文件层',
        handler: unAttachFileLayer
    },
    {
        cmd: 'functions:layer:download',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--dest <dest>',
                desc: '下载文件存放的地址'
            }
        ],
        desc: '下载云函数文件层',
        handler: downloadFileLayer
    },
    {
        cmd: 'functions:layer:sort <name>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--code-secret, <codeSecret>',
                desc: '代码加密的函数的 CodeSecret'
            }
        ],
        desc: '重新排列云函数绑定的文件层的顺序',
        handler: sortFileLayer
    },
    {
        cmd: 'functions:layer:delete',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '删除当前环境的文件层',
        handler: deleteFileLayer
    }
]

// 注册命令
commands.forEach((item) => {
    const command = new Command(item)
    command.init()
})
