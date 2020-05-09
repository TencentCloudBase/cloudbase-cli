import inquirer from 'inquirer'
import { Command, ICommand } from '../common'
import { successLog } from '../../logger'
import { CloudBaseError } from '../../error'
import { createFunctionTriggers, batchCreateTriggers } from '../../function'
import { InjectParams, CmdContext, ArgsParams } from '../../decorators'

@ICommand()
export class CreateTrigger extends Command {
    get options() {
        return {
            cmd: 'functions:trigger:create [functionName]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '创建云函数触发器'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() params) {
        const {
            envId,
            config: { functions }
        } = ctx

        const name = params?.[0]

        let isBatchCreateTrigger = false

        // 不指定云函数名称，创建配置文件中所有函数的所有触发器
        if (!name) {
            const { isBatch } = await inquirer.prompt({
                type: 'confirm',
                name: 'isBatch',
                message: '无云函数名称，是否需要部署配置文件中的【全部云函数】的全部触发器？',
                default: false
            })

            isBatchCreateTrigger = isBatch

            if (!isBatchCreateTrigger) {
                throw new CloudBaseError('请指定云函数名称！')
            }
        }

        if (isBatchCreateTrigger) {
            return batchCreateTriggers({
                envId,
                functions
            })
        }

        const functionItem = functions.find((item) => item.name === name)

        if (!functionItem) {
            throw new CloudBaseError('未找到相关函数配置，请检查函数名是否正确')
        }

        const { triggers } = functionItem

        if (!triggers || !triggers.length) {
            throw new CloudBaseError('触发器配置不能为空')
        }

        await createFunctionTriggers({
            envId,
            functionName: name,
            triggers
        })
        successLog(`[${name}] 创建云函数触发器成功！`)
    }
}
