import { successLog } from '../logger'
import { CloudBaseError } from '../error'
import { CloudApiService } from '../utils'
import { queryGateway, deleteGateway } from '../gateway'

const scfService = CloudApiService.getInstance('scf')

// 删除函数
export async function deleteFunction({ functionName, envId }): Promise<void> {
    // 检测是否绑定了 API 网关
    const res = await queryGateway({
        envId,
        name: functionName
    })
    // 删除绑定的 API 网关
    if (res?.APISet?.length > 0) {
        await deleteGateway({
            envId,
            name: functionName
        })
    }
    await scfService.request('DeleteFunction', {
        FunctionName: functionName,
        Namespace: envId
    })
}

// 批量删除云函数
export async function batchDeleteFunctions({ names, envId }): Promise<void> {
    const promises = names.map(name =>
        (async () => {
            try {
                await deleteFunction({ functionName: name, envId })
                successLog(`[${name}] 函数删除成功！`)
            } catch (e) {
                throw new CloudBaseError(e.message)
            }
        })()
    )

    await Promise.all(promises)
}
