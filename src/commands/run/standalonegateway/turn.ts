import { Command, ICommand } from '../../common'
import { turnOffStandalonegateway, turnOnStandalonegateway } from '../../../run'
import { loadingFactory } from '@cloudbase/toolbox'
import { ArgsOptions, ArgsParams, EnvId, InjectParams } from '../../../decorators'
import { standalonegatewayCommonOptions } from './common'
import { CloudBaseError } from '../../../error'

@ICommand()
export class TurnStandalonegateway extends Command {
    get options() {
        return {
            ...standalonegatewayCommonOptions('turn <status>'),
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-gN, --gatewayName <gatewayName>',
                    desc: '网关名'
                },
                {
                    flags: '-sL, --serviceList <serviceList...>',
                    desc: '云托管服务列表'
                }
            ],
            desc: '启停小租户网关'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsParams() params, @ArgsOptions() options) {
        const status = params?.[0]
        if (!status || ['on', 'off'].indexOf(status) === -1) {
            throw new CloudBaseError('请输入启停状态')
        }

        let { gatewayName = '', serviceList = [] } = options
        gatewayName = String(gatewayName)

        if (gatewayName === '') {
            throw new CloudBaseError('请输入网关名')
        }

        if (serviceList.length === 0) {
            throw new CloudBaseError('请输入云托管服务列表')
        }

        const loading = loadingFactory()

        loading.start('数据加载中...')

        await (status === 'on' ? turnOnStandalonegateway : turnOffStandalonegateway)({
            envId,
            gatewayName,
            serviceList
        })

        loading.stop()

        console.log('操作执行成功')
    }
}
