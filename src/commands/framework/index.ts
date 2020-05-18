import { Command, ICommand } from '../common'
import { run } from '@cloudbase/framework-core'
import { ICommandContext } from '../../types'

import { InjectParams, CmdContext, ArgsParams, Log, Logger } from '../../decorators'

import { AuthSupevisor } from '@cloudbase/toolbox'
import { getProxy } from '../../utils'

async function callFramework(ctx, command, module) {
    const { envId, config } = ctx

    const { token, secretId, secretKey } = await AuthSupevisor.getInstance({
        proxy: getProxy()
    }).getLoginState()

    await run(
        {
            projectPath: process.cwd(),
            cloudbaseConfig: {
                secretId,
                secretKey,
                token,
                envId
            },
            config: config.framework,
            logLevel: ctx.options.debug ? 'debug' : 'info'
        },
        command,
        module
    )
}

@ICommand()
export class FramworkDeploy extends Command {
    get options() {
        return {
            cmd: 'framework:deploy [module]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                { flags: '--debug', desc: '是否打印详细日志' }
            ],
            desc: '云开发 Serverless 应用框架：部署全栈应用'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx: ICommandContext, @Log() logger: Logger, @ArgsParams() params) {
        const [module] = params || []
        await callFramework(ctx, 'deploy', module)
    }
}
