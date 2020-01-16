import { GatewayContext } from '../../types'
import { CloudBaseError } from '../../error'
import { queryGateway } from '../../gateway'
import { printHorizontalTable, loadingFactory, formatDate } from '../../utils'

export async function queryGw(ctx: GatewayContext, commandOptions) {
    const { envId } = ctx

    const { domain: domainName, servicePath, serviceId } = commandOptions

    if (!envId && !domainName) {
        throw new CloudBaseError('请指定需要查询的环境ID或HTTP Service域名！')
    }

    const loading = loadingFactory()
    loading.start('查询HTTP Service中...')

    try {
        const res = await queryGateway({
            envId,
            domain: domainName,
            path: servicePath,
            gatewayId: serviceId
        })
        loading.succeed('查询HTTP Service成功！')

        const head = ['Id', 'Path', 'FunctionName', 'CreateTime']
        const tableData = res.APISet.map(item => [
            item.APIId,
            item.Path,
            item.Name,
            formatDate(item.CreateTime * 1000, 'yyyy-MM-dd hh:mm:ss'),
        ])
        printHorizontalTable(head, tableData)
    } catch (e) {
        loading.stop()
        throw e
    }
}