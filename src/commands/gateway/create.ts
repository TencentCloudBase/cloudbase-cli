import { prompt } from 'enquirer'
import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { createGateway, queryGatewayDomain } from '../../gateway'
import { listFunction } from '../../function'
import { assertTruthy } from '../../utils/validator'
import { loadingFactory, genClickableLink } from '../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../decorators'

@ICommand()
export class CreateService extends Command {
    get options() {
        return {
            cmd: 'service',
            childCmd: 'create',
            deprecateCmd: 'service:create',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-p, --service-path <servicePath>',
                    desc: 'HTTP 访问服务路径，如 api'
                },
                {
                    flags: '-f, --function <name>',
                    desc: 'HTTP 访问服务路径绑定的云函数名称'
                }
            ],
            desc: '创建 HTTP 访问服务'
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

            let { name } = await prompt<any>({
                type: 'select',
                name: 'name',
                message: '请选择创建HTTP 访问服务的云函数',
                choices: functions.map((item) => item.FunctionName)
            })

            let { path } = await prompt<any>({
                type: 'input',
                name: 'path',
                message: '请输入HTTP 访问服务路径'
            })

            functionName = name
            servicePath = path
        }

        assertTruthy(servicePath, '请指定需要创建的HTTP 访问服务路径！')

        // 创建云函数网关
        loading.start(`[${functionName}] HTTP 访问服务创建中...`)

        // 补充 / 符号
        servicePath = servicePath[0] === '/' ? servicePath : `/${servicePath}`

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

            // 查询访问域名
            const res = await queryGatewayDomain({ envId })
            const link = genClickableLink(`https://${res.DefaultDomain}${servicePath}`)
            loading.succeed(`HTTP 访问服务创建成功！\n点击访问> ${link}`)
        } catch (e) {
            loading.stop()
            if (e.code === 'InvalidParameter.APICreated') {
                throw new CloudBaseError('路径已存在！')
            }
            throw e
        }
    }
}
