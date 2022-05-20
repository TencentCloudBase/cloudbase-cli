import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { listRun, logCreate } from '../../run'
import { printHorizontalTable, loadingFactory } from '../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../decorators'
import { checkTcbrEnv, logEnvCheck } from '../../utils'
import { EnumEnvCheck } from '../../constant'

const StatusMap = {
    succ: '正常'
}

@ICommand()
export class ListRun extends Command {
    get options() {
        return {
            cmd: 'run:deprecated',
            childCmd: 'list',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-l, --limit <limit>',
                    desc: '返回数据长度，默认值为 20'
                },
                {
                    flags: '-o, --offset <offset>',
                    desc: '数据偏移量，默认值为 0'
                }
            ],
            desc: '展示云托管服务列表'
        }
    }

    @InjectParams()

    async execute(@EnvId() envId, @ArgsOptions() options) {
        
        let envCheckType = await checkTcbrEnv(options.envId, false)
        if(envCheckType !== EnumEnvCheck.EnvFit) {
            logEnvCheck(envId, envCheckType)
            return
        }
        
        let { limit = 20, offset = 0 } = options
        limit = Number(limit)
        offset = Number(offset)

        if (!Number.isInteger(limit) || !Number.isInteger(offset)) {
            throw new CloudBaseError('limit 和 offset 必须为整数')
        }

        if (limit < 0 || offset < 0) {
            throw new CloudBaseError('limit 和 offset 必须为大于 0 的整数')
        }

        const loading = loadingFactory()

        loading.start('数据加载中...')

        const data = await listRun({
            envId,
            limit: Number(limit),
            offset: Number(offset)
        })

        loading.stop()

        const head: string[] = ['服务名称', '服务备注', '创建时间', '修改时间', '状态', '所在私有网络']

        const tableData = data.map((item) => [
            item.ServerName,
            item.ServiceRemark ? item.ServiceRemark : '-',
            item.CreatedTime,
            item.UpdatedTime,
            StatusMap[item.Status],
            item.VpcId,
        ])

        printHorizontalTable(head, tableData)
    }
}