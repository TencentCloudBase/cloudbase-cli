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
                    flags: '--assets <assets>',
                    desc: '构建时额外引入的ASSETS'
                }
            ],
            desc: '开启云开发低码的本地构建模式',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @Log() log?: Logger) {
        await watchApp({
            watchPort: 8288
        })
    }
}
