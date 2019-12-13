import { GatewayContext } from '../../types'
import { CloudBaseError } from '../../error'
import { createFunctionGateway } from '../../gateway'
import { listFunction } from '../../function'
import { loadingFactory } from '../../utils'

export async function createGw(ctx: GatewayContext, gatewayPath: string, commandOptions) {
    const { envId } = ctx

    if (!gatewayPath) {
        throw new CloudBaseError('请指定需要创建的网关路径！')
    }

    const { function: functionName } = commandOptions

    
    // 创建云函数网关
    if (functionName) {
        const loading = loadingFactory()
        loading.start(`[${functionName}] 云函数网关创建中...`)

        try {
            // step1: 判断云函数是否存在
            const functionList = await listFunction({
                envId,
                limit: 100
            })
            const isExisted = functionList.filter(item => item.FunctionName === functionName)
            if (isExisted.length <= 0) {
                throw new CloudBaseError(`[${functionName}] 云函数不存在！`)
            }

            // step2: 创建云函数网关
            const res = await createFunctionGateway({
                envId,
                path: gatewayPath,
                functionName
            })
            loading.succeed(`[${functionName}:${res.APIId}] 云函数网关创建成功！`)
        } catch (e) {
            loading.stop()
            throw e
        }
        return
    }

    throw new CloudBaseError('请指定需要创建的网关类型！')
}