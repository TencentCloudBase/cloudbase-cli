import { prompt } from 'enquirer'
import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { createGateway } from '../../gateway'
import { listFunction } from '../../function'
import { assertTruthy } from '../../utils/validator'
import { loadingFactory, genClickableLink } from '../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../decorators'

@ICommand()
export class CreateService extends Command {
    get options() {
        return {
            cmd: 'service:create',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-p, --service-path <servicePath>',
                    desc: 'Service Path，必须以 "/" 开头'
                },
                {
                    flags: '-f, --function <name>',
                    desc: 'HTTP Service 路径绑定的云函数名称'
                }
            ],
            desc: '创建 HTTP Service'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {
        let { function: functionName, servicePath } = options
        const loading = loadingFactory()

        if (!servicePath || !functionName) {
            loading.start('数据加载中...')
            const functions = await listFunction({
                envId,
                limit: 100,
                offset: 0
            })

            loading.stop()

            if (!functions.length) {
                throw new CloudBaseError('当前环境下不存在可用的云函数，请先创建云函数！')
            }

            let { name } = await prompt({
                type: 'select',
                name: 'name',
                message: '请选择创建 HTTP Service 的云函数',
                choices: functions.map((item) => item.FunctionName)
            })

            let { path } = await prompt({
                type: 'input',
                name: 'path',
                message: '请输入 HTTP Service 路径（以 / 开头）'
            })

            functionName = name
            servicePath = path
        }

        assertTruthy(servicePath, '请指定需要创建的 HTTP Service 路径！')

        // 创建云函数网关
        loading.start(`[${functionName}] 云函数 HTTP Service 创建中...`)

        try {
            // step1: 判断云函数是否存在
            const functionList = await listFunction({
                envId,
                limit: 100
            })
            const isExisted = functionList.filter((item) => item.FunctionName === functionName)
            if (isExisted.length <= 0) {
                throw new CloudBaseError(`[${functionName}] 云函数不存在！`)
            }

            // step2: 创建云函数网关
            await createGateway({
                envId,
                path: servicePath,
                name: functionName
            })
            const link = genClickableLink(`https://${envId}.service.tcloudbase.com${servicePath}`)
            loading.succeed(`云函数 HTTP Service 创建成功！\n点击访问> ${link}`)
        } catch (e) {
            loading.stop()
            if (e.code === 'InvalidParameter.APICreated') {
                throw new CloudBaseError('路径已存在！')
            }
            throw e
        }
    }
}
