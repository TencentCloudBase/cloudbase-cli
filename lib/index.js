"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const login_1 = require("./login");
function commandRegister() {
    program
        .command('login')
        .option('-k, --key', '使用永久密钥登录（不建议！）')
        .description('登录腾讯云账号')
        .action(async function (options) {
        // 兼容临时密钥和永久密钥登录
        if (options.key) {
            // 使用永久密钥登录
            await login_1.login();
        }
        else {
            // 使用临时密钥登录-支持自动续期
            await login_1.authLogin();
        }
    });
    program
        .command('logout')
        .description('登出腾讯云账号')
        .action(login_1.logout);
}
exports.commandRegister = commandRegister;
