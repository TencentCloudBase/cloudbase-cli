import { GatewayContext } from '../../types'
import { CloudBaseError } from '../../error'
import { unbindGatewayDomain } from '../../gateway'
import { loadingFactory } from '../../utils'

export async function unbindGwDomain(ctx: GatewayContext, domain: string) {
    const { envId } = ctx

    if (!domain) {
        throw new CloudBaseError('请指定需要解绑的HTTP service域名！')
    }

    const loading = loadingFactory()
    loading.start(`HTTP service域名 [${domain}] 解绑中...`)

    try {
        await unbindGatewayDomain({
            envId,
            domain
        })
        loading.succeed(`HTTP service域名 [${domain}] 解绑成功！`)
    } catch (e) {
        loading.stop()
        throw e
    }
}