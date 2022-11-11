import _ from 'lodash'
import { Command, ICommand } from '../common'
import { InjectParams, CmdContext, ArgsOptions } from '../../decorators'

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
        import('@cloudbase/lowcode-cli').then(async (res) => {
            await res.watchApp({
                watchPort: 8288,
                wxDevtoolPath: options?.wxDevtoolPath,
                forceInstall: options?.forceInstall,
            })
        })
    }
}