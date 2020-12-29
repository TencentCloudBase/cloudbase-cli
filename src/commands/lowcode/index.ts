import _ from 'lodash'
import { Command, ICommand } from '../common'
import { startLocalCIServer } from './ci/controller'
import { InjectParams, Log, Logger, CmdContext } from '../../decorators'

const BUILD_TYPE_LIST = ['mp', 'web']

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
                }
            ],
            desc: '开启云开发低码的本地构建模式',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @Log() log?: Logger) {
        await startLocalCIServer(8288)
    }
}
