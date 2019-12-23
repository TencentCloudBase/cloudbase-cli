import {GatewayContext} from '../../types'
import { CloudBaseError } from '../../error'
import { deleteGateway } from '../../gateway'
import { loadingFactory } from '../../utils'

export async function deleteGw(ctx: GatewayContext, commandOptions) {
    const { envId } = ctx

    const { servicePath, serviceId } = commandOptions

    if (!servicePath && !serviceId) {
        throw new CloudBaseError('请指定需要删除的 HTTP Service 路径或 ID！')
    }

    const loading = loadingFactory()
    loading.start(`[${servicePath || serviceId}] HTTP Service 删除中...`)

    try {
        await deleteGateway({
            envId,
            path: servicePath,
            gatewayId: serviceId
        })
        loading.succeed('HTTP Service 删除成功！')
    } catch (e) {
        loading.stop()
        throw e
    }
}