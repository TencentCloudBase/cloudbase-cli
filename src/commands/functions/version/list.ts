
import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { loadingFactory, printHorizontalTable } from '../../../utils'
import { listFunctionVersions } from '../../../function'
import { InjectParams, CmdContext, ArgsParams, ArgsOptions } from '../../../decorators'
import { StatusMap } from '../../../constant'


@ICommand()
export class ListFunctionVersion extends Command {
    get options() {
        return {
            cmd: 'fn',
            childCmd: 'list-function-versions <name>',
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
            desc: '展示函数版本列表'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() params, @ArgsOptions() options) {
        const name = params?.[0]
        let { limit = 20, offset = 0 } = options
        limit = Number(limit)
        offset = Number(offset)
        if (!Number.isInteger(limit) || !Number.isInteger(offset)) {
            throw new CloudBaseError('limit 和 offset 必须为整数')
        }

        if (limit < 0 || offset < 0) {
            throw new CloudBaseError('limit 和 offset 必须为大于 0 的整数')
        }

        const {
            envId
        } = ctx

        const loading = loadingFactory()
        loading.start(`拉取函数 [${name}] 版本列表中...`)

        const res = await listFunctionVersions({
            envId,
            functionName: name,
            offset,
            limit
        })

        loading.stop()

        const head: string[] = ['版本', '描述', '创建时间', '修改时间', '状态']

        const tableData = res.Versions.map((item) => [
            item.Version,
            item.Description,
            item.AddTime,
            item.ModTime,
            StatusMap[item.Status]
        ])

        printHorizontalTable(head, tableData)
    }
}
