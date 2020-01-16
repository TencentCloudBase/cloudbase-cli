import chalk from 'chalk'
import { GatewayContext } from '../../types'
import { CloudBaseError } from '../../error'
import { createFunctionGateway } from '../../gateway'
import { listFunction } from '../../function'
import { loadingFactory, genClickableLink } from '../../utils'

export async function createGw(ctx: GatewayContext, commandOptions) {
    const { envId } = ctx

    const { function: functionName, servicePath } = commandOptions

    if (!servicePath) {
        throw new CloudBaseError('请指定需要创建的 HTTP Service 路径！')
    }

    // 创建云函数网关
    if (functionName) {
        const loading = loadingFactory()
        loading.start(`[${functionName}] 云函数 HTTP Service 创建中...`)

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
                path: servicePath,
                functionName
            })
            const link = genClickableLink(`https://${envId}.service.tcloudbase.com${servicePath}`)
            loading.succeed(`云函数 HTTP Service 创建成功！\n点击访问> ${link}`)
        } catch (e) {
            loading.stop()
            throw e
        }
        return
    }

    throw new CloudBaseError('请指定需要创建的 HTTP Service 类型！')
}
