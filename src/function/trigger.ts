import { CloudService } from '../utils'
import { successLog } from '../logger'
import {
    IFunctionTriggerOptions,
    IFunctionBatchOptions
} from '../types'
import { TcbError } from '../error'

const scfService = new CloudService('scf', '2018-04-16', {
    Role: 'TCB_QcsRole',
    Stamp: 'MINI_QCBASE'
})

// 创建函数触发器
export async function createFunctionTriggers(
    options: IFunctionTriggerOptions
): Promise<void> {
    const { functionName: name, triggers = [], envId } = options

    const parsedTriggers = triggers.map(item => ({
        TriggerName: item.name,
        Type: item.type,
        TriggerDesc: item.config
    }))

    try {
        await scfService.request('BatchCreateTrigger', {
            FunctionName: name,
            Namespace: envId,
            Triggers: JSON.stringify(parsedTriggers),
            Count: parsedTriggers.length
        })
        // successLog(`[${name}] 创建云函数触发器成功！`)
    } catch (e) {
        throw new TcbError(`[${name}] 创建触发器失败：${e.message}`)
    }
}

// 批量部署函数触发器
export async function batchCreateTriggers(
    options: IFunctionBatchOptions
): Promise<void> {
    const { functions, envId } = options

    const promises = functions.map(func =>
        (async () => {
            try {
                await createFunctionTriggers({
                    functionName: func.name,
                    triggers: func.triggers,
                    envId
                })
            } catch (e) {
                throw new TcbError(e.message)
            }
        })()
    )

    await Promise.all(promises)
}

// 删除函数触发器
export async function deleteFunctionTrigger(
    options: IFunctionTriggerOptions
): Promise<void> {
    const { functionName, triggerName, envId } = options
    try {
        await scfService.request('DeleteTrigger', {
            FunctionName: functionName,
            Namespace: envId,
            TriggerName: triggerName,
            Type: 'timer'
        })
        successLog(`[${functionName}] 删除云函数触发器 ${triggerName} 成功！`)
    } catch (e) {
        throw new TcbError(`[${functionName}] 删除触发器失败：${e.message}`)
    }
}

export async function batchDeleteTriggers(
    options: IFunctionBatchOptions
): Promise<void> {
    const { functions, envId } = options
    const promises = functions.map(func =>
        (async () => {
            try {
                func.triggers.forEach(async trigger => {
                    await deleteFunctionTrigger({
                        functionName: func.name,
                        triggerName: trigger.name,
                        envId
                    })
                })
            } catch (e) {
                throw new TcbError(e.message)
            }
        })()
    )

    await Promise.all(promises)
}
