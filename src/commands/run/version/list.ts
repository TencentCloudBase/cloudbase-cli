import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { listVersion } from '../../../run'
import { printHorizontalTable, loadingFactory } from '../../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../../decorators'
import { versionCommonOptions } from './common'

const StatusMap = {
    normal: '正常',
    deploy_fail: '部署失败'
}

@ICommand()
export class ListVersion extends Command {
    get options() {
        return {
            ...versionCommonOptions('list'),
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
                    flags: '-l, --limit <limit>',
                    desc: '返回数据长度，默认值为 20'
                },
                {
                    flags: '-o, --offset <offset>',
                    desc: '数据偏移量，默认值为 0'
                }
            ],
            desc: '展示选择的云托管服务的版本列表'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {

        let { limit = 20, offset = 0, serviceName = '' } = options
        limit = Number(limit)
        offset = Number(offset)

        if (!Number.isInteger(limit) || !Number.isInteger(offset)) {
            throw new CloudBaseError('limit 和 offset 必须为整数')
        }

        if (limit < 0 || offset < 0) {
            throw new CloudBaseError('limit 和 offset 必须为大于 0 的整数')
        }

        if (serviceName.length === 0) {
            throw new CloudBaseError('请输入查询的服务名')
        }

        const loading = loadingFactory()

        loading.start('数据加载中...')

        const data = await listVersion({
            envId,
            limit: Number(limit),
            offset: Number(offset),
            serverName: serviceName
        })

        loading.stop()

        const head: string[] = ['版本名称', '状态', '流量', '备注', '创建时间', '更新时间']

        const tableData = data.map((item) => [
            item.VersionName,
            StatusMap[item.Status],
            item.FlowRatio,
            item.ServiceRemark ? item.ServiceRemark : '-',
            item.CreatedTime,
            item.UpdatedTime,
        ])

        printHorizontalTable(head, tableData)
    }
}