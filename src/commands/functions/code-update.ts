import path from 'path'
import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { loadingFactory } from '../../utils'
import { updateFunctionCode } from '../../function'
import { InjectParams, CmdContext, ArgsParams } from '../../decorators'

@ICommand()
export class CodeUpdate extends Command {
    get options() {
        return {
            cmd: 'functions:code:update <name>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '--code-secret <codeSecret>',
                    desc: '传入此参数将保护代码，格式为 36 位大小字母和数字'
                }
            ],
            desc: '更新云函数代码'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() params) {
        const { envId, config, options } = ctx
        const { codeSecret } = options

        const name = params?.[0]

        if (!name) {
            throw new CloudBaseError('请指定云函数名称！')
        }

        const func = config.functions.find((item) => item.name === name) || { name }

        const loading = loadingFactory()

        loading.start(`[${func.name}] 函数代码更新中...`)
        try {
            await updateFunctionCode({
                func,
                envId,
                codeSecret,
                functionRootPath: path.join(process.cwd(), config.functionRoot)
            })
            loading.succeed(`[${func.name}] 函数代码更新成功！`)
        } catch (e) {
            loading.stop()
            throw e
        }
    }
}
