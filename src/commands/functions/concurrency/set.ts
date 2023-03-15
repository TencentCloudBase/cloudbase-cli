
import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { loadingFactory } from '../../../utils'
import { setProvisionedConcurrencyConfig } from '../../../function'
import { InjectParams, CmdContext, ArgsParams, ArgsOptions } from '../../../decorators'


@ICommand()
export class setProvisionedConcurrency extends Command {
    get options() {
        return {
            cmd: 'fn',
            childCmd: 'set-provisioned-concurrency <name> <version> <concurrency>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '设置函数版本预置并发'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() params) {
        const name = params?.[0]
        const version = params?.[1]
        const concurrency = Number(params?.[2] || 0)

        const {
            envId
        } = ctx

        const loading = loadingFactory()
        loading.start(`配置函数 [${name}] 预置并发中...`)

        await setProvisionedConcurrencyConfig({
            envId,
            functionName: name,
            qualifier: version,
            versionProvisionedConcurrencyNum: concurrency
        })

        loading.succeed(`配置函数 [${name}] 预置并发成功！`)
    }
}
