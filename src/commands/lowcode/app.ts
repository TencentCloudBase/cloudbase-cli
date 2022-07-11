import _ from 'lodash'
import { Command, ICommand } from '../common'
import { watchApp } from '@cloudbase/lowcode-cli'
import { InjectParams, Log, Logger, CmdContext, ArgsOptions } from '../../decorators'

@ICommand()
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
                }
            ],
            desc: '开启云开发低码的本地构建模式',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options) {
        await watchApp({
            watchPort: 8288,
            wxDevtoolPath: options?.wxDevtoolPath
        })
    }
}

@ICommand()
export class DanielWatch extends Command {
    get options() {
        return {
            cmd: 'lowcode',
            childCmd: 'watch-ws',
            options: [],
            desc: '开启云开发低码的本地开发模式',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsOptions() options) {
        console.log('>>> 启动啦')
    }
}
