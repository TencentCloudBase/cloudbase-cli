import program from 'commander'
import inquirer from 'inquirer'
import { printHorizontalTable, getEnvId } from '../../utils'
import { successLog, errorLog } from '../../logger'
import { getLoginConfigList, updateLoginConfig, createLoginConfig } from '../../env'
import { CloudBaseError } from '../../error'

const platformMap = {
    'WECHAT-OPEN': '微信开放平台',
    'WECHAT-PUBLIC': '微信公众平台',
    ANONYMOUS: '匿名登录'
}

program
    .command('env:login:list')
    .option('-e, --envId <envId>', '环境 Id')
    .description('列出环境登录配置')
    .action(async function(options?: any) {
        const assignEnvId = await getEnvId(options)

        const configList = await getLoginConfigList({
            envId: assignEnvId
        })

        const head = ['平台', '平台 Id', '创建时间', '状态']
        const tableData = configList.map(item => [
            platformMap[item.Platform] ? platformMap[item.Platform] : item.Platform,
            item.PlatformId,
            item.CreateTime,
            item.Status === 'ENABLE' ? '启用' : '禁用'
        ])
        printHorizontalTable(head, tableData)
    })

program
    .command('env:login:create')
    .option('-e, --envId <envId>', '环境 Id')
    .description('添加环境登录方式配置')
    .action(async function(options?: any) {
        const assignEnvId = await getEnvId(options)

        const { platform } = await inquirer.prompt([
            {
                type: 'list',
                name: 'platform',
                choices: [
                    {
                        name: '微信公众平台',
                        value: 'WECHAT-PUBLIC'
                    },
                    {
                        name: '微信开放平台',
                        value: 'WECHAT-OPEN'
                    },
                    {
                        name: '匿名登录',
                        value: 'ANONYMOUS'
                    }
                ],
                message: '请选择登录方式：',
                default: 'WECHAT-PUBLIC'
            }
        ])

        let appId
        let appSecret

        // 微信登录，需要配置 AppId 和 AppSecret
        if (platform === 'WECHAT-OPEN' || platform === 'WECHAT-PUBLIC') {
            const input = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'appId',
                    message: '请输入 AppId：'
                },
                {
                    type: 'input',
                    name: 'appSecret',
                    message: '请输入 AppSecret：'
                }
            ])

            appId = input?.appId
            appSecret = input?.appSecret

            if (!appId || !appSecret) {
                throw new CloudBaseError('appId 和 appSecret 不能为空！')
            }
        }

        // 匿名登录
        if (platform === 'ANONYMOUS') {
            appId = 'anonymous'
            appSecret = 'anonymous'
        }

        try {
            await createLoginConfig({
                envId: assignEnvId,
                appId,
                appSecret,
                platform
            })

            successLog('创建登录方式成功！')
        } catch (e) {
            if (e.code === 'ResourceInUse') {
                errorLog('登录方式已开启')
            }
        }
    })

program
    .command('env:login:update')
    .option('-e, --envId <envId>', '环境 Id')
    .description('更新环境登录方式配置')
    .action(async function(options?: any) {
        const assignEnvId = await getEnvId(options)

        const configList = await getLoginConfigList({
            envId: assignEnvId
        })

        const configChoices = configList.map(item => ({
            name: `${platformMap[item.Platform]}：${item.PlatformId} [${
                item.Status === 'ENABLE' ? '启用' : '禁用'
            }]`,
            value: item,
            short: `${platformMap[item.Platform]}：${item.PlatformId}`
        }))

        const { config, status } = await inquirer.prompt([
            {
                type: 'list',
                name: 'config',
                choices: configChoices,
                message: '请选择需要配置的条目：'
            },
            {
                type: 'list',
                name: 'status',
                choices: [
                    {
                        name: '启用',
                        value: 'ENABLE'
                    },
                    {
                        name: '禁用',
                        value: 'DISABLE'
                    }
                ],
                message: '请选择登录方式状态：',
                default: '启用'
            }
        ])

        const platform = config.Platform

        let appId
        let appSecret

        if (platform === 'WECHAT-OPEN' || platform === 'WECHAT-PUBLIC') {
            const input = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'appId',
                    message: '请输入 AppId（配置状态时可不填）：'
                },
                {
                    type: 'input',
                    name: 'appSecret',
                    message: '请输入 AppSecret（配置状态时可不填）：'
                }
            ])

            appId = input?.appId
            appSecret = input?.appSecret
        }

        // 检查平台配置是否存在，若存在则更新配置，否则创建配置
        await updateLoginConfig({
            envId: assignEnvId,
            configId: config.Id,
            appId,
            appSecret,
            status
        })

        successLog('更新登录方式成功！')
    })
