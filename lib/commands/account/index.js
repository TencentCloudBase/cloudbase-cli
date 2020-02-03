"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
const login_1 = require("./login");
const logout_1 = require("./logout");
const commands = [
    {
        cmd: 'login',
        options: [
            {
                flags: '-k, --key',
                desc: '使用永久密钥登录'
            }
        ],
        desc: '登录腾讯云账号',
        handler: login_1.accountLogin,
        requiredEnvId: false
    },
    {
        cmd: 'logout',
        options: [],
        desc: '登出腾讯云账号',
        handler: logout_1.accountLogout,
        requiredEnvId: false
    }
];
commands.forEach(item => {
    const command = new command_1.Command(item);
    command.init();
});
