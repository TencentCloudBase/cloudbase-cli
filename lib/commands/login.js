"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const auth_1 = require("../auth");
const env_1 = require("../env");
commander_1.default
    .command('login')
    .option('-k, --key', '使用永久密钥登录（不建议！）')
    .description('登录腾讯云账号')
    .action(async function (options) {
    let skey;
    if (options.key) {
        skey = await auth_1.login();
    }
    else {
        await auth_1.authLogin();
    }
    try {
        const envs = await env_1.listEnvs();
        if (!envs.length) {
            console.log('你还没有可用的环境，请使用 tcb env:create alias 创建环境');
        }
    }
    catch (e) {
        if (e.code === 'ResourceNotFound.UserNotExists') {
            console.log('初始化 TCB 服务');
            await env_1.initTcb(skey);
            console.log('初始化成功');
        }
        else {
            throw e;
        }
    }
});
