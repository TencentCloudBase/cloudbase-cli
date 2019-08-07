"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const auth_1 = require("../auth");
commander_1.default
    .command('login')
    .option('-k, --key', '使用永久密钥登录（不建议！）')
    .description('登录腾讯云账号')
    .action(async function (options) {
    if (options.key) {
        await auth_1.login();
    }
    else {
        await auth_1.authLogin();
    }
});
