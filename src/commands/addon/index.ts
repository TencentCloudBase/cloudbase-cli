import { CloudApiService } from '@cloudbase/cloud-api'
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
            desc: '拉取插件代码',
            requiredEnvId: true,
            hasNameArg: true
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options) {
        const tcbService = await getTcbServiceInstance(ctx)
        const { name, resource } = getParams(ctx.params, true)

        import('@cloudbase/addon-cli').then(async (res) => {
            await res.pull({ name, resource, envId: ctx.envId, tcbService })
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
            desc: '推送插件代码',
            options: [],
            requiredEnvId: true,
            hasNameArg: false
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options) {
        const tcbService = await getTcbServiceInstance(ctx)
        const { resource } = getParams(ctx.params, false)

        import('@cloudbase/addon-cli').then(async (res) => {
            await res.push({ tcbService, envId: ctx.envId, resource })
        })
    }
}

async function getTcbServiceInstance(ctx: any): Promise<CloudApiService> {
    let credential
    if (ctx.hasPrivateSettings) {
        process.env.IS_PRIVATE = 'true'
        const privateSettings = getPrivateSettings(ctx.config, this.options.cmd)
        credential = privateSettings.credential
    } else {
        credential = await authSupevisor.getLoginState()
    }

    const tcbService = CloudApiService.getInstance({ service: 'tcb', credential })
    return tcbService
}

function getOptions({
    childCmd,
    options,
    desc,
    requiredEnvId,
    hasNameArg
}: Pick<ICommandOptions, 'childCmd' | 'options' | 'desc' | 'requiredEnvId'> & {
    /**
     * 是否需要提供插件/资源名称的参数
     */
    hasNameArg: boolean
}): ICommandOptions {
    return {
        cmd: 'addon',
        childCmd,
        options,
        args: hasNameArg
            ? [{ flags: '[resource]' }, { flags: '[name]' }]
            : [{ flags: '[resource]' }],
        desc,
        requiredEnvId
    }
}

function getParams(ctxParams, hasNameArg: boolean) {
    const params = ctxParams.filter((param) => typeof param === 'string')
    let name, resource

    if (hasNameArg) {
        if (params.length === 1) {
            name = params[0]
        } else if (params.length === 2) {
            resource = params[0]
            name = params[1]
        }
    } else {
        if (params.length === 1) {
            resource = params[0]
        }
    }

    return {
        name,
        resource
    }
}
