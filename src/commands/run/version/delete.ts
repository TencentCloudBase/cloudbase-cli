import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { deleteVersion } from '../../../run'
import { checkTcbrEnv, loadingFactory, logEnvCheck } from '../../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../../decorators'
import { versionCommonOptions } from './common'
import { EnumEnvCheck } from '../../../constant'

@ICommand()
export class DeleteVersion extends Command {
    get options() {
        return {
            ...versionCommonOptions('delete'),
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '托管服务 name'
                },
                {
                    flags: '-v, --versionName <versionName>',
                    desc: '版本名称 Name'
                }
            ],
            desc: '删除云开发环境下云托管服务的版本'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {
        let envCheckType = await checkTcbrEnv(options.envId, false)
        if(envCheckType !== EnumEnvCheck.EnvFit) {
            logEnvCheck(envId, envCheckType)
            return
        }
        
        let { serviceName = '', versionName = '' } = options

        if (versionName.length === 0 || serviceName.length === 0) {
            throw new CloudBaseError('必须输入 serviceName 和 versionName')
        }

        const loading = loadingFactory()

        loading.start('数据加载中...')

        try {
            const res = await deleteVersion({
                envId,
                serverName: serviceName,
                versionName
            })
    
            if (res === 'succ') loading.succeed(`成功删除 ${serviceName} 服务下的 ${versionName} 版本`)
            else throw new CloudBaseError('删除失败，请查看版本是否存在, 或者先清空版本灰度流量')
        } catch(e) {
            throw new CloudBaseError('删除失败，请查看版本是否存在, 或者先清空版本灰度流量')
        }

    }
}