import { ICommand, Command } from '../common'

import { logout } from '../../auth'
import { InjectParams, Log, Logger } from '../../decorators'

@ICommand()
export class LogoutCommand extends Command {
    get options() {
        return {
            cmd: 'logout',
            options: [],
            desc: '登出腾讯云账号',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@Log() log: Logger) {
        await logout()

        log.success('注销登录成功！')
    }
}
