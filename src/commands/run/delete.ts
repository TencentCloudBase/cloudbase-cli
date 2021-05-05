import { prompt } from 'enquirer'
import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { describeImageRepo, listVersion, deleteImageRepo, deleteRun } from '../../run'
import { InjectParams, EnvId, ArgsOptions } from '../../decorators'
import { loadingFactory } from '../../utils'

const StatusMap = {
    succ: '正常'
}

@ICommand()
export class DeleteRun extends Command {
    get options() {
        return {
            cmd: 'run',
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

        let { serviceName = '' } = options

        if (serviceName.length === 0) {
            throw new CloudBaseError('必须输入服务名')
        }

        const loading = loadingFactory()

        loading.start('数据加载中...')

        const versions = await listVersion({ envId, serverName: serviceName })

        if (versions.length > 0)
            throw new CloudBaseError('服务下还有版本存在，请先清空版本列表')

        const imageRepo = await describeImageRepo({ envId, serverName: serviceName })

        loading.start('正在删除服务')
        const res_run = await deleteRun({ envId, serverName: serviceName })
        if (res_run === 'succ')
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
            const res_repo = await deleteImageRepo({ imageRepo })
            if (res_repo === '')
                loading.succeed('仓库删除完成')
            else
                throw new CloudBaseError('仓库删除失败')
        }
    }
}