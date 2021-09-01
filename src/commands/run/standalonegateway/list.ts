import { Command, ICommand } from '../../common'
import { listStandalonegateway } from '../../../run/standalonegateway'
import { loadingFactory } from '@cloudbase/toolbox'
import { ArgsOptions, EnvId, InjectParams } from '../../../decorators'
import { standalonegatewayCommonOptions } from './common'
import { printHorizontalTable } from '../../../utils'
import { CloudBaseError } from '../../../error'

@ICommand()
export class ListStandalonegateway extends Command {
    get options() {
        return {
            ...standalonegatewayCommonOptions('list'),
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-gN, --gatewayName <gatewayName>',
                    desc: '网关 name'
                },
                {
                    flags: '-gA, --gatewayAlias <gatewayAlias>',
                    desc: '网关 alias'
                }
            ],
            desc: '查询小租户网关'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {
        let { gatewayName = '', gatewayAlias = '' } = options
        gatewayName = String(gatewayName)
        gatewayAlias = String(gatewayAlias)

        const loading = loadingFactory()

        loading.start('数据加载中...')

        const data = await listStandalonegateway({
            envId,
            gatewayName,
            gatewayAlias
        })

        loading.stop()

        const head = ['名称', '状态', '别名', '套餐版本', '子网', '外网IP', '内网IP', '服务信息']
        printHorizontalTable(head, data)
    }
}
