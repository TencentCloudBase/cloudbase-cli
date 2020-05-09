import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { listFunction } from '../../function'
import { printHorizontalTable, loadingFactory } from '../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../decorators'

const StatusMap = {
    Active: '部署完成',
    Creating: '创建中',
    CreateFailed: '创建失败',
    Updating: '更新中',
    UpdateFailed: '更新失败'
}

@ICommand()
export class ListFunction extends Command {
    get options() {
        return {
            cmd: 'functions:list',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                { flags: '-l, --limit <limit>', desc: '返回数据长度，默认值为 20' },
                {
                    flags: '-o, --offset <offset>',
                    desc: '数据偏移量，默认值为 0'
                }
            ],
            desc: '展示云函数列表'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {
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

        const data = await listFunction({
            envId,
            limit: Number(limit),
            offset: Number(offset)
        })

        loading.stop()

        const head: string[] = ['函数 Id', '函数名称', '运行时', '创建时间', '修改时间', '状态']

        const tableData = data.map((item) => [
            item.FunctionId,
            item.FunctionName,
            item.Runtime,
            item.AddTime,
            item.ModTime,
            StatusMap[item.Status]
        ])

        printHorizontalTable(head, tableData)
    }
}
