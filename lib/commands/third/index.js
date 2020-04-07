"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
const thirdAttach_1 = require("./thirdAttach");
const commands = [
    {
        cmd: 'third:deleteThirdAttach',
        options: [
            {
                flags: '--source <source>',
                desc: '第三方来源'
            },
            {
                flags: '--thirdAppId <thirdAppId>',
                desc: '第三方appId'
            }
        ],
        desc: '解除第三方绑定',
        handler: thirdAttach_1.deleteThirdAttach,
        requiredEnvId: false
    }
];
commands.forEach(item => {
    const command = new command_1.Command(item);
    command.init();
});
