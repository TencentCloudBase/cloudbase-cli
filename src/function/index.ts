import fs from 'fs'
import path from 'path'
import ora from 'ora'
import { getCredential } from '../utils'
import tencentcloud from '../../deps/tencentcloud-sdk-nodejs'
import { successLog } from '../logger'
import {
    AuthSecret,
    IFunctionTriggerOptions,
    ICreateFunctionOptions,
    IListFunctionOptions,
    IFunctionLogOptions,
    IUpdateFunctionConfigOptions,
    IFunctionBatchOptions,
    InvokeFunctionOptions
} from '../types'
import { FunctionPack } from './function-pack'
import { TcbError } from '../error'
import { getVpcs, getSubnets } from './vpc'

async function tencentcloudScfRequest(
    interfaceName: string,
    params?: Record<string, any>
) {
    const credential: AuthSecret = await getCredential()
    const { secretId, secretKey, token } = credential
    const ScfClient = tencentcloud.scf.v20180416.Client
    const models = tencentcloud.scf.v20180416.Models
    const { Credential, HttpProfile } = tencentcloud.common
    let cred = new Credential(secretId, secretKey, token)
    let client = new ScfClient(cred, 'ap-shanghai', {
        signMethod: 'TC3-HMAC-SHA256',
        httpProfile: new HttpProfile()
    })
    let req = new models[`${interfaceName}Request`]()

    const _params = {
        Region: 'ap-shanghai',
        Role: 'TCB_QcsRole',
        Stamp: 'MINI_QCBASE',
        ...params
    }

    req.deserialize(_params)

    return new Promise((resolve, reject) => {
        client[interfaceName](req, (err, response) => {
            if (err) {
                reject(err)
                return
            }
            resolve(response)
        })
    })
}

// 创建函数触发器
export async function createFunctionTriggers(
    options: IFunctionTriggerOptions
): Promise<void> {
    const { functionName: name, triggers, envId } = options

    const parsedTriggers = triggers.map(item => ({
        TriggerName: item.name,
        Type: item.type,
        TriggerDesc: item.config
    }))

    try {
        await tencentcloudScfRequest('BatchCreateTrigger', {
            FunctionName: name,
            Namespace: envId,
            Triggers: JSON.stringify(parsedTriggers),
            Count: parsedTriggers.length
        })
        successLog(`[${name}] 创建云函数触发器成功！`)
    } catch (e) {
        throw new TcbError(`[${name}] 创建触发器失败：${e.message}`)
    }
}

// 批量部署函数触发器
export async function batchCreateTriggers(
    options: IFunctionBatchOptions
): Promise<void> {
    const { functions, envId } = options

    const promises = functions.map(func =>
        (async () => {
            try {
                await createFunctionTriggers({
                    functionName: func.name,
                    triggers: func.triggers,
                    envId
                })
            } catch (e) {
                throw new TcbError(e.message)
            }
        })()
    )

    await Promise.all(promises)
}

// 删除函数触发器
export async function deleteFunctionTrigger(
    options: IFunctionTriggerOptions
): Promise<void> {
    const { functionName, triggerName, envId } = options
    try {
        await tencentcloudScfRequest('DeleteTrigger', {
            FunctionName: functionName,
            Namespace: envId,
            TriggerName: triggerName,
            Type: 'timer'
        })
        successLog(`[${functionName}] 删除云函数触发器 ${triggerName} 成功！`)
    } catch (e) {
        throw new TcbError(`[${functionName}] 删除触发器失败：${e.message}`)
    }
}

export async function batchDeleteTriggers(
    options: IFunctionBatchOptions
): Promise<void> {
    const { functions, envId } = options
    const promises = functions.map(func =>
        (async () => {
            try {
                func.triggers.forEach(async trigger => {
                    await deleteFunctionTrigger({
                        functionName: func.name,
                        triggerName: trigger.name,
                        envId
                    })
                })
            } catch (e) {
                throw new TcbError(e.message)
            }
        })()
    )

    await Promise.all(promises)
}

function getJavaZipFilePath(funcPath: string, funcName: string) {
    const jarExist = fs.existsSync(`${funcPath}.jar`)
    const zipExist = fs.existsSync(`${funcPath}.zip`)
    if (!jarExist && !zipExist) {
        throw new TcbError(
            `${funcName} Java 编译文件不存在，部署终止。Java 仅支持编译打包后的 Zip/Jar 包`
        )
    }
    return jarExist ? `${funcPath}.jar` : `${funcPath}.zip`
}

// 创建云函数
export async function createFunction(
    options: ICreateFunctionOptions
): Promise<void> {
    const { func, root = '', envId, force = false, zipFile = '' } = options
    let base64
    let packer
    const funcName = func.name

    // 校验运行时
    const validRuntime = ['Nodejs8.9', 'Php7', 'Java8']
    if (func.config.runtime && !validRuntime.includes(func.config.runtime)) {
        throw new TcbError(
            `${funcName} 非法的运行环境：${
                func.config.runtime
            }，当前支持环境：${validRuntime.join(', ')}`
        )
    }

    // CLI 从本地读取
    if (!zipFile) {
        let zipFilePath = ''
        const funcPath = path.join(root, 'functions', funcName)
        // Java
        if (func.config.runtime === 'Java8') {
            zipFilePath = getJavaZipFilePath(funcPath, funcName)
        } else {
            // 函数目录
            if (!fs.existsSync(funcPath)) {
                throw new TcbError(`${funcName} 函数文件不存在，部署终止`)
            }
            const distPath = `${funcPath}/dist`
            packer = new FunctionPack(funcPath, distPath)
            // 清除原打包文件
            await packer.clean()
            // 生成 zip 文件
            await packer.build(funcName)
            zipFilePath = path.join(distPath, 'dist.zip')
        }
        // 将 zip 文件转化成 base64
        base64 = fs.readFileSync(zipFilePath).toString('base64')
    } else {
        base64 = zipFile
    }

    // 转换环境变量
    const envVariables = Object.keys(func.config.envVariables || {}).map(
        key => ({
            Key: key,
            Value: func.config.envVariables[key]
        })
    )

    const params: any = {
        FunctionName: funcName,
        Namespace: envId,
        Code: {
            ZipFile: base64
        },
        // 不可选择
        MemorySize: 256
    }

    const { config } = func
    // 修复参数存在 undefined 字段时，会出现鉴权失败的情况
    // Environment 为覆盖式修改，不保留已有字段
    envVariables.length && (params.Environment = { Variables: envVariables })
    // 处理入口
    params.Handler = func.handler || 'index.main'
    // 默认超时时间为 3S
    params.Timeout = Number(config.timeout) || 3
    // 默认运行环境 Nodejs8.9
    params.Runtime = config.runtime || 'Nodejs8.9'
    // VPC 网络
    params.VpcConfig = {
        SubnetId: (config.vpc && config.vpc.subnetId) || '',
        VpcId: (config.vpc && config.vpc.vpcId) || ''
    }
    // Node 安装依赖
    // func.config.runtime === 'Nodejs8.9' && (params.InstallDependency = true)

    const uploadSpin = ora('云函数上传中').start()

    try {
        // 创建云函数
        await tencentcloudScfRequest('CreateFunction', params)
        !zipFile && packer && (await packer.clean())
        uploadSpin.succeed(`函数 "${funcName}" 上传成功！`)
        // 创建函数触发器
        await createFunctionTriggers({
            functionName: funcName,
            triggers: func.triggers,
            envId
        })
        successLog(`[${funcName}] 云函数部署成功!`)
    } catch (e) {
        // 已存在同名函数，强制更新
        if (e.code === 'ResourceInUse.FunctionName' && force) {
            await tencentcloudScfRequest('UpdateFunctionCode', params)
            !zipFile && packer && (await packer.clean())
            uploadSpin.succeed(`已存在同名函数 "${funcName}"，覆盖成功！`)
            // 创建函数触发器
            await createFunctionTriggers({
                functionName: funcName,
                triggers: func.triggers,
                envId
            })
            successLog(`[${funcName}] 云函数部署成功!`)
            return
        }

        // 不强制覆盖，抛出错误
        if (e.message && !force) {
            !zipFile && packer && (await packer.clean())
            uploadSpin.fail(`[${funcName}] 云函数上传失败！`)
            throw new TcbError(`[${funcName}] 部署失败： ${e.message}`, {
                code: e.code
            })
        }
    }
}

// 批量创建云函数
export async function batchCreateFunctions(
    options: ICreateFunctionOptions
): Promise<void> {
    const { functions, root, envId, force } = options
    const promises = functions.map(func =>
        (async () => {
            try {
                await createFunction({
                    func,
                    root,
                    envId,
                    force
                })
            } catch (e) {
                throw new TcbError(e.message)
            }
        })()
    )

    await Promise.all(promises)
}

// 列出函数
export async function listFunction(
    options: IListFunctionOptions
): Promise<Record<string, string>[]> {
    const { limit = 20, offset = 0, envId } = options
    const res: any = await tencentcloudScfRequest('ListFunctions', {
        Namespace: envId,
        Limit: limit,
        Offset: offset
    })
    const { Functions = [] } = res
    const data: Record<string, string>[] = []
    Functions.forEach(func => {
        const { FunctionName, Runtime, AddTime, Description } = func
        data.push({
            FunctionName,
            Runtime,
            AddTime,
            Description
        })
    })

    return data
}

// 删除函数
export async function deleteFunction({ functionName, envId }): Promise<void> {
    try {
        await tencentcloudScfRequest('DeleteFunction', {
            FunctionName: functionName,
            Namespace: envId
        })
        successLog(`删除函数 [${functionName}] 成功！`)
    } catch (e) {
        throw new TcbError(`[${functionName}] 删除操作失败：${e.message}！`)
    }
}

// 批量删除云函数
export async function batchDeleteFunctions({ names, envId }): Promise<void> {
    const promises = names.map(name =>
        (async () => {
            try {
                await deleteFunction({ functionName: name, envId })
            } catch (e) {
                throw new TcbError(e.message)
            }
        })()
    )

    await Promise.all(promises)
}

// 获取云函数详细信息
export async function getFunctionDetail(
    options
): Promise<Record<string, string>> {
    const { functionName, envId } = options
    const res = await tencentcloudScfRequest('GetFunction', {
        FunctionName: functionName,
        Namespace: envId
    })

    const data: Record<string, any> = {}
    // 提取信息的键
    const validKeys = [
        'Status',
        'CodeInfo',
        'CodeSize',
        'Description',
        'Environment',
        'FunctionName',
        'FunctionVersion',
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
    envId
}): Promise<Record<string, string>[]> {
    const data: Record<string, string>[] = []
    const promises = names.map(name =>
        (async () => {
            try {
                const info = await getFunctionDetail({
                    name,
                    envId
                })
                data.push(info)
            } catch (e) {
                throw new TcbError(`${name} 获取信息失败：${e.message}`)
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
    
    const { Data = [] }: any = await tencentcloudScfRequest(
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

    const params: any = {
        FunctionName: functionName,
        Namespace: envId
    }

    // 修复参数存在 undefined 字段时，会出现鉴权失败的情况
    // Environment 为覆盖式修改，不保留已有字段
    envVariables.length && (params.Environment = { Variables: envVariables })
    // 不设默认超时时间，防止覆盖已有配置
    config.timeout && (params.Timeout = config.timeout)
    // VPC 网络
    params.VpcConfig = {
        SubnetId: (config.vpc && config.vpc.subnetId) || '',
        VpcId: (config.vpc && config.vpc.vpcId) || ''
    }

    await tencentcloudScfRequest('UpdateFunctionConfiguration', params)
}

// 批量更新函数配置
export async function batchUpdateFunctionConfig(
    options: IFunctionBatchOptions
): Promise<void> {
    const { functions, envId } = options
    const promises = functions.map(func =>
        (async () => {
            try {
                await updateFunctionConfig({
                    functionName: func.name,
                    config: func.config,
                    envId
                })
            } catch (e) {
                throw new TcbError(`${func.name} 更新配置失败：${e.message}`)
            }
        })()
    )

    await Promise.all(promises)
}

// 调用函数
export async function invokeFunction(
    options: InvokeFunctionOptions
): Promise<any> {
    const { functionName, envId, params = {} } = options

    const _params: any = {
        FunctionName: functionName,
        Namespace: envId,
        ClientContext: JSON.stringify(params)
    }

    try {
        const { Result }: any = await tencentcloudScfRequest('Invoke', _params)
        successLog(`[${functionName}] 调用成功\n响应结果：\n`)
        // 打印结果
        console.log(Result)
        return Result
    } catch (e) {
        throw new TcbError(`[${functionName}] 调用失败：\n${e.message}`)
    }
}

export async function batchInvokeFunctions(options: IFunctionBatchOptions) {
    const { functions, envId } = options

    const promises = functions.map(func =>
        (async () => {
            try {
                await invokeFunction({
                    functionName: func.name,
                    params: func.params,
                    envId
                })
            } catch (e) {
                throw new TcbError(`${func.name} 函数调用失败：${e.message}`)
            }
        })()
    )

    await Promise.all(promises)
}
