import CloudBase from '@cloudbase/manager-node'
import { CloudApiService, checkAndGetCredential, getProxy } from '../utils'
import { successLog } from '../logger'
import {
    IListFunctionOptions,
    IFunctionLogOptions,
    IUpdateFunctionConfigOptions,
    IFunctionBatchOptions,
    InvokeFunctionOptions
} from '../types'
import { CloudBaseError } from '../error'
import { getVpcs, getSubnets } from './vpc'
import { BaseOptions } from 'vm'

export interface IBaseOptions {
    envId: string
    functionName: string
}

export interface ICopyFunctionOptions {
    envId: string
    functionName: string
    newFunctionName: string
    targetEnvId: string
    force?: boolean
    copyConfig?: boolean
    codeSecret?: string
}

const scfService = CloudApiService.getInstance('scf')
export interface IDetailOptions extends IBaseOptions {
    codeSecret?: string
}

export async function getFunctionService(envId: string) {
    const { secretId, secretKey, token } = await checkAndGetCredential(true)
    const app = new CloudBase({
        secretId,
        secretKey,
        token,
        envId,
        proxy: getProxy()
    })
    return app.functions
}

// 列出函数
export async function listFunction(
    options: IListFunctionOptions
): Promise<Record<string, string>[]> {
    const { limit = 20, offset = 0, envId } = options
    const res: any = await scfService.request('ListFunctions', {
        Namespace: envId,
        Limit: limit,
        Offset: offset
    })
    const { Functions = [] } = res
    const data: Record<string, string>[] = []
    Functions.forEach(func => {
        const { FunctionId, FunctionName, Runtime, AddTime, ModTime, Status } = func
        data.push({
            FunctionId,
            FunctionName,
            Runtime,
            AddTime,
            ModTime,
            Status
        })
    })

    return data
}

// 获取云函数详细信息
export async function getFunctionDetail(options: IDetailOptions): Promise<Record<string, any>> {
    const { functionName, envId, codeSecret } = options

    const res = await scfService.request('GetFunction', {
        FunctionName: functionName,
        Namespace: envId,
        ShowCode: 'TRUE',
        CodeSecret: codeSecret
    })

    const data: Record<string, any> = res

    // 获取 VPC 信息
    const { VpcId = '', SubnetId = '' } = data.VpcConfig || {}
    if (VpcId && SubnetId) {
        try {
            const vpcs = await getVpcs()
            const subnets = await getSubnets(VpcId)
            const vpc = vpcs.find(item => item.VpcId === VpcId)
            const subnet = subnets.find(item => item.SubnetId === SubnetId)
            data.VpcConfig = {
                vpc,
                subnet
            }
        } catch (e) {
            // 无法获取到 VPC 配置，只展示 id 信息
            data.VpcConfig = {
                vpc: VpcId,
                subnet: SubnetId
            }
        }
    }
    return data
}

// 批量获取函数信息
export async function batchGetFunctionsDetail({
    names,
    envId,
    codeSecret
}): Promise<Record<string, string>[]> {
    const data: Record<string, string>[] = []
    const promises = names.map(name =>
        (async () => {
            try {
                const info = await getFunctionDetail({
                    envId,
                    codeSecret,
                    functionName: name
                })
                data.push(info)
            } catch (e) {
                throw new CloudBaseError(`${name} 获取信息失败：${e.message}`)
            }
        })()
    )

    await Promise.all(promises)

    return data
}

// 获取函数日志
export async function getFunctionLog(
    options: IFunctionLogOptions
): Promise<Record<string, string>[]> {
    const { envId } = options

    const params = {
        Namespace: envId
    }

    Object.keys(options).forEach(key => {
        if (key === 'envId') return
        const keyFirstCharUpperCase = key.charAt(0).toUpperCase() + key.slice(1)
        params[keyFirstCharUpperCase] = options[key]
    })

    const { Data = [] }: any = await scfService.request('GetFunctionLogs', params)
    return Data
}

// 更新函数配置
export async function updateFunctionConfig(options: IUpdateFunctionConfigOptions): Promise<void> {
    const { functionName, config, envId } = options

    const functionService = await getFunctionService(envId)
    await functionService.updateFunctionConfig({
        name: functionName,
        ...config
    })
}

// 批量更新函数配置
export async function batchUpdateFunctionConfig(options: IFunctionBatchOptions): Promise<void> {
    const { functions, envId, log } = options
    const promises = functions.map(func =>
        (async () => {
            try {
                await updateFunctionConfig({
                    functionName: func.name,
                    config: func,
                    envId
                })
                log && successLog(`[${func.name}] 更新云函数配置成功！`)
            } catch (e) {
                throw new CloudBaseError(`${func.name} 更新配置失败：${e.message}`)
            }
        })()
    )

    await Promise.all(promises)
}

// 调用函数
export async function invokeFunction(options: InvokeFunctionOptions) {
    const { functionName, envId, params = {} } = options

    const _params = {
        FunctionName: functionName,
        Namespace: envId,
        ClientContext: JSON.stringify(params),
        LogType: 'Tail'
    }

    try {
        const { Result } = await scfService.request('Invoke', _params)
        return Result
    } catch (e) {
        throw new CloudBaseError(`[${functionName}] 调用失败：\n${e.message}`)
    }
}

// 批量触发云函数
export async function batchInvokeFunctions(options: IFunctionBatchOptions) {
    const { functions, envId, log = false } = options

    const promises = functions.map(func =>
        (async () => {
            try {
                const result = await invokeFunction({
                    functionName: func.name,
                    params: func.params,
                    envId
                })
                if (log) {
                    successLog(`[${func.name}] 调用成功\n响应结果：\n`)
                    console.log(result)
                }
                return result
            } catch (e) {
                throw new CloudBaseError(`${func.name} 函数调用失败：${e.message}`)
            }
        })()
    )

    return Promise.all(promises)
}

// 复制云函数
export async function copyFunction(options: ICopyFunctionOptions) {
    const { envId, functionName, newFunctionName, targetEnvId, force, codeSecret } = options

    if (!envId || !functionName || !newFunctionName) {
        throw new CloudBaseError('参数缺失')
    }

    await scfService.request('CopyFunction', {
        FunctionName: functionName,
        NewFunctionName: newFunctionName,
        Namespace: envId,
        TargetNamespace: targetEnvId || envId,
        Override: force ? true : false,
        CodeSecret: codeSecret
    })
}
