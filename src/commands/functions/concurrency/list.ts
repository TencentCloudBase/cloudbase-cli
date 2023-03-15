
import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { loadingFactory, printHorizontalTable } from '../../../utils'
import { getProvisionedConcurrencyConfig } from '../../../function'
import { InjectParams, CmdContext, ArgsParams, ArgsOptions } from '../../../decorators'
import { StatusMap, ConcurrencyTaskStatus } from '../../../constant'


@ICommand()
export class getProvisionedConcurrency extends Command {
    get options() {
        return {
            cmd: 'fn',
            childCmd: 'get-provisioned-concurrency <name> [version]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '获取函数版本预置并发配置'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() params, @ArgsOptions() options) {
        const name = params?.[0]
        const version = params?.[1]

        const {
            envId
        } = ctx

        const loading = loadingFactory()
        loading.start(`拉取函数 [${name}] 预置并发配置中...`)

        const res = await getProvisionedConcurrencyConfig({
            envId,
            functionName: name,
            qualifier: version
        })

        loading.stop()

        const head: string[] = ['设置并发数', '已完成并发数', '预置任务状态', '状态说明', '版本号']

        const tableData = res.Allocated.map((item) => [
            item.AllocatedProvisionedConcurrencyNum,
            item.AvailableProvisionedConcurrencyNum,
            ConcurrencyTaskStatus[item.Status] || '无',
            item.StatusReason,
            item.Qualifier
        ])

        printHorizontalTable(head, tableData)
    }
}
