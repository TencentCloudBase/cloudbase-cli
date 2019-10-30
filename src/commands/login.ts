import program from 'commander'
import inquirer from 'inquirer'
import { login } from '../auth'
import { listEnvs, initTcb } from '../env'
import { CloudBaseError } from '../error'
import { checkAndGetCredential, loadingFactory } from '../utils'
import { warnLog } from '../logger'

// 登录
program
    .command('login')
    .option('-k, --key', '使用永久密钥登录')
    .option('--skey', '使用永久密钥 + skey 登录')
    .description('登录腾讯云账号')
    .action(async function(options) {
        const loading = loadingFactory()
        loading.start('检验登录状态')
        const hasLogin = await checkAndGetCredential()
        if (hasLogin) {
            loading.succeed('您已登录，无需再次登录！')
            return
        } else {
            loading.stop()
        }
        // 兼容临时密钥和永久密钥登录
        let skey
        if (options.key || options.skey) {
            // 使用永久密钥登录
            const { secretId } = await inquirer.prompt({
                type: 'input',
                name: 'secretId',
                message: '请输入腾讯云 SecretID：'
            })

            const { secretKey } = await inquirer.prompt({
                type: 'input',
                name: 'secretKey',
                message: '请输入腾讯云 SecretKey：'
            })

            if (options.skey) {
                const { skey: _skey } = await inquirer.prompt({
                    type: 'input',
                    name: 'skey',
                    message: '请输入腾讯云 skey（选填）：'
                })
                skey = _skey
            }

            if (!secretId || !secretKey) {
                throw new CloudBaseError('SecretID 或 SecretKey 不能为空')
            }

            loading.start('正在验证腾讯云密钥...')

            const res = await login({
                key: true,
                secretId,
                secretKey
            })

            if (res.code === 'SUCCESS') {
                loading.succeed('登录成功！')
            } else {
                loading.fail(
                    '腾讯云密钥验证失败，请检查密钥是否正确或终端网络是否可用！'
                )
                return
            }
        } else {
            // 使用临时密钥登录-支持自动续期
            loading.start('获取授权中...')
            const res = await login()

            if (res.code === 'SUCCESS') {
                loading.succeed('登录成功！')
            } else {
                loading.fail(res.msg)
                return
            }
            return
        }

        // 检测用户是否存在，不存在则初始化
        try {
            const envs = await listEnvs()
            if (!envs.length) {
                warnLog(
                    '你还没有可用的环境，请使用 cloudbase env:create alias 创建环境'
                )
            }
        } catch (e) {
            // 用户不存在
            if (e.code === 'ResourceNotFound.UserNotExists') {
                loading.start('初始化云开发服务')
                await initTcb(skey)
                loading.succeed('初始化成功！')
            } else {
                throw e
            }
        }
    })
