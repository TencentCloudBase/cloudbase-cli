
import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { loadingFactory } from '../../../utils'
import { publishVersion } from '../../../function'
import { InjectParams, CmdContext, ArgsParams } from '../../../decorators'

@ICommand()
export class PublishFunctionVersion extends Command {
    get options() {
        return {
            cmd: 'fn',
            childCmd: 'publish-version <name> [description]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '发布函数新版本'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() params) {
        const name = params?.[0]
        const description = params?.[1]
        const {
            envId
        } = ctx

        const loading = loadingFactory()
        loading.start(`发布函数 [${name}] 新版本中...`)

        await publishVersion({
            envId,
            functionName: name,
            description
        })

        loading.succeed(`发布函数 [${name}] 新版本成功！`)
    }
}
