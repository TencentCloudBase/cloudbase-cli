import _ from 'lodash'
import chalk from 'chalk'
import inquirer from 'inquirer'

import { ICommandContext } from '../command'

import { login } from '../../auth'
import { listEnvs } from '../../env'
import { CloudBaseError } from '../../error'
import { warnLog, errorLog } from '../../logger'
import {
    checkAndGetCredential,
    loadingFactory,
    usageStore,
    collectAgree,
    genClickableLink
} from '../../utils'

function printSuggestion() {
    const tips = `可使用下面命令继续操作：

${chalk.gray('–')} 创建免费环境

  ${chalk.cyan('$ cloudbase env:create envName')}

${chalk.gray('–')} 初始化云开发项目

  ${chalk.cyan('$ cloudbase init')}

${chalk.gray('–')} 部署云函数

  ${chalk.cyan('$ cloudbase functions:deploy')}

${chalk.gray('–')} 查看命令使用介绍

  ${chalk.cyan('$ cloudbase -h')}

Tips：可以使用简写命令 tcb 代替 cloudbase`
    console.log(tips)
}

async function askForCollectDataConfirm() {
    const agree = await usageStore.get('agreeCollect')
    if (agree) return
    const { confirm } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirm',
        message: '是否同意 Cloudbase CLI 收集您的使用数据以改进产品？',
        default: true
    })

    if (confirm) {
        await usageStore.set('agreeCollect', true)
    }

    await collectAgree(confirm)
}

// 登录
export async function accountLogin(ctx: ICommandContext) {
    const { options } = ctx
    const { apiKeyId, apiKey } = options
    const loading = loadingFactory()
    loading.start('检验登录状态')

    const credential = await checkAndGetCredential()

    if (!_.isEmpty(credential)) {
        loading.succeed('您已登录，无需再次登录！')
        return
    } else {
        loading.stop()
    }

    // 通过参数传入 API Key
    if (apiKey && apiKeyId) {
        loading.start('正在验证腾讯云密钥...')

        const res = await login({
            key: true,
            secretKey: apiKey,
            secretId: apiKeyId
        })

        if (res.code === 'SUCCESS') {
            loading.succeed('登录成功！')
            await askForCollectDataConfirm()
            printSuggestion()
        } else {
            loading.fail('腾讯云密钥验证失败，请检查密钥是否正确或终端网络是否可用！')
            return
        }
    }

    // 兼容临时密钥和永久密钥登录
    if (ctx.options.key) {
        const clickableLink = genClickableLink('https://console.cloud.tencent.com/cam/capi')
        console.log(`您可以访问 ${clickableLink} 获取 API 秘钥`)

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
            await askForCollectDataConfirm()
            printSuggestion()
        } else {
            loading.fail('腾讯云密钥验证失败，请检查密钥是否正确或终端网络是否可用！')
            return
        }
    } else {
        // 使用临时密钥登录-支持自动续期
        loading.start('获取授权中...')
        const res = await login()

        if (res.code === 'SUCCESS') {
            loading.succeed('登录成功！')
            await askForCollectDataConfirm()
            printSuggestion()
        } else {
            loading.fail(res.msg)
            console.log('请检查你的网络，尝试重新运行 cloudbase login 命令！')
            return
        }
    }

    // 检测用户是否存在，不存在则初始化
    try {
        const envs = await listEnvs()
        if (!envs.length) {
            warnLog('您还没有可用的环境，请使用 cloudbase env:create $name 创建环境')
        }
    } catch (e) {
        // 用户不存在
        // 主账户可以直接使用 env:create 完成初始化工作
        if (e.code === 'ResourceNotFound.UserNotExists') {
            errorLog('您还没有可用的环境，请使用 cloudbase env:create $name 创建环境！')
        } else {
            throw e
        }
    }
}
