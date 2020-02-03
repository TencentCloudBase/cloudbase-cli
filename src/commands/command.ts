import program from 'commander'
import { EventEmitter } from 'events'
import { resolveCloudBaseConfig, getEnvId } from '../utils'
import { CloudBaseError } from '../error'
import { ICloudBaseConfig } from '../types'

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

const validOptions = options => {
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

    on(event: 'pre-run', listener: () => void): this
    // eslint-disable-next-line
    on(event: string, listener: () => void): this {
        super.on(event, listener)
        return this
    }

    public init() {
        const { cmd, options, desc, handler, requiredEnvId = true } = this.options
        let instance = program.command(cmd)
        options.forEach(option => {
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
                    '未识别到有效的环境 Id 变量，请在项目根目录进行操作或通过 -e 参数指定环境 Id'
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
            this.emit('pre-run', ctx, args)
            this.preRun()

            handler(ctx, ...args)
        })
    }

    private preRun() {}
}
