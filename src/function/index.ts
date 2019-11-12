import { CloudService } from '../utils'
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

export * from './create'
export * from './trigger'
export * from './code'

interface ICopyFunctionOptions {
    envId: string
    functionName: string
    newFunctionName: string
    targetEnvId: string
    force?: boolean
    copyConfig?: boolean
    codeSecret?: string
}

const scfService = new CloudService('scf', '2018-04-16', {
    Role: 'TCB_QcsRole',
    Stamp: 'MINI_QCBASE'
})

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
        const {
            FunctionId,
            FunctionName,
            Runtime,
            AddTime,
            ModTime,
            Status
        } = func
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

// 删除函数
export async function deleteFunction({ functionName, envId }): Promise<void> {
    try {
        await scfService.request('DeleteFunction', {
            FunctionName: functionName,
            Namespace: envId
        })
    } catch (e) {
        throw new CloudBaseError(
            `[${functionName}] 删除操作失败：${e.message}！`
        )
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

// 获取云函数详细信息
export async function getFunctionDetail(
    options
): Promise<Record<string, string>> {
    const { functionName, envId, codeSecret } = options
    const res = await scfService.request('GetFunction', {
        FunctionName: functionName,
        Namespace: envId,
        ShowCode: 'TRUE',
        CodeSecret: codeSecret
    })

    const data: Record<string, any> = {}
    // 提取信息的键
    const validKeys = [
        'Status',
        'CodeInfo',
        'CodeSize',
        'Environment',
        'FunctionName',
        'Handler',
        'MemorySize',
        'ModTime',
        'Namespace',
        'Runtime',
        'Timeout',
        'Triggers',
        'VpcConfig'
    ]

    // 响应字段为 Duration 首字母大写形式，将字段转换成驼峰命名
    Object.keys(res).forEach(key => {
        if (!validKeys.includes(key)) return
        data[key] = res[key]
    })

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
            data.VPC = {
                vpc: '',
                subnet: ''
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
                    name,
                    envId,
                    codeSecret
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

    const { Data = [] }: any = await scfService.request(
        'GetFunctionLogs',
        params
    )
    return Data
}

// 更新函数配置
export async function updateFunctionConfig(
    options: IUpdateFunctionConfigOptions
): Promise<void> {
    const { functionName, config, envId } = options
    const envVariables = Object.keys(config.envVariables || {}).map(key => ({
        Key: key,
        Value: config.envVariables[key]
    }))

    // 当不存在 L5 配置时，不修改 L5 状态，否则根据 true/false 进行修改
    const l5Enable =
        typeof config.l5 === 'undefined' ? null : config.l5 ? 'TRUE' : 'FALSE'

    const params: any = {
        FunctionName: functionName,
        Namespace: envId,
        L5Enable: l5Enable
    }

    // 修复参数存在 undefined 字段时，会出现鉴权失败的情况
    // Environment 为覆盖式修改，不保留已有字段
    envVariables.length && (params.Environment = { Variables: envVariables })
    // 不设默认超时时间，防止覆盖已有配置
    config.timeout && (params.Timeout = config.timeout)
    // 运行时
    config.runtime && (params.Runtime = config.runtime)
    // VPC 网络
    params.VpcConfig = {
        SubnetId: (config.vpc && config.vpc.subnetId) || '',
        VpcId: (config.vpc && config.vpc.vpcId) || ''
    }

    // 自动安装依赖
    params.InstallDependency =
        typeof config.installDependency === 'undefined'
            ? null
            : config.installDependency
            ? 'TRUE'
            : 'FALSE'

    await scfService.request('UpdateFunctionConfiguration', params)
}

// 批量更新函数配置
export async function batchUpdateFunctionConfig(
    options: IFunctionBatchOptions
): Promise<void> {
    const { functions, envId, log } = options
    const promises = functions.map(func =>
        (async () => {
            try {
                await updateFunctionConfig({
                    functionName: func.name,
                    config: func.config,
                    envId
                })
                log && successLog(`[${func.name}] 更新云函数配置成功！`)
            } catch (e) {
                throw new CloudBaseError(
                    `${func.name} 更新配置失败：${e.message}`
                )
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
                throw new CloudBaseError(
                    `${func.name} 函数调用失败：${e.message}`
                )
            }
        })()
    )

    return await Promise.all(promises)
}

// 复制云函数
export async function copyFunction(options: ICopyFunctionOptions) {
    const {
        envId,
        functionName,
        newFunctionName,
        targetEnvId,
        force,
        codeSecret
    } = options

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
