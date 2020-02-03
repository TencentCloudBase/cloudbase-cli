"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
const init_1 = require("./init");
const open_1 = require("./open");
const commands = [
    {
        cmd: 'init',
        options: [
            {
                flags: '--server',
                desc: '创建派主机 Node 项目'
            }
        ],
        desc: '创建并初始化一个新的云开发项目',
        handler: init_1.init,
        requiredEnvId: false
    },
    {
        cmd: 'open [link]',
        options: [],
        desc: '在浏览器中打开云开发相关连接',
        handler: open_1.openLink,
        requiredEnvId: false
    }
];
commands.forEach(item => {
    const command = new command_1.Command(item);
    command.init();
});
