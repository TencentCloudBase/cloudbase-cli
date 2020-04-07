import { Command } from '../command'
import { deleteThirdAttach } from './thirdAttach'

const commands = [
    {
        cmd: 'third:deleteThirdAttach',
        options: [
            {
                flags: '--source <source>',
                desc: '第三方来源'
            },
            {
                flags: '--thirdAppId <thirdAppId>',
                desc: '第三方appId'
            }
        ],
        desc: '解除第三方绑定',
        handler: deleteThirdAttach,
        requiredEnvId: false
    }
]

commands.forEach(item => {
    const command = new Command(item)
    command.init()
})
