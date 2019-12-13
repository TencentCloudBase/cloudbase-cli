import { GatewayContext } from '../../types'
import { CloudBaseError } from '../../error'
import { queryGateway } from '../../gateway'
import { printHorizontalTable, loadingFactory } from '../../utils'

export async function queryGw(ctx: GatewayContext, commandOptions) {
    const { envId } = ctx

    const { domain: domainName, gatewayPath, gatewayId } = commandOptions

    if (!envId && !domainName) {
        throw new CloudBaseError('请指定需要查询的环境ID或网关域名！')
    }

    const loading = loadingFactory()
    loading.start(`查询云函数网关中...`)

    try {
        const res = await queryGateway({
            envId,
            domain: domainName,
            path: gatewayPath,
            gatewayId
        })
        loading.succeed(`查询云函数网关成功！`)

        const head = ['GatewayID', 'Path', 'FunctionName', 'CreateTime']
        const tableData = res.APISet.map(item => [
            item.APIId,
            item.Path,
            item.Name,
            item.CreateTime
        ])
        printHorizontalTable(head, tableData)
    } catch (e) {
        loading.stop()
        throw e
    }
}