import path from 'path'
import { FunctionContext } from '../../types'
import { CloudBaseError } from '../../error'
import { updateFunctionCode } from '../../function'
import { loadingFactory } from '../../utils'

export async function codeUpdate(ctx: FunctionContext, options) {
    const { name, envId, config, functions } = ctx

    const { codeSecret } = options

    if (!name) {
        throw new CloudBaseError('请指定函数名称！')
    }

    const func = functions.find(item => item.name === name)
    if (!func || !func.name) {
        throw new CloudBaseError(`函数 ${name} 配置不存在`)
    }

    const loading = loadingFactory()

    loading.start(`[${func.name}] 函数代码更新中...`)
    try {
        await updateFunctionCode({
            func,
            envId,
            codeSecret,
            functionRootPath: path.join(process.cwd(), config.functionRoot)
        })
        loading.succeed(`[${func.name}] 函数代码更新成功！`)
    } catch (e) {
        loading.stop()
        throw e
    }
}
