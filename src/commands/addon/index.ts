import { CloudApiService } from '@cloudbase/cloud-api'
import { getProxy } from '@cloudbase/toolbox'
import { ArgsOptions, CmdContext, InjectParams } from '../../decorators'
import { authSupevisor, getPrivateSettings } from '../../utils'
import { Command, ICommand, ICommandOptions } from '../common'
@ICommand({
    supportPrivate: true
})
export class AddonPull extends Command {
    get options() {
        return getOptions({
            childCmd: 'pull',
            options: [
                {
                    flags: '--envId <envId>',
                    desc: '环境 ID'
                }
            ],
            desc: '拉取插件/资源代码',
            requiredEnvId: true,
            hasNameArg: true,
            resourceSupportList: ['automation', 'block']
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options) {
        const cloudService = await getCloudServiceInstance(ctx)
        const { resource } = options
        const { name } = getParams(ctx.params)

        import('@cloudbase/addon-cli').then(async (res) => {
            await res.pull({ name, resource, envId: ctx.envId, cloudService })
        })
    }
}

@ICommand({
    supportPrivate: true
})
export class AddonPush extends Command {
    get options() {
        return getOptions({
            childCmd: 'push',
            desc: '推送插件/资源代码',
            options: [],
            requiredEnvId: true,
            hasNameArg: false,
            resourceSupportList: ['automation', 'block']
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options) {
        const cloudService = await getCloudServiceInstance(ctx)
        const { resource } = options

        import('@cloudbase/addon-cli').then(async (res) => {
            await res.push({ cloudService, envId: ctx.envId, resource })
        })
    }
}

@ICommand({
    supportPrivate: true
})
export class AddonDevSync extends Command {
    get options() {
        return getOptions({
            childCmd: 'dev:sync',
            desc: '本地开发方式：与浏览器编辑器的应用双向同步',
            options: [
                {
                    flags: '--envId <envId>',
                    desc: '环境 ID'
                },
                {
                    flags: '--path <path>',
                    desc: '本地应用代码路径'
                }
            ],
            requiredEnvId: true,
            hasNameArg: true,
            resourceSupportList: ['app']
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options) {
        const cloudService = await getCloudServiceInstance(ctx)
        const { resource, path = '.' } = options
        const { name } = getParams(ctx.params)

        import('@cloudbase/addon-cli').then(async (res) => {
            await res.devSync({ name, cloudService, envId: ctx.envId, resource, path })
        })
    }
}

async function getCloudServiceInstance(
    ctx: any
): Promise<{ lowcode: CloudApiService; tcb: CloudApiService }> {
    let credential
    if (ctx.hasPrivateSettings) {
        process.env.IS_PRIVATE = 'true'
        const privateSettings = getPrivateSettings(ctx.config, this.options.cmd)
        credential = privateSettings.credential
    } else {
        credential = await authSupevisor.getLoginState()
    }

    return {
        lowcode: CloudApiService.getInstance({
            service: 'lowcode',
            proxy: getProxy(),
            credential,
            version: '2021-01-08'
        }),
        tcb: CloudApiService.getInstance({ service: 'tcb', proxy: getProxy(), credential })
    }
}

function getOptions({
    childCmd,
    options,
    desc,
    requiredEnvId,
    hasNameArg,
    resourceSupportList
}: Pick<ICommandOptions, 'childCmd' | 'options' | 'desc' | 'requiredEnvId'> & {
    /**
     * 是否需要提供插件/资源名称的参数
     */
    hasNameArg: boolean
    /**
     * 资源选项的描述
     */
    resourceSupportList?: string[]
}): ICommandOptions {
    return {
        cmd: 'addon',
        childCmd,
        options: [
            {
                flags: '--resource <resource>',
                desc:
                    '资源名称。当想操作指定资源而非插件时使用。当前支持 ' +
                    resourceSupportList.join(' / ')
            },
            ...options
        ],
        args: hasNameArg ? [{ flags: '[name]' }] : [],
        desc,
        requiredEnvId
    }
}

function getParams(ctxParams) {
    const params = ctxParams.filter((param) => typeof param === 'string')
    return {
        name: params[0]
    }
}
