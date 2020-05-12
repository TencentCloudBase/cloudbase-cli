import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { queryGateway } from '../../gateway'

import { InjectParams, EnvId, ArgsOptions, Log, Logger } from '../../decorators'
import { printHorizontalTable, loadingFactory, formatDate } from '../../utils'

@ICommand()
export class ListServiceCommand extends Command {
    get options() {
        return {
            cmd: 'service:list',
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
            desc: '获取 HTTP Service 列表'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options, @Log() log: Logger) {
        const { domain: domainName, servicePath, serviceId } = options

        if (!envId && !domainName) {
            throw new CloudBaseError('请指定需要查询的环境 ID 或 HTTP Service 自定义域名！')
        }

        const loading = loadingFactory()
        loading.start('查询 HTTP Service 中...')

        try {
            const res = await queryGateway({
                envId,
                domain: domainName,
                path: servicePath,
                gatewayId: serviceId
            })

            loading.stop()

            if (res?.APISet?.length === 0) {
                log.info('HTTP Service 为空')
                return
            }

            const head = ['Id', '路径', '函数名称', '创建时间']
            const tableData = res.APISet.map((item) => [
                item.APIId,
                item.Path,
                item.Name,
                formatDate(item.CreateTime * 1000, 'yyyy-MM-dd hh:mm:ss')
            ])
            printHorizontalTable(head, tableData)
        } catch (e) {
            loading.stop()
            throw e
        }
    }
}
