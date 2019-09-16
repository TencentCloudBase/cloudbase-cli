import { copyFunction } from '../../function'
import { successLog } from '../../logger'
import { CloudBaseError } from '../../error'

export async function copy(ctx, newFunctionName, targentEnvId, options) {
    const { name, envId } = ctx

    const { force } = options

    if (!name || !newFunctionName) {
        throw new CloudBaseError('请指定函数名称！')
    }

    await copyFunction({
        force,
        envId,
        newFunctionName,
        functionName: name,
        targetEnvId: targentEnvId || envId
    })

    successLog('拷贝函数成功')
}
