import { Command } from '../command'
import { installCompletion, unInstallCompletion } from './tab'
const commands = [
    {
        cmd: 'completion:install',
        options: [],
        desc: '安装自动补全',
        handler: installCompletion,
        requiredEnvId: false
    },
    {
        cmd: 'completion:uninstall',
        options: [],
        desc: '登出腾讯云账号',
        handler: unInstallCompletion,
        requiredEnvId: false
    }
]

commands.forEach(item => {
    const command = new Command(item)
    command.init()
})
