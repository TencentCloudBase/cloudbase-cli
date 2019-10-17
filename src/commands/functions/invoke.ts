import inquirer from 'inquirer'
import { FunctionContext } from '../../types'
import { CloudBaseError } from '../../error'
import { successLog } from '../../logger'
import { batchInvokeFunctions, invokeFunction } from '../../function'

export async function invoke(ctx: FunctionContext, jsonStringParams: string) {
    const { name, envId, functions } = ctx
    let isBatchInvoke = false

    // 不指定云函数名称，触发配置文件中的所有函数
    if (!name) {
        const { isBatch } = await inquirer.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '无云函数名称，是否需要触发配置文件中的全部云函数？',
            default: false
        })

        isBatchInvoke = isBatch

        if (!isBatchInvoke) {
            throw new CloudBaseError('请指定云函数名称！')
        }
    }

    let params
    if (jsonStringParams) {
        try {
            params = JSON.parse(jsonStringParams)
        } catch (e) {
            console.log(e)
            throw new CloudBaseError(
                'jsonStringParams 参数不是正确的 JSON 字符串'
            )
        }
    }

    if (isBatchInvoke) {
        return await batchInvokeFunctions({
            envId,
            functions,
            log: true
        })
    }

    const func = functions.find(item => item.name === name)

    const configParams = func && func.params ? func.params : undefined

    const result = await invokeFunction({
        envId,
        functionName: name,
        params: params || configParams
    })
    successLog(`[${name}] 调用成功\n响应结果：\n`)
    console.log(result)
}
