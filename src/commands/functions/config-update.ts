import inquirer from 'inquirer'
import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { InjectParams, CmdContext, ArgsParams, Log, Logger } from '../../decorators'
import { batchUpdateFunctionConfig, updateFunctionConfig } from '../../function'

@ICommand()
export class ConfigUpdate extends Command {
    get options() {
        return {
            cmd: 'functions:config:update [name]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '更新云函数配置'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() params, @Log() log: Logger) {
        const {
            envId,
            config: { functions }
        } = ctx
        const name = params?.[0]
        let isBathUpdate = false

        // 不指定云函数名称，更新配置文件中所有函数的配置
        if (!name) {
            const { isBatch } = await inquirer.prompt({
                type: 'confirm',
                name: 'isBatch',
                message: '无云函数名称，是否需要更新配置文件中的【全部云函数】的配置？',
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

        const functionItem = functions.find((item) => item.name === name)

        if (!functionItem) {
            throw new CloudBaseError('未找到相关函数配置，请检查函数名是否正确')
        }

        await updateFunctionConfig({
            envId,
            functionName: name,
            config: functionItem
        })

        log.success(`[${name}] 更新云函数配置成功！`)
    }
}
