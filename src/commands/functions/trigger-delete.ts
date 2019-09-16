import inquirer from 'inquirer'
import { FunctionContext } from '../../types'
import { CloudBaseError } from '../../error'
import { batchDeleteTriggers, deleteFunctionTrigger } from '../../function'

export async function triggerDelete(ctx: FunctionContext, triggerName: string) {
    const { name, envId, functions } = ctx
    let isBtachDeleteTriggers
    let isBatchDeleteFunctionTriggers = false

    // 不指定云函数名称，删除配置文件中所有函数的所有触发器
    if (!name) {
        const answer = await inquirer.prompt({
            type: 'confirm',
            name: 'isBatch',
            message:
                '无云函数名称，是否需要删除配置文件中的【全部云函数】的全部触发器？',
            default: false
        })

        // 危险操作，再次确认
        if (answer.isBatch) {
            const { reConfirm } = await inquirer.prompt({
                type: 'confirm',
                name: 'reConfirm',
                message: '确定要删除配置文件中的【全部云函数】的全部触发器？',
                default: false
            })
            isBtachDeleteTriggers = reConfirm
        }

        if (!isBtachDeleteTriggers) {
            throw new CloudBaseError('请指定云函数名称以及触发器名称！')
        }
    }

    if (isBtachDeleteTriggers) {
        return await batchDeleteTriggers({
            envId,
            functions,
        })
    }

    // 指定了函数名称，但没有指定触发器名称，删除此函数的所有触发器
    if (!triggerName && name) {
        const { isBatch } = await inquirer.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '没有指定触发器名称，是否需要此云函数的全部触发器？',
            default: false
        })

        isBatchDeleteFunctionTriggers = isBatch

        if (!isBatchDeleteFunctionTriggers) {
            throw new CloudBaseError('请指定云函数名称以及触发器名称！')
        }
    }

    if (isBatchDeleteFunctionTriggers) {
        const func = functions.find(item => item.name === name)
        return await batchDeleteTriggers({
            envId,
            functions: [func],
        })
    }

    if (!triggerName) {
        throw new CloudBaseError('触发器名称不能为空')
    }

    // 删除指定函数的单个触发器
    deleteFunctionTrigger({
        envId,
        functionName: name,
        triggerName,
    })
}
