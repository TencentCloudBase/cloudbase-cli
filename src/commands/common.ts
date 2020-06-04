import chalk from 'chalk'
import program from 'commander'
import * as Sentry from '@sentry/node'
import { EventEmitter } from 'events'
import { CloudBaseError } from '../error'
import { ICommandContext } from '../types'
import {
    usageStore,
    collectUsage,
    loadingFactory,
    getNotification,
    getCloudBaseConfig
} from '../utils'

interface ICommandOption {
    flags: string
    desc: string
}

export interface ICommandOptions {
    cmd: string
    options: ICommandOption[]
    desc: string
    requiredEnvId?: boolean
}

const validOptions = (options) => {
    if (!options || !options.parent) {
        throw new CloudBaseError('参数异常，请检查您是否输入了正确的命令！')
    }
}

type CommandConstructor = new () => Command

const registrableCommands: CommandConstructor[] = []

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

    // 初始化参数
    public init() {
        const { cmd, options, desc, requiredEnvId = true } = this.options

        let instance = program.command(cmd)
        options.forEach((option) => {
            instance = instance.option(option.flags, option.desc)
        })

        instance.description(desc)

        // tcb <cmd> params options
        instance.action(async (...args) => {
            // 命令的参数
            const params = args.slice(0, -1)
            // 最后一个参数为 commander 的 options
            const cmdOptions: any = args.splice(-1)?.[0]
            const config = await getCloudBaseConfig(cmdOptions?.parent?.configFile)
            const envId = cmdOptions?.envId || config?.envId

            if (!envId && requiredEnvId) {
                throw new CloudBaseError(
                    '未识别到有效的环境 Id，请使用 cloudbaserc 配置文件进行操作或通过 -e 参数指定环境 Id'
                )
            }

            validOptions(cmdOptions)

            const ctx: ICommandContext = {
                cmd,
                envId,
                config,
                params,
                options: cmdOptions
            }

            // 处理前
            this.emit('preHandle', ctx, args)
            await this.preHandle()

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
