import program from 'commander'
import { resolveCloudBaseConfig } from '../../utils'
import { GatewayContext } from '../../types'
import { CloudBaseError } from '../../error'
import { createGw } from './create'
import { deleteGw } from './delete'
import { queryGw } from './query'
import { bindGwDomain } from './domain-bind'
import { unbindGwDomain } from './domain-unbind'
import { queryGwDomain } from './domain-query'

async function getGatewayContext(
    envId: string,
    configPath: string,
): Promise<GatewayContext> {
    const cloudBaseConfig = await resolveCloudBaseConfig(configPath)
    const assignEnvId = envId || cloudBaseConfig.envId

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
        cmd: 'service:create <servicePath>',
        options: [
            {
                flags: '-e, --envId [envId]',
                desc: '环境 Id'
            },
            {
                flags: '-f, --function <function>',
                desc: '创建云函数HTTP service'
            }
        ],
        desc: '创建HTTP service',
        handler: async (
            servicePath:string,
            options
        ) => {
            const {
                parent: { configFile },
                envId
            } = options
            const ctx = await getGatewayContext(envId, configFile)
            await createGw(ctx, servicePath, options)
        }
    },

    {
        cmd: 'service:delete',
        options: [
            {
                flags: '-e, --envId [envId]',
                desc: '环境 Id'
            },
            {
                flags: '-p, --service-path <servicePath>',
                desc: 'Service Path'
            },
            {
                flags: '-i, --service-id <serviceId>',
                desc: 'Service Id'
            }
        ],
        desc: '删除HTTP service',
        handler: async (
            options
        ) => {
            const {
                parent: { configFile },
                envId
            } = options
            const ctx = await getGatewayContext(envId, configFile)
            await deleteGw(ctx, options)
        }
    },

    {
        cmd: 'service:list',
        options: [
            {
                flags: '-e, --envId [envId]',
                desc: '环境 Id'
            },
            {
                flags: '-d, --domain <domain>',
                desc: '域名'
            },
            {
                flags: '-p, --service-path <servicePath>',
                desc: 'Service Path'
            },
            {
                flags: '-i, --service-id <serviceId>',
                desc: 'Service Id'
            }
        ],
        desc: '查询HTTP service',
        handler: async (
            options
        ) => {
            const {
                parent: { configFile },
                envId
            } = options
            const ctx = await getGatewayContext(envId, configFile)
            await queryGw(ctx, options)
        }
    },

    {
        cmd: 'service:domain:bind <domain>',
        options: [
            {
                flags: '-e, --envId [envId]',
                desc: '环境 Id'
            }
        ],
        desc: '绑定HTTP service域名',
        handler: async (
            domain: string,
            options
        ) => {
            const {
                parent: { configFile },
                envId
            } = options
            const ctx = await getGatewayContext(envId, configFile)
            await bindGwDomain(ctx, domain)
        }
    },

    {
        cmd: 'service:domain:unbind <domain>',
        options: [
            {
                flags: '-e, --envId [envId]',
                desc: '环境 Id'
            }
        ],
        desc: '解绑HTTP service域名',
        handler: async (
            domain: string,
            options
        ) => {
            const {
                parent: { configFile },
                envId
            } = options
            const ctx = await getGatewayContext(envId, configFile)
            await unbindGwDomain(ctx, domain)
        }
    },

    {
        cmd: 'service:domain:list',
        options: [
            {
                flags: '-e, --envId [envId]',
                desc: '环境 Id'
            },
            {
                flags: '-d, --domain <domain>',
                desc: '域名'
            }
        ],
        desc: '查询HTTP service域名',
        handler: async (
            options
        ) => {
            const {
                parent: { configFile },
                envId
            } = options
            const ctx = await getGatewayContext(envId, configFile)
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
