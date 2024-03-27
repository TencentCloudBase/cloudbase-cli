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
                },
                {
                    flags: '--all',
                    desc: '拉取所有插件/资源 (当前只支持 block 资源，可以通过 tcb addon pull block --all 拉取所有资源)'
                }
            ],
            desc: '拉取插件代码',
            requiredEnvId: true,
            hasNameArg: true
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options) {
        const cloudService = await getCloudServiceInstance(ctx)
        const { name, resource } = getParams(ctx.params, options.all ? false : true)

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
            desc: '推送插件代码',
            options: [],
            requiredEnvId: true,
            hasNameArg: false
        })
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options) {
        const cloudService = await getCloudServiceInstance(ctx)
        const { resource } = getParams(ctx.params, false)

        import('@cloudbase/addon-cli').then(async (res) => {
            await res.push({ cloudService, envId: ctx.envId, resource })
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
