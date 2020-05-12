import inquirer from 'inquirer'
import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { InjectParams, CmdContext, ArgsParams } from '../../decorators'
import { batchDeleteTriggers, deleteFunctionTrigger } from '../../function'

@ICommand()
export class DeleteTrigger extends Command {
    get options() {
        return {
            cmd: 'functions:trigger:delete [functionName] [triggerName]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '删除云函数触发器'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() params) {
        const {
            envId,
            config: { functions }
        } = ctx

        const name = params?.[0]
        const triggerName = params?.[1]

        let isBatchDeleteTriggers
        let isBatchDeleteFunctionTriggers = false

        // 不指定云函数名称，删除配置文件中所有函数的所有触发器
        if (!name) {
            const answer = await inquirer.prompt({
                type: 'confirm',
                name: 'isBatch',
                message: '无云函数名称，是否需要删除配置文件中的【全部云函数】的全部触发器？',
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
                isBatchDeleteTriggers = reConfirm
            }

            if (!isBatchDeleteTriggers) {
                throw new CloudBaseError('请指定云函数名称以及触发器名称！')
            }
        }

        if (isBatchDeleteTriggers) {
            return batchDeleteTriggers({
                envId,
                functions
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
            const func = functions.find((item) => item.name === name)
            return batchDeleteTriggers({
                envId,
                functions: [func]
            })
        }

        if (!triggerName) {
            throw new CloudBaseError('触发器名称不能为空')
        }

        // 删除指定函数的单个触发器
        await deleteFunctionTrigger({
            envId,
            functionName: name,
            triggerName
        })
    }
}
