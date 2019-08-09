import program from 'commander'
import { login, authLogin } from '../auth'

// 登录
program
    .command('login')
    .option('-k, --key', '使用永久密钥登录（不建议！）')
    .description('登录腾讯云账号')
    .action(async function(options) {
        // 兼容临时密钥和永久密钥登录
        if (options.key) {
            // 使用永久密钥登录
            await login()
        } else {
            // 使用临时密钥登录-支持自动续期
            await authLogin()
        }
    })