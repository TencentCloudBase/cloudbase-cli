import { Command, ICommand } from '../../common'
import { createStandaloneGateway } from '../../../run/'
import { loadingFactory } from '@cloudbase/toolbox'
import { ArgsOptions, EnvId, InjectParams } from '../../../decorators'
import { standalonegatewayCommonOptions } from './common'
import { CloudBaseError } from '../../../error'

@ICommand()
export class CreateStandalonegateway extends Command {
    get options() {
        return {
            ...standalonegatewayCommonOptions('create'),
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
                    flags: '-gA, --gatewayAlias <gatewayAlias>',
                    desc: '网关 alias'
                },
                {
                    flags: '-v --vpcId <vpcId>',
                    desc: 'VPC'
                },
                {
                    flags: '-s, --subnetIds <subnetIds...>',
                    desc: '子网列表'
                },
                {
                    flags: '-p, --packageVersion <packageVersion>',
                    desc: '套餐版本'
                }
            ],
            desc: '创建小租户网关'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {

        let { appId = '', gatewayAlias = '', vpcId = '', subnetIds = [], packageVersion = '' } = options
        appId = String(appId)
        gatewayAlias = String(gatewayAlias)
        vpcId = String(vpcId)
        packageVersion = String(packageVersion)

        if (appId === '') {
            throw new CloudBaseError('请输入应用 Id')
        }

        if (vpcId === '') {
            throw new CloudBaseError('请输入 VPC')
        }

        if (subnetIds.length === 0) {
            throw new CloudBaseError('请输入子网列表')
        }

        if (packageVersion === '') {
            throw new CloudBaseError('请输入套餐版本')
        }

        const loading = loadingFactory()

        loading.start('数据加载中...')

        const data = await createStandaloneGateway({
            envId,
            appId: Number(appId),
            gatewayAlias,
            vpcId,
            subnetIds,
            packageVersion
        })

        loading.stop()

        console.log('操作执行成功，网关名称：' + data)
    }
}
