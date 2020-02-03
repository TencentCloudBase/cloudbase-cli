"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hosting_1 = require("./hosting");
const command_1 = require("../command");
const commands = [
    {
        cmd: 'hosting:detail',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '查看静态网站服务信息',
        handler: hosting_1.detail
    },
    {
        cmd: 'hosting:deploy [filePath] [cloudPath]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '部署静态网站文件',
        handler: hosting_1.deploy
    },
    {
        cmd: 'hosting:delete [cloudPath]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '-d, --dir',
                desc: '删除目标是否为文件夹'
            }
        ],
        desc: '删除静态网站文件/文件夹，文件夹需指定 --dir 选项',
        handler: hosting_1.deleteFiles
    },
    {
        cmd: 'hosting:list',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '展示文件列表',
        handler: hosting_1.list
    },
];
commands.forEach(item => {
    const command = new command_1.Command(item);
    command.init();
});
