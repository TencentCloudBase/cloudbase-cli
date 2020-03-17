import { Command } from '../command'
import { accountLogin } from './login'
import { accountLogout } from './logout'

const commands = [
    {
        cmd: 'login',
        options: [
            {
                flags: '-k, --key',
                desc: '使用永久密钥登录'
            },
            {
                flags: '--apiKeyId <apiKeyId>',
                desc: '腾讯云 API 秘钥 Id'
            },
            {
                flags: '--apiKey <apiKey>',
                desc: '腾讯云 API 秘钥 Key'
            }
        ],
        desc: '登录腾讯云账号',
        handler: accountLogin,
        requiredEnvId: false
    },
    {
        cmd: 'logout',
        options: [],
        desc: '登出腾讯云账号',
        handler: accountLogout,
        requiredEnvId: false
    }
]

commands.forEach(item => {
    const command = new Command(item)
    command.init()
})
