import * as program from 'commander'
import { login, authLogin, logout } from './login'

export function commandRegister() {
    program
        .command('login')
        .option('-a, --auth', '通过腾讯云控制台授权登录')
        .description('登录腾讯云账号')
        .action(async function(options) {
            // 兼容临时密钥和永久密钥登录
            if (options.auth) {
                // 使用临时密钥登录-支持自动续期
                await authLogin()
            } else {
                // 使用永久密钥登录
                await login()
            }
        })
    program
        .command('logout')
        .description('登出腾讯云账号')
        .action(logout)
}
