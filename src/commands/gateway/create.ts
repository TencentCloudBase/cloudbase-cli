import { CloudBaseError } from '../../error'
import { createGateway } from '../../gateway'
import { listFunction } from '../../function'
import { loadingFactory, genClickableLink } from '../../utils'
import { ICommandContext } from '../command'

export async function createService(ctx: ICommandContext) {
    const { envId, options } = ctx

    const { function: functionName, servicePath } = options

    if (!servicePath) {
        throw new CloudBaseError('请指定需要创建的 HTTP Service 路径！')
    }

    if (!functionName) {
        throw new CloudBaseError('请指定需要创建的 HTTP Service 的云函数名称！')
    }

    // 创建云函数网关
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
        const res = await createGateway({
            envId,
            path: servicePath,
            name: functionName
        })
        const link = genClickableLink(`https://${envId}.service.tcloudbase.com${servicePath}`)
        loading.succeed(`云函数 HTTP Service 创建成功！\n点击访问> ${link}`)
    } catch (e) {
        loading.stop()
        if (e.code === 'InvalidParameter.APICreated') {
            throw new CloudBaseError('路径已存在！')
        }
        throw e
    }
}
