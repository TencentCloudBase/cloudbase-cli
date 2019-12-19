import { GatewayContext } from '../../types'
import { CloudBaseError } from '../../error'
import { queryGatewayDomain } from '../../gateway'
import { printHorizontalTable, loadingFactory, formatDate } from '../../utils'

export async function queryGwDomain(ctx: GatewayContext, commandOptions) {
    const { envId } = ctx

    const { domain: domainName } = commandOptions

    if (!envId && !domainName) {
        throw new CloudBaseError('请指定需要查询的环境ID或HTTP service域名！')
    }

    const loading = loadingFactory()
    loading.start('查询HTTP service域名中...')

    try {
        const res = await queryGatewayDomain({
            envId,
            domain: domainName
        })
        loading.succeed('查询HTTP service域名成功！')
        const head = ['HTTP service domain', 'CreateTime']
        const tableData = res.ServiceSet.map(item => [
            item.Domain,
            formatDate(item.OpenTime * 1000, 'yyyy-MM-dd hh:mm:ss'),
        ])
        printHorizontalTable(head, tableData)
    } catch (e) {
        loading.stop()
        throw e
    }
}