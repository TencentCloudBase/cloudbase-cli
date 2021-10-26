
import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { loadingFactory } from '../../../utils'
import { deleteProvisionedConcurrencyConfig } from '../../../function'
import { InjectParams, CmdContext, ArgsParams, ArgsOptions } from '../../../decorators'


@ICommand()
export class deleteProvisionedConcurrency extends Command {
    get options() {
        return {
            cmd: 'fn',
            childCmd: 'delete-provisioned-concurrency <name> <version>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '删除函数版本预置并发配置'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() params) {
        const name = params?.[0]
        const version = params?.[1]

        const {
            envId
        } = ctx

        const loading = loadingFactory()
        loading.start(`删除函数 [${name}] 预置并发配置中...`)

        await deleteProvisionedConcurrencyConfig({
            envId,
            functionName: name,
            qualifier: version
        })

        loading.succeed(`删除函数 [${name}] 预置并发配置成功！`)
    }
}
