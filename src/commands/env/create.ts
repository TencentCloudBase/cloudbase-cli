import inquirer from 'inquirer'
import { createEnv, getEnvLimit } from '../../env'
import { loadingFactory, genClickableLink } from '../../utils'
import { CloudBaseError } from '../../error'
import { Command, ICommand } from '../common'
import { InjectParams, ArgsParams } from '../../decorators'

@ICommand()
export class CreateCommand extends Command {
    get options() {
        return {
            cmd: 'env:create <alias>',
            options: [],
            desc: '创建云开发免费环境',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@ArgsParams() params) {
        const alias = params?.[0]
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

        // 通过控制台授权登陆的用户无订单支付权限
        const { confirm } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message:
                '因支付权限问题，仅支持通过 API 秘钥登陆的主账户使用 CLI 创建包年包月免费环境，其他用户需要登陆控制台支付相关订单才能完成环境创建，是否继续？',
            default: false
        })

        if (!confirm) {
            throw new CloudBaseError('创建环境流程终止')
        }

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
}
