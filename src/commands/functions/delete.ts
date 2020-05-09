import inquirer from 'inquirer'

import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { loadingFactory } from '../../utils'
import { deleteFunction, batchDeleteFunctions } from '../../function'
import { InjectParams, CmdContext, ArgsParams } from '../../decorators'

@ICommand()
export class DeleteFunction extends Command {
    get options() {
        return {
            cmd: 'functions:delete [name]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '删除云函数'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() params) {
        const name = params?.[0]
        const {
            envId,
            config: { functions }
        } = ctx

        let isBatchDelete = false

        // 不指定云函数名称，默认删除所有函数
        if (!name) {
            const answer = await inquirer.prompt({
                type: 'confirm',
                name: 'isBatch',
                message: '无云函数名称，是否需要删除配置文件中的全部云函数？',
                default: false
            })

            // 危险操作，再次确认
            if (answer.isBatch) {
                const { reConfirm } = await inquirer.prompt({
                    type: 'confirm',
                    name: 'reConfirm',
                    message: '确定要删除配置文件中的全部云函数？',
                    default: false
                })
                isBatchDelete = reConfirm
            }

            if (!isBatchDelete) {
                throw new CloudBaseError('请指定需要删除的云函数名称！')
            }
        }

        if (isBatchDelete) {
            const names: string[] = functions.map((item) => item.name)
            return batchDeleteFunctions({
                names,
                envId
            })
        }

        const loading = loadingFactory()
        loading.start(`删除函数 [${name}] 中...`)

        await deleteFunction({
            envId,
            functionName: name
        })

        loading.succeed(`删除函数 [${name}] 成功！`)
    }
}
