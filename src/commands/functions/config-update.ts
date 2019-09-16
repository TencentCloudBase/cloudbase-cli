import inquirer from 'inquirer'
import { FunctionContext } from '../../types'
import { CloudBaseError } from '../../error'
import { batchUpdateFunctionConfig, updateFunctionConfig } from '../../function'
import { successLog } from '../../logger'

export async function configUpdate(ctx: FunctionContext) {
    const { name, envId, functions } = ctx
    let isBathUpdate = false

    // 不指定云函数名称，更新配置文件中所有函数的配置
    if (!name) {
        const { isBatch } = await inquirer.prompt({
            type: 'confirm',
            name: 'isBatch',
            message:
                '无云函数名称，是否需要更新配置文件中的【全部云函数】的配置？',
            default: false
        })

        isBathUpdate = isBatch

        if (!isBathUpdate) {
            throw new CloudBaseError('请指定云函数名称！')
        }
    }

    if (isBathUpdate) {
        await batchUpdateFunctionConfig({
            envId,
            functions,
            log: true
        })
        return
    }

    const functionItem = functions.find(item => item.name === name)

    if (!functionItem) {
        throw new CloudBaseError('未找到相关函数配置，请检查函数名是否正确')
    }

    await updateFunctionConfig({
        envId,
        functionName: name,
        config: functionItem.config
    })

    successLog(`[${name}] 更新云函数配置成功！`)
}
