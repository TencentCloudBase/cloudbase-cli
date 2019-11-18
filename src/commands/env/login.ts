import program from 'commander'
import inquirer from 'inquirer'
import { printHorizontalTable, getEnvId } from '../../utils'
import { successLog } from '../../logger'
import {
    getLoginConfigList,
    updateLoginConfig,
    createLoginConfig
} from '../../env'
import { CloudBaseError } from '../../error'

const platformMap = {
    'WECHAT-OPEN': '微信开放平台',
    'WECHAT-PUBLIC': '微信公众平台'
}

program
    .command('env:login:list [envId]')
    .description('列出环境登录配置')
    .action(async function(envId?: string, options?: any) {
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)

        const configList = await getLoginConfigList({
            envId: assignEnvId
        })

        const head = ['平台', '平台 Id', '创建时间', '状态']
        const tableData = configList.map(item => [
            platformMap[item.Platform]
                ? platformMap[item.Platform]
                : item.Platform,
            item.PlatformId,
            item.CreateTime,
            item.Status === 'ENABLE' ? '启用' : '禁用'
        ])
        printHorizontalTable(head, tableData)
    })

program
    .command('env:login:create [envId]')
    .description('创建环境登录配置')
    .action(async function(envId?: string, options?: any) {
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)

        const { platform, status, appId, appSecret } = await inquirer.prompt([
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
                    }
                ],
                message: '请选择登录方式：',
                default: 'WECHAT-PUBLIC'
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
                default: 'ENABLE'
            },
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

        if (!appId || !appSecret) {
            throw new CloudBaseError('appId 和 appSecret 不能为空！')
        }

        await createLoginConfig({
            envId: assignEnvId,
            appId,
            appSecret,
            platform,
            status
        })

        successLog('创建登录方式成功！')
    })

program
    .command('env:login:update [envId]')
    .description('更新环境登录方式配置')
    .action(async function(envId?: string, options?: any) {
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)

        const configList = await getLoginConfigList({
            envId: assignEnvId
        })

        const configChoices = configList.map(item => ({
            name: `${platformMap[item.Platform]}：${item.PlatformId} [${
                item.Status === 'ENABLE' ? '启用' : '禁用'
            }]`,
            value: item.Id,
            short: `${platformMap[item.Platform]}：${item.PlatformId}`
        }))

        const { configId, status, appId, appSecret } = await inquirer.prompt([
            {
                type: 'list',
                name: 'configId',
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
            },
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

        // 检查平台配置是否存在，若存在则更新配置，否则创建配置
        await updateLoginConfig({
            envId: assignEnvId,
            configId,
            appId,
            appSecret,
            status
        })

        successLog('更新登录方式成功！')
    })
