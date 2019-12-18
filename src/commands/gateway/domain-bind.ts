import { GatewayContext } from '../../types'
import { CloudBaseError } from '../../error'
import { bindGatewayDomain } from '../../gateway'
import { loadingFactory } from '../../utils'

export async function bindGwDomain(ctx: GatewayContext, domain: string) {
    const { envId } = ctx

    if (!domain) {
        throw new CloudBaseError('请指定需要绑定的HTTP service域名！')
    }

    const loading = loadingFactory()
    loading.start(`HTTP service域名 [${domain}] 绑定中...`)

    try {
        await bindGatewayDomain({
            envId,
            domain
        })
        loading.succeed(`HTTP service域名[${domain}] 绑定成功！`)
    } catch (e) {
        loading.stop()
        throw e
    }
}