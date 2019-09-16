import ora from 'ora'
import path from 'path'
import { FunctionContext } from '../../types'
import { CloudBaseError } from '../../error'
import { updateFunctionCode } from '../../function'

export async function codeUpdate(ctx: FunctionContext) {
    const { name, envId, config, functions } = ctx

    if (!name) {
        throw new CloudBaseError('请指定函数名称！')
    }

    const func = functions.find(item => item.name === name)
    if (!func || !func.name) {
        throw new CloudBaseError(`函数 ${name} 配置不存在`)
    }

    const spinner = ora(`[${func.name}] 函数代码更新中...`).start()
    try {
        await updateFunctionCode({
            func,
            envId,
            functionRootPath: path.join(process.cwd(), config.functionRoot)
        })
        spinner.succeed(`[${func.name}] 函数代码更新成功！`)
    } catch (e) {
        spinner.stop()
        throw e
    }
}
