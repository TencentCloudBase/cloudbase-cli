import _ from 'lodash'
import { Command, ICommand } from '../common'
import {
    InjectParams,
    Log,
    Logger,
    CmdContext,
    ArgsOptions,
    IsPrivateEnv,
    Config
} from '../../decorators'
import { getLowcodeCli, getCmdConfig, getMergedOptions } from './utils'
import { CloudBaseError } from '../../error'
import { ICommandContext } from '../../types'
import { authSupevisor, getPrivateSettings } from '../../utils'

// use dynamic import for lowcode-cli to reduce setup time
type LowcodeCli = typeof import('@cloudbase/lowcode-cli')

let lowcodeCli: LowcodeCli | undefined

if (process.argv.includes('lowcode')) {
    // cannot use top-level await here
    getLowcodeCli().then((_) => (lowcodeCli = _))
}

@ICommand({
    supportPrivate: true
})
export class LowCodeWatch extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'watch',
            options: [
                {
                    flags: '--verbose',
                    desc: '是否打印详细日志'
                },
                {
                    flags: '--wx-devtool-path <wxDevtoolPath>',
                    desc: '微信开发者工具的安装路径'
                },
                {
                    flags: '--force-install',
                    desc: '是否忽略安装依赖包'
                }
            ],
            desc: '开启微搭低代码的本地构建模式',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options) {
        const config = getCmdConfig(ctx.config, this.options)
        const mergesOptions = getMergedOptions(config, options)
        import('@cloudbase/lowcode-cli').then(async (res) => {
            await res.watchApp({
                watchPort: 8288,
                wxDevtoolPath: options?.wxDevtoolPath,
                forceInstall: options?.forceInstall,
            })
        })
    }
}

@ICommand({ supportPrivate: true })
export class LowCodeBuildApp extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'build:app',
            options: [
                {
                    flags: '--clean',
                    desc: '清理构建目录'
                },
                {
                    flags: '--out <out>',
                    desc: '输出目录'
                }
            ],
            desc: '构建应用',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(
        @CmdContext() ctx: ICommandContext,
        @Log() log: Logger,
        @ArgsOptions() options: any
    ) {
        const config = getCmdConfig(ctx.config, this.options)
        const mergesOptions = getMergedOptions(config, options)
        await lowcodeCli.buildApp(
            {
                envId: ctx.envId || ctx.config.envId,
                projectPath: process.cwd(),
                logger: log,
                privateSettings: getPrivateSettings(ctx.config, this.options.cmd)
            },
            mergesOptions
        )
    }
}

@ICommand({ supportPrivate: true })
export class LowCodeDeployApp extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'publish:app',
            options: [
                {
                    flags: '--src <src>',
                    desc: '部署目录'
                }
            ],
            desc: '发布应用',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(
        @CmdContext() ctx: ICommandContext,
        @Log() log: Logger,
        @ArgsOptions() options: any
    ) {
        let credential
        const privateSettings = getPrivateSettings(ctx.config, this.options.cmd)
        const config = getCmdConfig(ctx.config, this.options)
        const { src, ...restMergedOptions } = getMergedOptions(config, options)

        if (ctx.hasPrivateSettings) {
            process.env.IS_PRIVATE = 'true'
            credential = privateSettings.credential
        } else {
            credential = await authSupevisor.getLoginState()
        }

        await lowcodeCli.deployApp(
            {
                envId: ctx.envId || ctx.config.envId,
                projectPath: process.cwd(),
                logger: log,
                privateSettings
            },
            {
                credential,
                ...restMergedOptions,
                projectPath: src || restMergedOptions.projectPath
            }
        )
    }
}
