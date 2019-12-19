import { CloudService, FunctionPacker, CodeType, loadingFactory } from '../utils'
import { CloudBaseError } from '../error'
import { ICreateFunctionOptions } from '../types'
import { createFunctionTriggers } from './trigger'

const scfService = new CloudService('scf', '2018-04-16', {
    Role: 'TCB_QcsRole',
    Stamp: 'MINI_QCBASE'
})

/* eslint-disable complexity */
// 创建云函数
export async function createFunction(options: ICreateFunctionOptions): Promise<void> {
    const {
        func,
        functionRootPath = '',
        envId,
        force = false,
        base64Code = '',
        codeSecret
    } = options
    let base64
    let packer: FunctionPacker
    const funcName = func.name

    // 校验 CodeSecret 格式
    if (codeSecret && !/^[A-Za-z0-9+=/]{1,160}$/.test(codeSecret)) {
        throw new CloudBaseError('CodeSecret 格式错误，格式为 1-160 位大小字母，数字+=/')
    }

    // 校验运行时
    const validRuntime = ['Nodejs8.9', 'Php7', 'Java8']
    if (func.config.runtime && !validRuntime.includes(func.config.runtime)) {
        throw new CloudBaseError(
            `${funcName} Invalid runtime value：${
                func.config.runtime
            }. Now only support: ${validRuntime.join(', ')}`
        )
    }

    // CLI 从本地读取
    if (!base64Code) {
        packer = new FunctionPacker(functionRootPath, funcName, func.ignore)
        const type: CodeType = func.config.runtime === 'Java8' ? CodeType.JavaFile : CodeType.File
        base64 = await packer.build(type)

        if (!base64) {
            throw new CloudBaseError('函数不存在！')
        }
    } else {
        base64 = base64Code
    }

    // 转换环境变量
    const envVariables = Object.keys(func.config.envVariables || {}).map(key => ({
        Key: key,
        Value: func.config.envVariables[key]
    }))

    const params: any = {
        FunctionName: funcName,
        Namespace: envId,
        Code: {
            ZipFile: base64
        },
        // 代码加密
        CodeSecret: codeSecret,
        // 不可选择
        MemorySize: 256,
        // 是否开启 L5
        L5Enable: func.config && func.config.l5 ? 'TRUE' : null
    }

    const { config } = func
    // 修复参数存在 undefined 字段时，会出现鉴权失败的情况
    // Environment 为覆盖式修改，不保留已有字段
    envVariables.length && (params.Environment = { Variables: envVariables })
    // 处理入口
    params.Handler = func.handler || 'index.main'
    // 默认超时时间为 20S
    params.Timeout = Number(config.timeout) || 20
    // 默认运行环境 Nodejs8.9
    params.Runtime = config.runtime || 'Nodejs8.9'
    // VPC 网络
    params.VpcConfig = {
        SubnetId: (config.vpc && config.vpc.subnetId) || '',
        VpcId: (config.vpc && config.vpc.vpcId) || ''
    }
    // 是否安装依赖
    params.InstallDependency =
        typeof config.installDependency === 'undefined'
            ? null
            : config.installDependency
            ? 'TRUE'
            : 'FALSE'

    try {
        // 创建云函数
        await scfService.request('CreateFunction', params)
        // 创建函数触发器
        await createFunctionTriggers({
            functionName: funcName,
            triggers: func.triggers,
            envId
        })
    } catch (e) {
        // 已存在同名函数，强制更新
        if (e.code === 'ResourceInUse.FunctionName' && force) {
            params.ZipFile = base64
            // 更新函数配置和代码
            await scfService.request('UpdateFunctionConfiguration', params)
            delete params.Code
            await scfService.request('UpdateFunctionCode', params)

            // 创建函数触发器
            await createFunctionTriggers({
                functionName: funcName,
                triggers: func.triggers,
                envId
            })
            return
        }

        // 不强制覆盖，抛出错误
        if (e.message && !force) {
            throw new CloudBaseError(`[${funcName}] 部署失败：\n${e.message}`, {
                code: e.code
            })
        }
    }
}

// 批量创建云函数
export async function batchCreateFunctions(options: ICreateFunctionOptions): Promise<void> {
    const { functions, functionRootPath = '', envId, force, codeSecret, log = false } = options
    const promises = functions.map(func =>
        (async () => {
            const loading = loadingFactory()
            // console.log('开始')
            try {
                log && loading.start(`[${func.name}] 函数部署中...`)
                await createFunction({
                    func,
                    envId,
                    force,
                    codeSecret,
                    functionRootPath
                })
                log && loading.succeed(`[${func.name}] 函数部署成功`)
            } catch (e) {
                log && loading.fail(`[${func.name}] 函数部署失败`)
                throw new CloudBaseError(e.message)
            }
        })()
    )

    await Promise.all(promises)
}

// 更新云函数代码
export async function updateFunctionCode(options: ICreateFunctionOptions) {
    const { func, functionRootPath = '', envId, base64Code = '', codeSecret } = options
    let base64
    let packer
    const funcName = func.name

    // 校验 CodeSecret 格式
    if (codeSecret && !/^[A-Za-z0-9+=/]{1,160}$/.test(codeSecret)) {
        throw new CloudBaseError('CodeSecret 格式错误，格式为 1-160 位大小字母，数字+=/')
    }

    // 校验运行时
    const validRuntime = ['Nodejs8.9', 'Php7', 'Java8']
    if (func.config.runtime && !validRuntime.includes(func.config.runtime)) {
        throw new CloudBaseError(
            `${funcName} 非法的运行环境：${func.config.runtime}，当前支持环境：${validRuntime.join(
                ', '
            )}`
        )
    }

    // CLI 从本地读取
    if (!base64Code) {
        packer = new FunctionPacker(functionRootPath, funcName, func.ignore)
        const type: CodeType = func.config.runtime === 'Java8' ? CodeType.JavaFile : CodeType.File
        base64 = await packer.build(type)

        if (!base64) {
            throw new CloudBaseError('函数不存在！')
        }
    } else {
        base64 = base64Code
    }

    const installDependency =
        typeof func.config.installDependency === 'undefined'
            ? null
            : func.config.installDependency
            ? 'TRUE'
            : 'FALSE'

    const params: any = {
        FunctionName: funcName,
        Namespace: envId,
        ZipFile: base64,
        CodeSecret: codeSecret,
        Handler: func.handler || 'index.main',
        InstallDependency: installDependency
    }

    try {
        // 更新云函数代码
        await scfService.request('UpdateFunctionCode', params)
    } catch (e) {
        throw new CloudBaseError(`[${funcName}] 函数代码更新失败： ${e.message}`, {
            code: e.code
        })
    }
}
