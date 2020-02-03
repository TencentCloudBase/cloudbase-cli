import { Command } from '../command'
import { list, rename } from './base'
import { create } from './create'
import { listAuthDoamin, createAuthDomain, deleteAuthDomain } from './domain'
import { listLogin, createLogin, updateLogin } from './login'

const commands = [
    {
        cmd: 'env:list',
        options: [],
        desc: '展示云开发环境信息',
        handler: list,
        requiredEnvId: false
    },
    {
        cmd: 'env:rename <name>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '修改云开发环境别名',
        handler: rename,
        requiredEnvId: false
    },
    {
        cmd: 'env:create <alias>',
        options: [],
        desc: '创建云开发免费环境',
        handler: create,
        requiredEnvId: false
    },
    {
        cmd: 'env:domain:list',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '列出环境的安全域名列表',
        handler: listAuthDoamin
    },
    {
        cmd: 'env:domain:create <domain>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '添加环境安全域名，多个以斜杠 / 分隔',
        handler: createAuthDomain
    },
    {
        cmd: 'env:domain:delete',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '删除环境的安全域名',
        handler: deleteAuthDomain
    },
    {
        cmd: 'env:login:list',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '列出环境登录配置',
        handler: listLogin
    },
    {
        cmd: 'env:login:create',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '添加环境登录方式配置',
        handler: createLogin
    },
    {
        cmd: 'env:login:update',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '更新环境登录方式配置',
        handler: updateLogin
    }
]

// 注册命令
commands.forEach(item => {
    const command = new Command(item)
    command.init()
})
