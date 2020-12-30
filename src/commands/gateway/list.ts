import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { queryGateway } from '../../gateway'

import { InjectParams, EnvId, ArgsOptions, Log, Logger } from '../../decorators'
import { printHorizontalTable, loadingFactory, formatDate } from '../../utils'

@ICommand()
export class ListServiceCommand extends Command {
    get options() {
        return {
            cmd: 'service',
            childCmd: 'list',
            deprecateCmd: 'service:list',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-d, --domain <domain>',
                    desc: '自定义域名'
                },
                {
                    flags: '-p, --service-path <servicePath>',
                    desc: 'Service Path'
                },
                {
                    flags: '-id, --service-id <serviceId>',
                    desc: 'Service Id'
                }
            ],
            desc: '获取 HTTP 访问服务列表'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options, @Log() log: Logger) {
        const { domain: domainName, servicePath, serviceId } = options

        if (!envId && !domainName) {
            throw new CloudBaseError('请指定需要查询的环境 ID 或HTTP 访问服务自定义域名！')
        }

        const loading = loadingFactory()
        loading.start('查询HTTP 访问服务中...')

        try {
            const res = await queryGateway({
                envId,
                domain: domainName,
                path: servicePath,
                gatewayId: serviceId
            })

            loading.stop()

            if (res?.APISet?.length === 0) {
                log.info('HTTP 访问服务为空')
                return
            }

            const head = ['触发路径', '关联资源', '触发类型', '创建时间']
            const tableData = res.APISet.map((item) => [
                item.Path,
                item.Name,
                item.Type === 1 ? '云函数' : '云托管',
                formatDate(item.CreateTime * 1000, 'yyyy-MM-dd hh:mm:ss')
            ])
            printHorizontalTable(head, tableData)
        } catch (e) {
            loading.stop()
            throw e
        }
    }
}
