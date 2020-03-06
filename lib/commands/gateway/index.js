"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_1 = require("./create");
const delete_1 = require("./delete");
const list_1 = require("./list");
const domain_1 = require("./domain");
const command_1 = require("../command");
const switch_1 = require("./switch");
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
        handler: switch_1.serviceSwitch
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
        handler: switch_1.serviceAuthSwitch
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
        handler: create_1.createService
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
        handler: delete_1.deleteService
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
        handler: list_1.listService
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
        handler: domain_1.bindCustomDomain
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
        handler: domain_1.unbindCustomDomain
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
        handler: domain_1.getCustomDomain
    }
];
commands.forEach(item => {
    const command = new command_1.Command(item);
    command.init();
});
