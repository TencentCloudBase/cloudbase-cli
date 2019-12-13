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
            '未识别到有效的环境 Id 变量，请在项目根目录进行操作或通过 envId 参数指定环境 Id'
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
        cmd: 'gateway:create <gatewayPath> [envId]',
        options: [
            {
                flags: '-f, --function <function>',
                desc: '创建云函数网关.'
            }
        ],
        desc: '创建云函数网关.',
        handler: async (
            gatewayPath:string,
            envId: string,
            options
        ) => {
            const { configFile } = options.parent
            const ctx = await getGatewayContext(envId, configFile)
            await createGw(ctx, gatewayPath, options)
        }
    },

    {
        cmd: 'gateway:delete [envId]',
        options: [
            {
                flags: '-p, --gateway-path <gatewayPath>',
                desc: 'API Path'
            },
            {
                flags: '-i, --gateway-id <gatewayId>',
                desc: 'API id'
            }
        ],
        desc: '删除云函数网关.',
        handler: async (
            envId: string,
            options
        ) => {
            const { configFile } = options.parent
            const ctx = await getGatewayContext(envId, configFile)
            await deleteGw(ctx, options)
        }
    },

    {
        cmd: 'gateway:list [envId]',
        options: [
            {
                flags: '-d, --domain <domain>',
                desc: '域名'
            },
            {
                flags: '-p, --gateway-path <gatewayPath>',
                desc: 'API Path'
            },
            {
                flags: '-i, --gateway-id <gatewayId>',
                desc: 'API id'
            }
        ],
        desc: '查询云函数网关.',
        handler: async (
            envId: string,
            options
        ) => {
            const { configFile } = options.parent
            const ctx = await getGatewayContext(envId, configFile)
            await queryGw(ctx, options)
        }
    },

    {
        cmd: 'gateway:domain:bind <customDomain> [envId]',
        options: [],
        desc: '绑定自定义网关域名.',
        handler: async (
            customDomain: string,
            envId: string,
            options
        ) => {
            const { configFile } = options.parent
            const ctx = await getGatewayContext(envId, configFile)
            await bindGwDomain(ctx, customDomain)
        }
    },

    {
        cmd: 'gateway:domain:unbind <customDomain> [envId]',
        options: [],
        desc: '解绑自定义网关名.',
        handler: async (
            customDomain: string,
            envId: string,
            options
        ) => {
            const { configFile } = options.parent
            const ctx = await getGatewayContext(envId, configFile)
            await unbindGwDomain(ctx, customDomain)
        }
    },

    {
        cmd: 'gateway:domain:list [envId]',
        options: [
            {
                flags: '-d, --domain <domain>',
                desc: '域名'
            }
        ],
        desc: '查询自定义网关域名.',
        handler: async (
            envId: string,
            options
        ) => {
            const { configFile } = options.parent
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
