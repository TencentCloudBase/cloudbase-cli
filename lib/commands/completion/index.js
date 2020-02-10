"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
const tab_1 = require("./tab");
const commands = [
    {
        cmd: 'completion:setup',
        options: [],
        desc: '启动自动补全命令',
        handler: tab_1.installCompletion,
        requiredEnvId: false
    },
    {
        cmd: 'completion:clean',
        options: [],
        desc: '清楚自动补全命令',
        handler: tab_1.unInstallCompletion,
        requiredEnvId: false
    }
];
commands.forEach(item => {
    const command = new command_1.Command(item);
    command.init();
});
