import program from 'commander'
import { resolveCloudBaseConfig, getEnvId } from '../../utils'
import { GatewayContext } from '../../types'
import { CloudBaseError } from '../../error'
import { createGw } from './create'
import { deleteGw } from './delete'
import { queryGw } from './query'
import { bindGwDomain } from './domain-bind'
import { unbindGwDomain } from './domain-unbind'
import { queryGwDomain } from './domain-query'

async function getGatewayContext(options: any): Promise<GatewayContext> {
    const configPath = options?.parent?.configFile
    const cloudBaseConfig = await resolveCloudBaseConfig(configPath)

    const assignEnvId = await getEnvId(options)

    if (!assignEnvId) {
        throw new CloudBaseError(
            '未识别到有效的环境 Id 变量，请在项目根目录进行操作或通过 -e 参数指定环境 Id'
        )
    }

    const ctx: GatewayContext = {
        envId: assignEnvId,
        config: cloudBaseConfig
    }

    return ctx
}

const commands = [
    {
        cmd: 'service:create',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '-p, --service-path <servicePath>',
                desc: 'Service Path，必须以 "/" 开头'
            },
            {
                flags: '-f, --function <function>',
                desc: 'HTTP Service 路径绑定的云函数名称'
            }
        ],
        desc: '创建 HTTP Service',
        handler: async options => {
            const ctx = await getGatewayContext(options)
            await createGw(ctx, options)
        }
    },
    {
        cmd: 'service:delete',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '-p, --service-path <servicePath>',
                desc: 'Service Path，删除此 Path 对应的 HTTP Service'
            },
            {
                flags: '-i, --service-id <serviceId>',
                desc: 'Service Id，删除此 Id 对应的 HTTP Service'
            },
            {
                flags: '-n, --name <name>',
                desc: '云函数函数名称，删除此函数绑定的所有 HTTP Service'
            }
        ],
        desc: '删除 HTTP Service',
        handler: async options => {
            const ctx = await getGatewayContext(options)
            await deleteGw(ctx, options)
        }
    },
    {
        cmd: 'service:list',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '-d, --domain <domain>',
                desc: '自定义域名'
            },
            {
                flags: '-p, --service-path <servicePath>',
                desc: 'Service Path'
            },
            {
                flags: '-id, --service-id <serviceId>',
                desc: 'Service Id'
            }
        ],
        desc: '获取 HTTP Service 列表',
        handler: async options => {
            const ctx = await getGatewayContext(options)
            await queryGw(ctx, options)
        }
    },
    {
        cmd: 'service:domain:bind <domain>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '绑定自定义 HTTP Service 域名',
        handler: async (domain: string, options) => {
            const ctx = await getGatewayContext(options)
            await bindGwDomain(ctx, domain)
        }
    },
    {
        cmd: 'service:domain:unbind <domain>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '解绑自定义 HTTP Service 域名',
        handler: async (domain: string, options) => {
            const ctx = await getGatewayContext(options)
            await unbindGwDomain(ctx, domain)
        }
    },
    {
        cmd: 'service:domain:list',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '-d, --domain <domain>',
                desc: '域名'
            }
        ],
        desc: '查询自定义 HTTP Service 域名',
        handler: async options => {
            const ctx = await getGatewayContext(options)
            await queryGwDomain(ctx, options)
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
