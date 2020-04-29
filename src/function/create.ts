import { loadingFactory } from '../utils'
import { CloudBaseError } from '../error'
import { ICreateFunctionOptions } from '../types'
import { getFunctionService } from './base'

// 创建云函数
export async function createFunction(options: ICreateFunctionOptions): Promise<void> {
    const {
        functionRootPath = '',
        functionPath,
        envId,
        force = false,
        base64Code = '',
        codeSecret
    } = options
    // 兼容处理 config
    const func = {
        ...options?.func?.config,
        ...options.func
    }

    const funcName = func.name

    // 校验运行时
    const validRuntime = ['Nodejs8.9', 'Php7', 'Java8', 'Nodejs10.15']
    if (func.runtime && !validRuntime.includes(func.runtime)) {
        throw new CloudBaseError(
            `${funcName} Invalid runtime value：${
                func.runtime
            }. Now only support: ${validRuntime.join(', ')}`
        )
    }

    const scfService = await getFunctionService(envId)

    func.isWaitInstall = true

    try {
        await scfService.createFunction({
            func,
            force,
            base64Code,
            codeSecret,
            functionPath,
            functionRootPath
        })
    } catch (e) {
        // 不强制覆盖，抛出错误
        if (e.message && !force) {
            throw new CloudBaseError(`[${funcName}] 部署失败，${e.message}`, {
                code: e.code
            })
        }
        throw e
    }
}

// 批量创建云函数
export async function batchCreateFunctions(options: ICreateFunctionOptions): Promise<void> {
    const { functions, functionRootPath = '', envId, force, codeSecret, log = false } = options
    const promises = functions.map((func) =>
        (async () => {
            const loading = loadingFactory()
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
