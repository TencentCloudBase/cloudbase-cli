"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
const tab_1 = require("./tab");
const commands = [
    {
        cmd: 'completion:install',
        options: [],
        desc: '安装自动补全',
        handler: tab_1.installCompletion,
        requiredEnvId: false
    },
    {
        cmd: 'completion:uninstall',
        options: [],
        desc: '登出腾讯云账号',
        handler: tab_1.unInstallCompletion,
        requiredEnvId: false
    }
];
commands.forEach(item => {
    const command = new command_1.Command(item);
    command.init();
});
