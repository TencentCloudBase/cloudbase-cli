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
                    flags: '-a, --appId <appId>',
                    desc: '应用 Id'
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
        let { appId = '', gatewayName = '', gatewayAlias = '' } = options
        appId = String(appId)
        gatewayName = String(gatewayName)
        gatewayAlias = String(gatewayAlias)

        if (appId.length === '') {
            throw new CloudBaseError('请输入应用 Id')
        }

        const loading = loadingFactory()

        loading.start('数据加载中...')

        const data = await listStandalonegateway({
            envId,
            appId: Number(appId),
            gatewayName,
            gatewayAlias
        })

        loading.stop()

        const head = ['CPU', '状态', '别名',  '描述', '名称',  '内存', '版本号', '子网']
        printHorizontalTable(head, data)
    }
}
