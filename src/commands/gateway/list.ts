import { CloudBaseError } from '../../error'
import { queryGateway } from '../../gateway'
import { printHorizontalTable, loadingFactory, formatDate } from '../../utils'
import { ICommandContext } from '../command'

export async function listService(ctx: ICommandContext) {
    const { envId, options } = ctx

    const { domain: domainName, servicePath, serviceId } = options

    if (!envId && !domainName) {
        throw new CloudBaseError('请指定需要查询的环境 ID 或 HTTP Service 域名！')
    }

    const loading = loadingFactory()
    loading.start('查询 HTTP Service 中...')

    try {
        const res = await queryGateway({
            envId,
            domain: domainName,
            path: servicePath,
            gatewayId: serviceId
        })

        loading.stop()

        if (res?.APISet?.length === 0) {
            console.log('HTTP Service 为空')
            return
        }

        const head = ['Id', 'Path', 'FunctionName', 'CreateTime']
        const tableData = res.APISet.map(item => [
            item.APIId,
            item.Path,
            item.Name,
            formatDate(item.CreateTime * 1000, 'yyyy-MM-dd hh:mm:ss')
        ])
        printHorizontalTable(head, tableData)
    } catch (e) {
        loading.stop()
        throw e
    }
}
