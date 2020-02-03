import { copyFunction } from '../../function'
import { successLog } from '../../logger'
import { CloudBaseError } from '../../error'
import { ICommandContext } from '../command'

export async function copy(ctx: ICommandContext, name: string, newFunctionName: string) {
    const { envId, options } = ctx

    const { force, codeSecret, targetEnvId } = options

    if (!name) {
        throw new CloudBaseError('请指定函数名称！')
    }

    await copyFunction({
        force,
        envId,
        codeSecret,
        functionName: name,
        newFunctionName: newFunctionName || name,
        targetEnvId: targetEnvId || envId
    })

    successLog('拷贝函数成功')
}
