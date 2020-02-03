import { Command } from '../command'
import { init } from './init'
import { openLink } from './open'

const commands = [
    {
        cmd: 'init',
        options: [
            {
                flags: '--server',
                desc: '创建派主机 Node 项目'
            }
        ],
        desc: '创建并初始化一个新的云开发项目',
        handler: init,
        requiredEnvId: false
    },
    {
        cmd: 'open [link]',
        options: [],
        desc: '在浏览器中打开云开发相关连接',
        handler: openLink,
        requiredEnvId: false
    }
]

commands.forEach(item => {
    const command = new Command(item)
    command.init()
})
