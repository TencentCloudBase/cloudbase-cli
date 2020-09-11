import { run } from '@cloudbase/framework-core'
import { Command, ICommand } from '../common'
import { ICommandContext } from '../../types'
import { InjectParams, CmdContext, ArgsParams, Log, Logger } from '../../decorators'

import * as Hosting from '../../hosting'
import * as Function from '../../function'
import { authSupevisor } from '../../utils'

async function callFramework(ctx, command, moudle, params?) {
    const { envId, config } = ctx
    const { bumpVersion, versionRemark } = ctx.options

    const loginState = await authSupevisor.getLoginState()
    const { token, secretId, secretKey } = loginState

    await run(
        {
            projectPath: process.cwd(),
            cloudbaseConfig: {
                secretId,
                secretKey,
                token,
                envId
            },
            config,
            logLevel: process.argv.includes('--verbose') ? 'debug' : 'info',
            resourceProviders: {
                hosting: Hosting,
                function: Function
            },
            bumpVersion: Boolean(bumpVersion),
            versionRemark
        },
        command,
        moudle,
        params
    )
}

@ICommand()
export class FrameworkDeploy extends Command {
    get options() {
        return {
            cmd: 'framework:deploy [module]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                { flags: '--verbose', desc: '是否打印详细日志' }
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

@ICommand()
export class FrameworkCompile extends Command {
    get options() {
        return {
            cmd: 'framework:compile [module]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                { flags: '--verbose', desc: '是否打印详细日志' },
                { flags: '--bumpVersion', desc: '是否生成新版本' },
                {
                    flags: '--versionRemark <versionRemark>',
                    desc: '新版本描述信息'
                }
            ],
            desc: '云开发 Serverless 应用框架：编译应用描述文件'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx: ICommandContext, @Log() logger: Logger, @ArgsParams() params) {
        const [module] = params || []
        await callFramework(ctx, 'compile', module)
    }
}

@ICommand()
export class FrameworkRun extends Command {
    get options() {
        return {
            cmd: 'framework:run [module] [runCommand]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '云开发 Serverless 应用框架：执行本地命令'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx: ICommandContext, @Log() logger: Logger, @ArgsParams() params) {
        const [module, runCommand] = params || []
        await callFramework(ctx, 'run', module, { runCommand })
    }
}
