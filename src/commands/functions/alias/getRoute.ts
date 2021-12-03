
import { Command, ICommand } from '../../common'
import { loadingFactory, printHorizontalTable } from '../../../utils'
import { getFunctionAliasConfig } from '../../../function'
import { InjectParams, CmdContext, ArgsParams, ArgsOptions } from '../../../decorators'


function parseRoutingConfigValue(expression: string) {
    const commaIndex = expression.indexOf(',')
    const valueExpression = expression.substring(commaIndex + 1, expression.length - 1)
    return valueExpression
}

@ICommand()
export class getFunctionRoutingConfig extends Command {
    get options() {
        return {
            cmd: 'fn',
            childCmd: 'get-route <name>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '查看函数版本流量配置'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() params) {
        const name = params?.[0]

        const {
            envId
        } = ctx

        const loading = loadingFactory()
        loading.start(`查询函数 [${name}] 版本流量配置中...`)

        const aliasRes = await getFunctionAliasConfig({
            envId,
            functionName: name,
            name: '$DEFAULT'
        })

        const routingConfig = aliasRes?.RoutingConfig?.AddtionVersionMatchs
        let finalConfig = []
        if (routingConfig.length === 1) {
            finalConfig.push({
                version: routingConfig[0].Version,
                value: parseRoutingConfigValue(routingConfig[0].Expression)
            })
        } else if (routingConfig.length === 2) {
            finalConfig.push({
                version: routingConfig[0].Version,
                value: parseRoutingConfigValue(routingConfig[0].Expression)
            }, {
                version: routingConfig[1].Version,
                value: 100 - Number(parseRoutingConfigValue(routingConfig[0].Expression))
            })
        }

        loading.stop()

        const head: string[] = ['版本', '流量比例']

        const tableData = finalConfig.map((item) => [
            item.version,
            item.value
        ])

        printHorizontalTable(head, tableData)

    }
}
