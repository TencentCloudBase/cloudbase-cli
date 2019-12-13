import { GatewayContext } from '../../types'
import { CloudBaseError } from '../../error'
import { queryGatewayDomain } from '../../gateway'
import { printHorizontalTable, loadingFactory } from '../../utils'

export async function queryGwDomain(ctx: GatewayContext, commandOptions) {
    const { envId } = ctx

    const { domain: domainName } = commandOptions

    if (!envId && !domainName) {
        throw new CloudBaseError('请指定需要查询的环境ID或网关域名！')
    }

    const loading = loadingFactory()
    loading.start(`查询自定义网关域名中...`)

    try {
        const res = await queryGatewayDomain({
            envId,
            domain: domainName
        })
        loading.succeed(`查询自定义网关域名成功！`)
        const head = ['CustomDomain', 'CreateTime']
        const tableData = res.ServiceSet.map(item => [
            item.Domain,
            item.OpenTime
        ])
        printHorizontalTable(head, tableData)
    } catch (e) {
        loading.stop()
        throw e
    }
}