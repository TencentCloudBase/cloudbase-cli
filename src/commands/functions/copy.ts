import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { copyFunction } from '../../function'
import { InjectParams, EnvId, ArgsOptions, ArgsParams, Log, Logger } from '../../decorators'

@ICommand()
export class FunctionCopy extends Command {
    get options() {
        return {
            cmd: 'functions:copy <name> [newFunctionName]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-t, --target <targetEnvId>',
                    desc: '目标环境 Id'
                },
                // {
                //     flags: '--code-secret <codeSecret>',
                //     desc: '代码加密的函数的 CodeSecret'
                // },
                {
                    flags: '--force',
                    desc: '如果目标环境下存在同名函数，覆盖原函数'
                }
            ],
            desc: '拷贝云函数'
        }
    }

    @InjectParams()
    async execute(
        @EnvId() envId,
        @ArgsOptions() options,
        @ArgsParams() params,
        @Log() log: Logger
    ) {
        const name = params?.[0]
        const newFunctionName = params?.[1]

        const { force, codeSecret, targetEnvId } = options

        if (!name) {
            throw new CloudBaseError('请指定函数名称！')
        }

        await copyFunction({
            force,
            envId,
            codeSecret,
            functionName: name,
            newFunctionName: newFunctionName || name,
            targetEnvId: targetEnvId || envId
        })

        log.success('拷贝函数成功')
    }
}
