"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
const base_1 = require("./base");
const create_1 = require("./create");
const domain_1 = require("./domain");
const login_1 = require("./login");
const commands = [
    {
        cmd: 'env:list',
        options: [],
        desc: '展示云开发环境信息',
        handler: base_1.list,
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
        handler: base_1.rename,
        requiredEnvId: false
    },
    {
        cmd: 'env:create <alias>',
        options: [],
        desc: '创建云开发免费环境',
        handler: create_1.create,
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
        handler: domain_1.listAuthDoamin
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
        handler: domain_1.createAuthDomain
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
        handler: domain_1.deleteAuthDomain
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
        handler: login_1.listLogin
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
        handler: login_1.createLogin
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
        handler: login_1.updateLogin
    }
];
commands.forEach(item => {
    const command = new command_1.Command(item);
    command.init();
});
