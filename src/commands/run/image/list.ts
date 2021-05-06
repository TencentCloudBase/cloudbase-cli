import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { listImage } from '../../../run'
import { printHorizontalTable, loadingFactory } from '../../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../../decorators'
import { imageCommonOptions } from './common'

@ICommand()
export class ListImage extends Command {
    get options() {
        return {
            ...imageCommonOptions('list'),
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

        const data = await listImage({
            envId,
            limit: Number(limit),
            offset: Number(offset),
            serviceName: serviceName
        })

        loading.stop()

        const head: string[] = ['镜像', '大小', '关联服务版本', '创建时间', '更新时间']

        const tableData = data.map((item) => [
            item.ImageUrl.split(':')[1],
            item.Size,
            item.ReferVersions.length > 0 ? item.ReferVersions.reduce((sum, item) => `${sum}|${item.VersionName}`, '') : '-',
            item.CreateTime,
            item.UpdateTime,
        ])

        printHorizontalTable(head, tableData)
    }
}