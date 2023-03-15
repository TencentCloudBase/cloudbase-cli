import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { loadingFactory, printHorizontalTable, formatDate } from '../../utils'
import { InjectParams, EnvId, ArgsParams, ArgsOptions, Log, Logger } from '../../decorators'
import { bindGatewayDomain, queryGatewayDomain, unbindGatewayDomain } from '../../gateway'

const SERVICE_STATUS_MAP = {
    1: '部署中',
    2: '部署失败',
    3: '部署成功',
    4: '删除中',
    5: '删除失败'
}

// 暂时无法支持
export class BindCustomDomainCommand extends Command {
    get options() {
        return {
            cmd: 'service',
            childCmd: { cmd: 'domain', desc: 'HTTP 访问服务域名管理' },
            childSubCmd: 'bind <domain>',
            deprecateCmd: 'service:domain:bind <domain>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '绑定自定义HTTP 访问服务域名'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsParams() params) {
        const domain = params?.[0]

        console.log(domain)

        if (!domain) {
            throw new CloudBaseError('请指定需要绑定的HTTP 访问服务域名！')
        }

        const loading = loadingFactory()
        loading.start(`HTTP 访问服务域名 [${domain}] 绑定中...`)

        try {
            await bindGatewayDomain({
                envId,
                domain
            })
            loading.succeed(`HTTP 访问服务域名[${domain}] 绑定成功！`)
        } catch (e) {
            loading.stop()
            throw e
        }
    }
}

@ICommand()
export class GetCustomDomainsCommand extends Command {
    get options() {
        return {
            cmd: 'service',
            childCmd: 'domain',
            childSubCmd: 'list',
            deprecateCmd: 'service:domain:list',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-d, --domain <domain>',
                    desc: '域名'
                }
            ],
            desc: '查询 HTTP 访问服务自定义域名'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options, @Log() log: Logger) {
        const { domain: domainName } = options

        if (!envId && !domainName) {
            throw new CloudBaseError('请指定需要查询的环境 ID 或HTTP 访问服务域名！')
        }

        const loading = loadingFactory()
        loading.start('查询HTTP 访问服务域名中...')

        try {
            const res = await queryGatewayDomain({
                envId,
                domain: domainName
            })

            loading.succeed('查询HTTP 访问服务域名成功！')

            if (!res?.ServiceSet?.length) {
                log.info('HTTP 访问服务域名为空！')
                return
            }

            const head = ['域名', '状态', '创建时间']
            const tableData = res.ServiceSet.map((item) => [
                item.Domain,
                SERVICE_STATUS_MAP[item.Status],
                formatDate(item.OpenTime * 1000, 'yyyy-MM-dd hh:mm:ss')
            ])
            printHorizontalTable(head, tableData)
        } catch (e) {
            loading.stop()
            throw e
        }
    }
}

@ICommand()
export class UnbindCustomDomainCommand extends Command {
    get options() {
        return {
            cmd: 'service',
            childCmd: 'domain',
            childSubCmd: 'unbind <domain>',
            deprecateCmd: 'service:domain:unbind <domain>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '解绑自定义HTTP 访问服务域名'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsParams() params) {
        const domain = params?.[0]

        if (!domain) {
            throw new CloudBaseError('请指定需要解绑的HTTP 访问服务域名！')
        }

        const loading = loadingFactory()
        loading.start(`HTTP Service域名 [${domain}] 解绑中...`)

        try {
            await unbindGatewayDomain({
                envId,
                domain
            })
            loading.succeed(`HTTP Service域名 [${domain}] 解绑成功！`)
        } catch (e) {
            loading.stop()
            throw e
        }
    }
}
