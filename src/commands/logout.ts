import program from 'commander'
import { logout } from '../auth'
import { successLog } from '../logger'

// 登出
program
    .command('logout')
    .description('登出腾讯云账号')
    .action(async () => {
        await logout()
        successLog('注销登录成功！')
    })
