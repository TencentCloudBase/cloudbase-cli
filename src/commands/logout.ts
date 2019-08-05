import * as program from 'commander'
import { logout } from '../auth'

// 登出
program
    .command('logout')
    .description('登出腾讯云账号')
    .action(logout)
