"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
const storage_1 = require("./storage");
const commands = [
    {
        cmd: 'storage:upload <localPath> [cloudPath]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '上传文件/文件夹',
        handler: storage_1.upload
    },
    {
        cmd: 'storage:download <cloudPath> <localPath>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '-d, --dir',
                desc: '下载目标是否为文件夹'
            }
        ],
        desc: '下载文件/文件夹，文件夹需指定 --dir 选项',
        handler: storage_1.download
    },
    {
        cmd: 'storage:delete <cloudPath>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '-d, --dir',
                desc: '下载目标是否为文件夹'
            }
        ],
        desc: '删除文件/文件夹，文件夹需指定 --dir 选项',
        handler: storage_1.deleteFile
    },
    {
        cmd: 'storage:list [cloudPath]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '获取文件存储的文件列表，不指定路径时获取全部文件列表',
        handler: storage_1.list
    },
    {
        cmd: 'storage:url <cloudPath>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '获取文件临时访问地址',
        handler: storage_1.getUrl
    },
    {
        cmd: 'storage:detail <cloudPath>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '获取文件信息',
        handler: storage_1.detail
    },
    {
        cmd: 'storage:get-acl',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '获取文件存储权限信息',
        handler: storage_1.getAcl
    },
    {
        cmd: 'storage:set-acl',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '设置文件存储权限信息',
        handler: storage_1.setAcl
    }
];
commands.forEach(item => {
    const command = new command_1.Command(item);
    command.init();
});
