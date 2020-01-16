
import { CloudApiService, loadingFactory } from '../utils'
import { successLog } from '../logger'
import { CloudBaseError } from '../error'

const scfService = new CloudApiService('scf')

// 删除函数
export async function deleteFunction({ functionName, envId }): Promise<void> {
    // TODO: 删除网关路径
    try {
        await scfService.request('DeleteFunction', {
            FunctionName: functionName,
            Namespace: envId
        })
    } catch (e) {
        throw new CloudBaseError(`[${functionName}] 删除操作失败：${e.message}！`)
    }
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