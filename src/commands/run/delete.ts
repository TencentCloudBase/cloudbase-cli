import { prompt } from 'enquirer'
import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { describeImageRepo, listVersion, deleteImageRepo, deleteRun } from '../../run'
import { InjectParams, EnvId, ArgsOptions } from '../../decorators'
import { checkTcbrEnv, loadingFactory, logEnvCheck, pagingSelectPromp } from '../../utils'
import { EnumEnvCheck } from '../../types'

@ICommand()
export class DeleteRun extends Command {
    get options() {
        return {
            cmd: 'run:deprecated',
            childCmd: 'delete',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '云托管服务 name'
                },
            ],
            desc: '删除云托管服务'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {
        let envCheckType = await checkTcbrEnv(options.envId, false)
        if(envCheckType !== EnumEnvCheck.EnvFit) {
            logEnvCheck(envId, envCheckType)
            return
        }

        let { serviceName = '' } = options

        if (serviceName.length === 0) {
            throw new CloudBaseError('必须输入服务名')
        }

        const loading = loadingFactory()

        loading.start('数据加载中...')

        const versions = await listVersion({ envId, serverName: serviceName, limit: 1, offset: 0 })

        if (versions.length > 0)
            throw new CloudBaseError('服务下还有版本存在，请先清空版本列表')

        const imageRepo = await describeImageRepo({ envId, serverName: serviceName })

        loading.start('正在删除服务')
        const res = await deleteRun({ envId, serverName: serviceName })
        if (res === 'succ')
            loading.succeed('服务删除完成')
        else
            throw new CloudBaseError('服务删除失败')

        if ((await prompt<any>({
            type: 'select',
            name: 'flag',
            message: `是否删除绑定的镜像仓库${imageRepo}`,
            choices: ['是', '否']
        })).flag === '是') {
            loading.start('正在删除镜像仓库')
            const res = await deleteImageRepo({ imageRepo })
            if (res === '') {
                loading.succeed('仓库删除完成')
            }
            else {
                throw new CloudBaseError('仓库删除失败')
            }
        }
    }
}