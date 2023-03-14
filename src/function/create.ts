import { loadingFactory } from '../utils'
import { CloudBaseError } from '../error'
import { getFunctionService } from './base'
import { ICreateFunctionOptions, ICloudFunction } from '../types'

// 创建云函数
export async function createFunction(options: ICreateFunctionOptions): Promise<void> {
    const {
        envId,
        accessPath,
        codeSecret,
        force = false,
        functionPath,
        base64Code = '',
        functionRootPath = ''
    } = options

    // 兼容处理 config
    const func: ICloudFunction & { path?: string } = {
        ...options?.func?.config,
        ...options.func
    }

    // 覆盖默认的路径
    accessPath && (func.path = accessPath)

    const funcName = func.name

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
                code: e.code,
                original: e
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
