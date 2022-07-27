import chalk from 'chalk'
import * as Sentry from '@sentry/node'
import { EventEmitter } from 'events'
import { program, Command as Commander, Option } from 'commander'
import { CloudBaseError } from '../error'
import { ICommandContext } from '../types'
import {
    usageStore,
    collectUsage,
    loadingFactory,
    getNotification,
    getCloudBaseConfig,
    authSupevisor
} from '../utils'

interface ICommandOption {
    flags: string
    desc: string
    hideHelp?: boolean
}

export interface ICommandOptions {
    // 废弃的命令
    deprecateCmd?: string
    // 基础资源命令
    cmd: string
    // 嵌套子命令
    childCmd?:
    | string
    | {
        cmd: string
        desc: string
    }
    childSubCmd?: string
    // 命令选项
    options: ICommandOption[]
    // 命令描述
    desc: string
    // 使用命令时是否必须要传入 EnvId
    requiredEnvId?: boolean
    // 多数命令都需要登陆，不需要登陆的命令需要特别声明
    withoutAuth?: boolean
}

type CommandConstructor = new () => Command

const registrableCommands: CommandConstructor[] = []
const cmdMap = new Map()

// 装饰器收集命令
export function ICommand(): ClassDecorator {
    return (target: any) => {
        registrableCommands.push(target)
    }
}

// 注册命令
export function registerCommands() {
    registrableCommands.forEach((Command) => {
        const command = new Command()
        command.init()
    })
}

// 命令基类
export abstract class Command extends EventEmitter {
    on(
        event: 'preHandle' | 'afterHandle',
        listener: (ctx: ICommandContext, args: any[]) => void
    ): this

    // eslint-disable-next-line
    on(event: string, listener: (ctx: ICommandContext, args: any[]) => void): this {
        super.on(event, listener)
        return this
    }

    // 初始化命令
    public init() {
        const { cmd, childCmd, childSubCmd, deprecateCmd } = this.options

        // 不能使用 new Commander 重复声明同一个命令，需要缓存 cmd 实例
        let instance: Commander

        // 子命令
        if (cmdMap.has(cmd)) {
            instance = cmdMap.get(cmd)
        } else {
            // 新命令或原有的旧命令格式
            instance = program.command(cmd) as Commander
            // @ts-expect-error 这里是用来自定义commander fallback 帮助信息
            instance._helpDescription = '输出帮助信息'
            instance.addHelpCommand('help [command]', '查看命令帮助信息')
            cmdMap.set(cmd, instance)
        }

        if (childCmd) {
            let cmdKey: string
            let cmdName: string
            let desc: string

            if (typeof childCmd === 'string') {
                cmdKey = `${cmd}-${childCmd}`
                cmdName = childCmd
            } else {
                cmdKey = `${cmd}-${childCmd.cmd}`
                cmdName = childCmd.cmd
                desc = childCmd.desc
            }

            if (cmdMap.has(cmdKey)) {
                instance = cmdMap.get(cmdKey)
            } else {
                instance = instance.command(cmdName) as Commander
                // @ts-expect-error 这里是用来自定义commander fallback 帮助信息
                instance._helpDescription = '查看命令帮助信息'
                desc && instance.description(desc)
                cmdMap.set(cmdKey, instance)
            }

            if (childSubCmd) {
                instance = instance.command(childSubCmd) as Commander
            }
        }

        this.createProgram(instance, false)

        if (deprecateCmd) {
            // 构建新的命令提示
            const newCmd = [cmd, childCmd, childSubCmd]
                .filter((_) => _)
                .map((item) => {
                    if (typeof item === 'string') return item
                    return item.cmd
                })
                .join(' ')
            this.createProgram(program.command(deprecateCmd) as Commander, true, newCmd)
        }
    }

    private createProgram(instance: Commander, deprecate: boolean, newCmd?: string) {
        const { cmd, desc, options, requiredEnvId = true, withoutAuth = false } = this.options
        instance.storeOptionsAsProperties(false)
        options.forEach((option) => {

            const { hideHelp } = option
            if (hideHelp) {
                instance.addOption(new Option(option.flags, option.desc).hideHelp())
            } else {
                instance.option(option.flags, option.desc)
            }

        })

        instance.description(desc)

        // tcb <cmd> params options
        instance.action(async (...args) => {
            // 命令的参数
            const params = args.slice(0, -1)
            const cmdOptions = instance.opts()
            const parentOptions = program.opts()

            const config = await getCloudBaseConfig(parentOptions?.configFile)
            const envId = cmdOptions?.envId || config?.envId

            const loginState = await authSupevisor.getLoginState()

            // 校验登陆态
            if (!withoutAuth && !loginState) {
                throw new CloudBaseError('无有效身份信息，请使用 cloudbase login 登录')
            }

            if (!envId && requiredEnvId) {
                throw new CloudBaseError(
                    '未识别到有效的环境 Id，请使用 cloudbaserc 配置文件进行操作或通过 -e 参数指定环境 Id'
                )
            }

            const ctx: ICommandContext = {
                cmd,
                envId,
                config,
                params,
                options: cmdOptions
            }

            // 处理前
            this.emit('preHandle', ctx, args.slice(0, -1))
            await this.preHandle()

            // 废弃警告
            if (deprecate) {
                console.log(
                    chalk.bold.yellowBright(
                        '\n',
                        `⚠️  此命令将被废弃，请使用新的命令 tcb ${newCmd} 代替`
                    ),
                    '\n'
                )
            }

            // 命令处理
            await this.execute(ctx)

            this.emit('afterHandle', ctx, args)
            // 上报数据
            this.afterHandle(ctx)
        })
    }

    private async preHandle() {
        const loading = loadingFactory()
        try {
            loading.start('数据加载中...')
            const res = await getNotification()
            loading.stop()
            if (!res) return
            const { title, content } = res
            console.log(chalk.bold.cyan(title))
            console.log(content, '\n')
        } catch (e) {
            loading.stop()
            Sentry.captureException(e)
        }
    }

    private async afterHandle(ctx) {
        try {
            const { cmd } = ctx
            const agree = await usageStore.get('agreeCollect')
            // 不同意上报、不上报使用数据
            if (!agree) return
            await collectUsage(cmd)
        } catch (e) {
            // 上报错误
            Sentry.captureException(e)
        }
    }

    // 执行命令
    abstract execute(...args: any[]): void

    // 获取命令参数
    abstract get options(): ICommandOptions
}
