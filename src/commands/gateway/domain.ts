import { CloudBaseError } from '../../error'
import { bindGatewayDomain, queryGatewayDomain, unbindGatewayDomain } from '../../gateway'
import { loadingFactory, printHorizontalTable, formatDate } from '../../utils'
import { ICommandContext } from '../command'

export async function bindCustomDomain(ctx: ICommandContext, domain: string) {
    const { envId } = ctx

    if (!domain) {
        throw new CloudBaseError('请指定需要绑定的 HTTP Service 域名！')
    }

    const loading = loadingFactory()
    loading.start(`HTTP Service 域名 [${domain}] 绑定中...`)

    try {
        await bindGatewayDomain({
            envId,
            domain
        })
        loading.succeed(`HTTP Service 域名[${domain}] 绑定成功！`)
    } catch (e) {
        loading.stop()
        throw e
    }
}

export async function getCustomDomain(ctx: ICommandContext) {
    const { envId, options } = ctx

    const { domain: domainName } = options

    if (!envId && !domainName) {
        throw new CloudBaseError('请指定需要查询的环境 ID 或 HTTP Service 域名！')
    }

    const loading = loadingFactory()
    loading.start('查询 HTTP Service 域名中...')

    try {
        const res = await queryGatewayDomain({
            envId,
            domain: domainName
        })
        loading.succeed('查询 HTTP Service 域名成功！')
        const head = ['HTTP Service domain', 'CreateTime']
        const tableData = res.ServiceSet.map(item => [
            item.Domain,
            formatDate(item.OpenTime * 1000, 'yyyy-MM-dd hh:mm:ss')
        ])
        printHorizontalTable(head, tableData)
    } catch (e) {
        loading.stop()
        throw e
    }
}

export async function unbindCustomDomain(ctx: ICommandContext, domain: string) {
    const { envId } = ctx

    if (!domain) {
        throw new CloudBaseError('请指定需要解绑的 HTTP Service 域名！')
    }

    const loading = loadingFactory()
    loading.start(`HTTP Service域名 [${domain}] 解绑中...`)

    try {
        await unbindGatewayDomain({
            envId,
            domain
        })
        loading.succeed(`HTTP Service域名 [${domain}] 解绑成功！`)
    } catch (e) {
        loading.stop()
        throw e
    }
}
