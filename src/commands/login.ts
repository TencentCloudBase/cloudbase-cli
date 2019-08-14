import program from 'commander'
import { login, authLogin } from '../auth'
import { listEnvs, initTcb } from '../env'

// 登录
program
    .command('login')
    .option('-k, --key', '使用永久密钥登录（不建议！）')
    .description('登录腾讯云账号')
    .action(async function(options) {
        // 兼容临时密钥和永久密钥登录
        let skey
        if (options.key) {
            // 使用永久密钥登录
            skey = await login()
        } else {
            // 使用临时密钥登录-支持自动续期
            await authLogin()
        }

        // 检测用户是否存在，不存在则初始化
        try {
            const envs = await listEnvs()
            if (!envs.length) {
                console.log(
                    '你还没有可用的环境，请使用 tcb env:create alias 创建环境'
                )
            }
        } catch (e) {
            // 用户不存在
            if (e.code === 'ResourceNotFound.UserNotExists') {
                console.log('初始化 TCB 服务')
                await initTcb(skey)
                console.log('初始化成功')
            } else {
                throw e
            }
        }
    })
