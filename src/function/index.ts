import chalk from 'chalk'
import * as fs from 'fs'
import * as path from 'path'
import * as ora from 'ora'
import { getCredential, printCliTable } from '../utils'
import * as tencentcloud from '../../deps/tencentcloud-sdk-nodejs'
import { successLog, errorLog } from '../logger'
import {
    ICloudFunctionTrigger,
    ICloudFunction,
    ICloudFunctionConfig
} from '../types'
import { FunctionPack } from './function-pack'

async function tencentcloudScfRequest(
    interfaceName: string,
    params?: Record<string, any>
) {
    const credential = await getCredential()
    const { secretId, secretKey, token } = credential
    const ScfClient = tencentcloud.scf.v20180416.Client
    const models = tencentcloud.scf.v20180416.Models
    const Credential = tencentcloud.common.Credential
    let cred = new Credential(secretId, secretKey, token)
    let client = new ScfClient(cred, 'ap-shanghai')
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
    name: string,
    triggers: ICloudFunctionTrigger[],
    envId: string
) {
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
        errorLog(`[${name}] 创建触发器失败：${e.message}`)
    }
}

export async function batchCreateTriggers(
    functions: ICloudFunction[],
    envId: string
) {
    functions.forEach(async func => {
        // 一个函数部署失败不影响其他函数部署
        try {
            await createFunctionTriggers(func.name, func.triggers, envId)
        } catch (e) {
            errorLog(e.message)
        }
    })
}

// 删除函数触发器
export async function deleteFunctionTrigger(
    name: string,
    triggerName: string,
    envId: string
) {
    try {
        await tencentcloudScfRequest('DeleteTrigger', {
            FunctionName: name,
            Namespace: envId,
            TriggerName: triggerName,
            Type: 'timer'
        })
        successLog(`[${name}] 删除云函数触发器 ${triggerName} 成功！`)
    } catch (e) {
        errorLog(`[${name}] 删除触发器失败：${e.message}`)
    }
}

export async function batchDeleteTriggers(
    functions: ICloudFunction[],
    envId: string
) {
    functions.forEach(async func => {
        // 一个函数部署失败不影响其他函数部署
        try {
            func.triggers.forEach(async trigger => {
                await deleteFunctionTrigger(func.name, trigger.name, envId)
            })
        } catch (e) {
            errorLog(e.message)
        }
    })
}

// 创建云函数
export async function createFunction(
    func: ICloudFunction,
    projectPath: string,
    envId: string,
    force?: boolean
) {
    const funcName = func.name
    // 函数目录
    const funcPath = path.join(projectPath, 'functions', funcName)
    const distPath = `${funcPath}/dist`
    const packer = new FunctionPack(funcPath, distPath)
    // 清除原打包文件
    await packer.clean()
    // 生成 zip 文件
    await packer.build(funcName)
    // 将 zip 文件转化成 base64
    const base64 = fs
        .readFileSync(path.join(distPath, 'dist.zip'))
        .toString('base64')

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
        MemorySize: 256,
        // 不可选择
        Handler: 'index.main',
        InstallDependency: true,
        // 不可选择
        Runtime: 'Nodejs8.9'
    }

    // 修复参数存在 undefined 字段时，会出现鉴权失败的情况
    // Environment 为覆盖式修改，不保留已有字段
    envVariables.length && (params.Environment = { Variables: envVariables })
    // 默认超时时间为 3S
    params.Timeout = func.config.timeout || 3

    const uploadSpin = ora('云函数上传中').start()

    try {
        // 创建云函数
        await tencentcloudScfRequest('CreateFunction', params)
        await packer.clean()
        uploadSpin.succeed(`函数 "${funcName}" 上传成功！`)
        // 创建函数触发器
        await createFunctionTriggers(funcName, func.triggers, envId)
        successLog(`[${funcName}] 云函数部署成功!`)
    } catch (e) {
        // 已存在同名函数，强制更新
        if (e.code === 'ResourceInUse.FunctionName' && force) {
            await tencentcloudScfRequest('UpdateFunctionCode', params)
            uploadSpin.succeed(`已存在同名函数 "${funcName}"，覆盖成功！`)
            // 创建函数触发器
            await createFunctionTriggers(funcName, func.triggers, envId)
            successLog(`[${funcName}] 云函数部署成功!`)
        }

        // 不强制覆盖，抛出错误
        if (e.message && !force) {
            uploadSpin.fail(chalk.red(`[${funcName}] 部署失败： ${e.message}`))
            await packer.clean()
        }
    }
}

export async function batchCreateFunctions(
    functions: ICloudFunction[],
    projectPath: string,
    envId: string,
    force?: boolean
) {
    functions.forEach(async func => {
        try {
            await createFunction(func, projectPath, envId, force)
        } catch (e) {
            errorLog(e.message)
        }
    })
}

// 列出函数
export async function listFunction(
    limit: number,
    offset: number,
    envId: string
) {
    const res: any = await tencentcloudScfRequest('ListFunctions', {
        Namespace: envId,
        Limit: limit,
        Offset: offset
    })
    const { Functions = [] } = res
    const head: string[] = ['Name', 'Runtime', 'AddTime', 'Description']
    const data: string[][] = []
    Functions.forEach(func => {
        const { FunctionName, Runtime, AddTime, Description } = func
        data.push([FunctionName, Runtime, AddTime, Description])
    })
    printCliTable(head, data)
}

// 删除函数
export async function deleteFunction(name: string, envId: string) {
    try {
        await tencentcloudScfRequest('DeleteFunction', {
            FunctionName: name,
            Namespace: envId
        })
        successLog(`删除函数 [${name}] 成功！`)
    } catch (e) {
        errorLog(`[${name}] 删除操作失败：${e.message}！`)
    }
}

export async function batchDeleteFunctions(names: string[], envId: string) {
    names.forEach(async name => {
        try {
            await deleteFunction(name, envId)
        } catch (e) {
            errorLog(e.message)
        }
    })
}

// 获取云函数详细信息
export async function getFunctionDetail(name: string, envId: string) {
    const res = await tencentcloudScfRequest('GetFunction', {
        FunctionName: name,
        Namespace: envId
    })

    const ResMap = {
        Status: '状态',
        CodeInfo: '函数代码',
        CodeSize: '代码大小',
        Description: '描述',
        Environment: '环境变量(key=value)',
        FunctionName: '函数名称',
        FunctionVersion: '函数版本',
        Handler: '执行方法',
        MemorySize: '内存配置(MB)',
        ModTime: '修改时间',
        Namespace: '环境 Id',
        Runtime: '运行环境',
        Timeout: '超时时间(S)',
        Triggers: '触发器'
    }

    const info = Object.keys(ResMap)
        .map(key => {
            // 将环境变量数组转换成 key=value 的形式
            if (key === 'Environment') {
                const data = res[key].Variables.map(
                    item => `${item.Key}=${item.Value}`
                ).join('; ')
                return `${ResMap[key]}：${data} \n`
            }

            if (key === 'Triggers') {
                const data = res[key].map(
                    item => `${item.TriggerName}：${item.TriggerDesc}`
                ).join('\n')
                return `${ResMap[key]}：\n${data} \n`
            }

            return `${ResMap[key]}：${res[key]} \n`
        })
        .reduce((prev, next) => prev + next)
    console.log(chalk.green(`函数 [${name}] 信息：`) + '\n\n' + info)
}

export async function batchGetFunctionsDetail(names: string[], envId: string) {
    names.forEach(async name => {
        try {
            await getFunctionDetail(name, envId)
        } catch (e) {
            errorLog(`${name} 获取信息失败：${e.message}`)
        }
    })
}

// 获取函数日志
export async function getFunctionLog(
    name: string,
    envId: string,
    condition: Record<string, string | number>
) {
    const params = {
        FunctionName: name,
        Namespace: envId
    }
    Object.keys(condition).forEach(key => {
        const keyFistCharUpperCase = key.charAt(0).toUpperCase() + key.slice(1)
        params[keyFistCharUpperCase] = condition[key]
    })
    const { Data = [] }: any = await tencentcloudScfRequest(
        'GetFunctionLogs',
        params
    )

    const ResMap = {
        StartTime: '请求时间',
        FunctionName: '函数名称',
        BillDuration: '计费时间(ms)',
        Duration: '运行时间(ms)',
        InvokeFinished: '调用次数',
        MemUsage: '占用内存',
        RequestId: '请求 Id',
        RetCode: '调用状态',
        RetMsg: '返回结果'
    }

    console.log(chalk.green(`函数：${name} 调用日志：`) + '\n\n')

    if (Data.length === 0) {
        return console.log('无调用日志')
    }

    Data.forEach(log => {
        const info = Object.keys(ResMap)
            .map(key => {
                if (key === 'RetCode') {
                    return `${ResMap[key]}：${
                        log[key] === 0 ? '成功' : '失败'
                    }\n`
                }
                if (key === 'MemUsage') {
                    const str = Number(Number(Data[key]) / 1024 / 1024).toFixed(
                        3
                    )
                    return `${ResMap[key]}：${str} MB\n`
                }
                return `${ResMap[key]}：${log[key]} \n`
            })
            .reduce((prev, next) => prev + next)
        console.log(info + `日志：\n ${log.Log} \n`)
    })
}

// 更新函数配置
export async function updateFunctionConfig(
    name: string,
    config: ICloudFunctionConfig,
    envId: string
) {
    const envVariables = Object.keys(config.envVariables || {}).map(key => ({
        Key: key,
        Value: config.envVariables[key]
    }))

    const params: any = {
        FunctionName: name,
        Namespace: envId
    }

    // 修复参数存在 undefined 字段时，会出现鉴权失败的情况
    // Environment 为覆盖式修改，不保留已有字段
    envVariables.length && (params.Environment = { Variables: envVariables })
    // 不设默认超时时间，防止覆盖已有配置
    config.timeout && (params.Timeout = config.timeout)

    await tencentcloudScfRequest('UpdateFunctionConfiguration', params)
    successLog('更新云函数配置成功！')
}

export async function batchUpdateFunctionConfig(
    functions: ICloudFunction[],
    envId: string
) {
    functions.forEach(async func => {
        try {
            await updateFunctionConfig(func.name, func.config, envId)
        } catch (e) {
            errorLog(`${func.name} 更新配置失败：${e.message}`)
        }
    })
}
