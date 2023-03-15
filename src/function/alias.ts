import { CloudBaseError } from '../error'
import { IUpdateFunctionAliasConfig, IGetFunctionAlias, IGetFunctionAliasRes } from '../types'
import { getFunctionService } from './base'

// 设置函数流量配置信息（ALIAS 配置）
export async function setFunctionAliasConfig(options: IUpdateFunctionAliasConfig) {
    const { envId, functionName, name, functionVersion, description, routingConfig } = options

    const scfService = await getFunctionService(envId)

    try {
        await scfService.updateFunctionAliasConfig({
            functionName,
            name,
            functionVersion,
            description,
            routingConfig
        })
    } catch (e) {
        throw new CloudBaseError(`[${functionName}] 设置函数流量配置失败： ${e.message}`, {
            code: e.code
        })
    }
}

// 查询函数别名配置信息
export async function getFunctionAliasConfig(options: IGetFunctionAlias): Promise<IGetFunctionAliasRes> {
    const { envId, functionName, name } = options

    const scfService = await getFunctionService(envId)

    try {
        return scfService.getFunctionAlias({
            functionName,
            name
        })
    } catch (e) {
        throw new CloudBaseError(`[${functionName}] 查询函数别名配置失败： ${e.message}`, {
            code: e.code
        })
    }
}

