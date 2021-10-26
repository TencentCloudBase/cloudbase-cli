import { CloudBaseError } from '../error'
import { ISetProvisionedConcurrencyConfig, IGetProvisionedConcurrencyConfig, IGetProvisionedConcurrencyRes, IFunctionVersionsRes } from '../types'
import { getFunctionService } from './base'

// 设置函数预置并发
export async function setProvisionedConcurrencyConfig(options: ISetProvisionedConcurrencyConfig) {
    const { envId, functionName, qualifier, versionProvisionedConcurrencyNum } = options

    const scfService = await getFunctionService(envId)

    try {
        await scfService.setProvisionedConcurrencyConfig({
            functionName,
            qualifier,
            versionProvisionedConcurrencyNum
        })
    } catch (e) {
        throw new CloudBaseError(`[${functionName}] 设置函数预置并发失败： ${e.message}`, {
            code: e.code
        })
    }
}

// 查看函数预置并发
export async function getProvisionedConcurrencyConfig(options: IGetProvisionedConcurrencyConfig): Promise<IGetProvisionedConcurrencyRes> {
    const { envId, functionName, qualifier } = options
    const scfService = await getFunctionService(envId)

    try {
        return scfService.getProvisionedConcurrencyConfig({
            functionName,
            qualifier,
        })
    } catch (e) {
        throw new CloudBaseError(`[${functionName}] 查看函数预置并发信息失败： ${e.message}`, {
            code: e.code
        })
    }
}

// 删除函数预置并发
export async function deleteProvisionedConcurrencyConfig(options: IGetProvisionedConcurrencyConfig): Promise<void> {
    const { envId, functionName, qualifier } = options
    const scfService = await getFunctionService(envId)

    try {
        await scfService.deleteProvisionedConcurrencyConfig({
            functionName,
            qualifier
        })
    } catch (e) {
        throw new CloudBaseError(`[${functionName}] 删除函数预置并发失败： ${e.message}`, {
            code: e.code
        })
    }
}

