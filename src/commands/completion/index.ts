import { Command } from '../command'
import { installCompletion, unInstallCompletion } from './tab'
const commands = [
    {
        cmd: 'completion:setup',
        options: [],
        desc: '启动自动补全命令',
        handler: installCompletion,
        requiredEnvId: false
    },
    {
        cmd: 'completion:clean',
        options: [],
        desc: '清楚自动补全命令',
        handler: unInstallCompletion,
        requiredEnvId: false
    }
]

commands.forEach(item => {
    const command = new Command(item)
    command.init()
})
