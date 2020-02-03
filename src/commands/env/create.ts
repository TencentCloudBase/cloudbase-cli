import inquirer from 'inquirer'
import { createEnv, getEnvLimit } from '../../env'
import { loadingFactory, genClickableLink } from '../../utils'
import { CloudBaseError } from '../../error'

export async function create(ctx, alias: string) {
    if (!alias) {
        throw new CloudBaseError('环境名称不能为空！')
    }

    const loading = loadingFactory()

    // 检查环境限制数量
    loading.start('检查中...')
    const { CurrentFreeEnvNum, MaxFreeEnvNum, CurrentEnvNum, MaxEnvNum } = await getEnvLimit()
    loading.stop()

    if (+CurrentFreeEnvNum >= +MaxFreeEnvNum) {
        const link = genClickableLink('https://console.cloud.tencent.com/tcb')
        throw new CloudBaseError(
            `免费环境数量已达上限，无法创建免费的环境，请到云开发-控制台中创建付费环境\n👉 ${link}`
        )
    }

    if (+CurrentEnvNum >= +MaxEnvNum) {
        throw new CloudBaseError('环境数量已达上限，无法创建新的环境！')
    }

    const { payment } = await inquirer.prompt({
        type: 'list',
        name: 'payment',
        choices: [
            {
                name: '按量计费（免费配额）',
                value: 'postpay'
            },
            {
                name: '包年包月（免费版本）',
                value: 'prepay'
            }
        ],
        message: '请选择环境计费模式：',
        default: 'postpay'
    })

    loading.start('环境创建中...')
    try {
        const res = await createEnv({
            alias,
            paymentMode: payment
        })
    } catch (e) {
        if (e.code === 'ResourceInsufficient') {
            throw new CloudBaseError('环境数量已达上限，无法创建新的环境！')
        }
        throw e
    }

    loading.succeed('创建环境成功，初始化预计需要花费 3 分钟')
    console.log('你可以使用 cloudbase init 创建云开发项目')
}
