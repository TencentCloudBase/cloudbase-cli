import path from 'path'
import { CloudBaseError } from '../../error'
import { updateFunctionCode } from '../../function'
import { loadingFactory } from '../../utils'
import { ICommandContext } from '../command'

export async function codeUpdate(ctx: ICommandContext, name: string) {
    const { envId, config, options } = ctx

    const { codeSecret } = options

    if (!name) {
        throw new CloudBaseError('请指定云函数名称！')
    }

    const func = config.functions.find(item => item.name === name) || { name }

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
