
import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { loadingFactory } from '../../../utils'
import { setFunctionAliasConfig } from '../../../function'
import { InjectParams, CmdContext, ArgsParams, ArgsOptions } from '../../../decorators'


@ICommand()
export class setFunctionRoutingConfig extends Command {
    get options() {
        return {
            cmd: 'fn',
            childCmd: 'config-route <name> <version1> <traffic1> [version2] [traffic2]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '设置函数版本流量配置'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() params) {
        const name = params?.[0]
        const version1 = params?.[1]
        const traffic1 = Number(params?.[2])

        const version2 = params?.[3]
        const traffic2 = Number(params?.[4])

        // 校验

        // 1. version2 及 traffic2 必须同时存在
        if ((version2 === undefined && traffic2 !== undefined) || (version2 !== undefined && traffic2 === undefined)) {
            throw new CloudBaseError('version2 和 traffic2 必须同时设置')
        }

        if (traffic1 !== undefined && traffic2 !== undefined) {
            if (traffic1 + traffic2 !== 100) {
                throw new CloudBaseError('traffic1 和 traffic2 同时设置时，需保证总和 100')
            }
        }

        const {
            envId
        } = ctx

        const loading = loadingFactory()
        loading.start(`设置函数 [${name}] 版本流量配置中...`)

        let routingConfigParams = {
            AddtionVersionMatchs: [{
                Expression: `[0,${traffic1})`,
                Key: "invoke.headers.X-Tcb-Route-Key",
                Method: "range",
                Version: version1
            }]
        }

        if (version2 !== undefined) {
            routingConfigParams.AddtionVersionMatchs.push({
                Expression: `[${traffic1},${100})`,
                Key: "invoke.headers.X-Tcb-Route-Key",
                Method: "range",
                Version: version2
            })
        }

        await setFunctionAliasConfig({
            envId,
            functionName: name,
            name: '$DEFAULT',
            functionVersion: '$LATEST',
            routingConfig: routingConfigParams
        })

        loading.succeed(`设置函数 [${name}] 版本流量配置成功！`)
    }
}
