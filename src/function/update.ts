import { CloudBaseError } from '../error'
import { ICreateFunctionOptions } from '../types'
import { getFunctionService } from './base'

// 更新云函数代码
export async function updateFunctionCode(options: ICreateFunctionOptions) {
    const { functionRootPath = '', envId, base64Code = '', codeSecret } = options
    // 兼容处理 config
    const func = {
        ...options?.func?.config,
        ...options.func
    }

    const funcName = func.name

    // 校验 CodeSecret 格式
    if (codeSecret && !/^[A-Za-z0-9+=/]{1,160}$/.test(codeSecret)) {
        throw new CloudBaseError('CodeSecret 格式错误，格式为 1-160 位大小字母，数字+=/')
    }

    const scfService = await getFunctionService(envId)

    try {
        await scfService.updateFunctionCode({
            func,
            functionRootPath,
            base64Code,
            codeSecret
        })
    } catch (e) {
        throw new CloudBaseError(`[${funcName}] 函数代码更新失败： ${e.message}`, {
            code: e.code
        })
    }
}
