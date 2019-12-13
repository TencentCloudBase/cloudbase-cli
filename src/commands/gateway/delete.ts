import { GatewayContext } from '../../types'
import { CloudBaseError } from '../../error'
import { deleteGateway } from '../../gateway'
import { loadingFactory } from '../../utils'

export async function deleteGw(ctx: GatewayContext, commandOptions) {
    const { envId } = ctx

    const { gatewayPath, gatewayId } = commandOptions

    if (!gatewayPath && !gatewayId) {
        throw new CloudBaseError('请指定需要删除的网关路径或ID！')
    }

    const loading = loadingFactory()
    loading.start(`[${gatewayPath || gatewayId}] 云函数网关删除中...`)

    try {
        await deleteGateway({
            envId,
            path: gatewayPath,
            gatewayId
        })
        loading.succeed(`[${gatewayPath || gatewayId}] 云函数网关删除成功！`)
    } catch (e) {
        loading.stop()
        throw e
    }
}