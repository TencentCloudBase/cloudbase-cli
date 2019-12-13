import { GatewayContext } from '../../types'
import { CloudBaseError } from '../../error'
import { bindGatewayDomain } from '../../gateway'
import { loadingFactory } from '../../utils'

export async function bindGwDomain(ctx: GatewayContext, domain: string) {
    const { envId } = ctx

    if (!domain) {
        throw new CloudBaseError('请指定需要绑定的自定义网关域名！')
    }

    const loading = loadingFactory()
    loading.start(`自定义网关域名 [${domain}] 绑定中...`)

    try {
        await bindGatewayDomain({
            envId,
            domain
        })
        loading.succeed(`自定义网关域名[${domain}] 绑定成功！`)
    } catch (e) {
        loading.stop()
        throw e
    }
}