import { Command } from '../command'
import { run } from '@cloudbase/framework-core'

import { authStore } from '../../utils'

const commands = [
    {
        cmd: 'framework <command> [module]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            { flags: '--debug', desc: '是否打印详细日志' }
        ],
        desc: '调用云开发 Serverless 应用框架',
        handler: async (ctx, command, module) => {
            await callFramework(ctx, command, module)
        }
    }
]

async function callFramework(ctx, command, module) {
    const { envId, config } = ctx
    const { secretId, secretKey } = await authStore.get('credential')

    await run(
        {
            projectPath: process.cwd(),
            cloudbaseConfig: {
                secretId,
                secretKey,
                envId
            },
            config: config.framework,
            logLevel: ctx.options.debug ? 'debug' : 'info'
        },
        command,
        module
    )
}

// 注册命令
commands.forEach((item) => {
    const command = new Command(item)
    command.init()
})
