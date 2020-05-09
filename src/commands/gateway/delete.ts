import { prompt } from 'enquirer'
import { Command, ICommand } from '../common'
import { loadingFactory } from '../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../decorators'
import { deleteGateway, queryGateway } from '../../gateway'

@ICommand()
export class DeleteServiceCommand extends Command {
    get options() {
        return {
            cmd: 'service:delete',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-p, --service-path <servicePath>',
                    desc: 'Service Path，删除此 Path 对应的 HTTP Service'
                },
                {
                    flags: '-i, --service-id <serviceId>',
                    desc: 'Service Id，删除此 Id 对应的 HTTP Service'
                },
                {
                    flags: '-n, --name <name>',
                    desc: '云函数函数名称，删除此函数绑定的所有 HTTP Service'
                }
            ],
            desc: '删除 HTTP Service'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {
        let { servicePath, serviceId, name } = options

        // 当没有指定要删除的服务时，获取所有服务列表，并提示
        if (!servicePath && !serviceId && (!name || typeof name !== 'string')) {
            const { APISet: allServices } = await queryGateway({
                envId
            })

            const { selected } = await prompt({
                type: 'select',
                name: 'selected',
                message: '请选择需要删除的 Service',
                choices: allServices.map((item) => ({
                    name: `函数名：${item.Name}/路径：${item.Path}`,
                    value: item.APIId
                })),
                result(choices) {
                    return Object.values(this.map(choices)) as any
                }
            })
            serviceId = selected?.[0]
        }

        const loading = loadingFactory()
        loading.start('HTTP Service 删除中...')

        try {
            await deleteGateway({
                envId,
                name,
                path: servicePath,
                gatewayId: serviceId
            })
            loading.succeed('HTTP Service 删除成功！')
        } catch (e) {
            loading.stop()
            throw e
        }
    }
}
