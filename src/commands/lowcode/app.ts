import _ from 'lodash'
import { Command, ICommand } from '../common'
import { startLocalCIServer, IWatchAppInfo } from '@cloudbase/lowcode-cli'
import { InjectParams, Log, Logger, ArgsOptions } from '../../decorators'

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
    async execute(@ArgsOptions() options) {
        const { assets } = options
        await startLocalCIServer({
            watchPort: 8288,
            assets
        })
    }
}