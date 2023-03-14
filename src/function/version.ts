import { CloudBaseError } from '../error'
import { IPublishVersionParams, IListFunctionVersionParams, IFunctionVersionsRes } from '../types'
import { getFunctionService } from './base'

// 发布云函数新版本
export async function publishVersion(options: IPublishVersionParams) {
    const { envId, functionName, description = '' } = options

    const scfService = await getFunctionService(envId)

    try {
        await scfService.publishVersion({
            functionName,
            description
        })
    } catch (e) {
        throw new CloudBaseError(`[${functionName}] 函数发布新版本失败： ${e.message}`, {
            code: e.code
        })
    }
}

// 查看函数所有版本
export async function listFunctionVersions(options: IListFunctionVersionParams): Promise<IFunctionVersionsRes> {
    const { envId, functionName, offset = 0, limit = 20 } = options
    const scfService = await getFunctionService(envId)

    try {
        return scfService.listVersionByFunction({
            functionName,
            offset,
            limit
        })
    } catch (e) {
        throw new CloudBaseError(`[${functionName}] 查看寒函数版本列表失败： ${e.message}`, {
            code: e.code
        })
    }
}