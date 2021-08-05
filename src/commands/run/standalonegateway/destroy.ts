import { Command, ICommand } from '../../common'
import { destroyStandalonegateway } from '../../../run'
import { loadingFactory } from '@cloudbase/toolbox'
import { ArgsOptions, EnvId, InjectParams } from '../../../decorators'
import { standalonegatewayCommonOptions } from './common'
import { CloudBaseError } from '../../../error'

@ICommand()
export class DestroyStandalonegateway extends Command {
    get options() {
        return {
            ...standalonegatewayCommonOptions('destroy'),
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
                    flags: '--isForce',
                    desc: '强制确认删除资源'
                }
            ],
            desc: '销毁小租户网关'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {

        let { isForce = false, appId = '', gatewayName = '' } = options
        isForce = Boolean(isForce)
        appId = String(appId)
        gatewayName = String(gatewayName)

        if (appId === '') {
            throw new CloudBaseError('请输入应用 Id')
        }

        if (gatewayName === '') {
            throw new CloudBaseError('请输入网关名称')
        }

        if (!isForce) {
            throw new CloudBaseError('请使用 --isForce 选项确认销毁资源！')
        }

        const loading = loadingFactory()

        loading.start('数据加载中...')
        
        const data = await destroyStandalonegateway({
            envId,
            appId: Number(appId),
            gatewayName
        })

        loading.stop()

        console.log('网关已销毁')
    }
}
