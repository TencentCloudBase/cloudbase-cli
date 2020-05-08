/* eslint-disable no-dupe-class-members */
import chalk from 'chalk'
import program from 'commander'
import * as Sentry from '@sentry/node'
import { EventEmitter } from 'events'
import { CloudBaseError } from '../error'
import { ICloudBaseConfig } from '../types'
import {
    getEnvId,
    usageStore,
    collectUsage,
    loadingFactory,
    getNotification,
    resolveCloudBaseConfig
} from '../utils'

interface ICommandOption {
    flags: string
    desc: string
}

export interface ICommandOptions {
    cmd: string
    options: ICommandOption[]
    desc: string
    handler: Function
    requiredEnvId?: boolean
}

export interface ICommandContext {
    cmd: string
    envId: string
    config: ICloudBaseConfig
    options: any
}

const validOptions = (options) => {
    if (!options || !options.parent) {
        throw new CloudBaseError('参数异常，请检查您是否输入了正确的命令！')
    }
}

export class Command extends EventEmitter {
    options: ICommandOptions

    constructor(options: ICommandOptions) {
        super()
        this.options = options
    }

    on(
        event: 'preHandle' | 'afterHandle',
        listener: (ctx: ICommandContext, args: any[]) => void
    ): this
    on(event: string, listener: (ctx: ICommandContext, args: any[]) => void): this {
        super.on(event, listener)
        return this
    }

    public init() {
        const { cmd, options, desc, handler, requiredEnvId = true } = this.options
        let instance = program.command(cmd)
        options.forEach((option) => {
            instance = instance.option(option.flags, option.desc)
        })

        instance.description(desc)

        instance.action(async (...args) => {
            // 最后一个参数为 commander 的 options
            const cmdOptions: any = args.splice(-1)?.[0]
            const configPath = cmdOptions?.parent?.configFile
            const config = await resolveCloudBaseConfig(configPath)
            const envId = await getEnvId(cmdOptions)

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
                options: cmdOptions
            }

            // 处理前
            this.emit('preHandle', ctx, args)
            await this.preHandle()
            handler(ctx, ...args)
            this.emit('afterHandle', ctx, args)
            // 上报数据
            await this.afterHandle(ctx)
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
}
