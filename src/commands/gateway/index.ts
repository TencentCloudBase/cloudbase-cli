import { createService } from './create'
import { deleteService } from './delete'
import { listService } from './list'
import { bindCustomDomain, unbindCustomDomain, getCustomDomains } from './domain'
import { Command } from '../command'
import { serviceSwitch, serviceAuthSwitch } from './switch'

const commands = [
    {
        cmd: 'service:switch',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '开启/关闭 HTTP Service 服务',
        handler: serviceSwitch
    },
    {
        cmd: 'service:auth:switch',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '开启/关闭 HTTP Service 服务访问鉴权',
        handler: serviceAuthSwitch
    },
    {
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
        desc: '创建 HTTP Service',
        handler: createService
    },
    {
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
        desc: '删除 HTTP Service',
        handler: deleteService
    },
    {
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
        desc: '获取 HTTP Service 列表',
        handler: listService
    },
    {
        cmd: 'service:domain:bind <domain>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '绑定自定义 HTTP Service 域名',
        handler: bindCustomDomain
    },
    {
        cmd: 'service:domain:unbind <domain>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '解绑自定义 HTTP Service 域名',
        handler: unbindCustomDomain
    },
    {
        cmd: 'service:domain:list',
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
        desc: '查询自定义 HTTP Service 域名',
        handler: getCustomDomains
    }
]

// 注册命令
commands.forEach(item => {
    const command = new Command(item)
    command.init()
})
