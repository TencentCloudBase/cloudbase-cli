import program from 'commander'
import inquirer from 'inquirer'
import { printCliTable, getEnvId } from '../utils'
import { successLog } from '../logger'
import {
    getLoginConfigList,
    updateLoginConfig,
    createLoginConfig
} from '../env'

program
    .command('env:login:list [envId]')
    .description('列出环境登录配置')
    .action(async function(envId?: string) {
        const assignEnvId = await getEnvId(envId)

        const configList = await getLoginConfigList({
            envId: assignEnvId
        })

        const platformMap = {
            'WECHAT-OPEN': '微信开放平台',
            'WECHAT-PUBLIC': '微信公众平台'
        }

        const head = ['Id', 'Platform', 'CreateTime', 'Status']
        const tableData = configList.map(item => [
            item.Id,
            platformMap[item.Platform]
                ? platformMap[item.Platform]
                : item.Platform,
            item.CreateTime,
            item.Status === 'ENABLE' ? '启用' : '禁用中'
        ])
        printCliTable(head, tableData)
    })

program
    .command('env:login:config [envId]')
    .description('配置环境登录方式')
    .action(async function(envId?: string) {
        const assignEnvId = await getEnvId(envId)

        const configList = await getLoginConfigList({
            envId: assignEnvId
        })

        const { type, status } = await inquirer.prompt([
            {
                type: 'list',
                name: 'type',
                choices: ['微信公众平台', '微信开放平台'],
                message: '请选择登录方式：',
                default: '微信公众平台'
            },
            {
                type: 'list',
                name: 'status',
                choices: ['启用', '禁用'],
                message: '请选择登录方式状态：',
                default: '启用'
            }
        ])

        const platformMap = {
            微信开放平台: 'WECHAT-OPEN',
            微信公众平台: 'WECHAT-PUBLIC'
        }

        const platform = platformMap[type]
        const item = configList.find(item => item.Platform === platform)

        if (status === '禁用' && item) {
            await updateLoginConfig({
                status: status === '启用' ? 'ENABLE' : 'DISABLE',
                configId: item.Id,
                envId: assignEnvId
            })
            successLog(`${type} 登录方式禁用成功！`)
            return
        }

        const { appId, appSecret } = await inquirer.prompt([
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
        if (item && item.Id) {
            await updateLoginConfig({
                envId: assignEnvId,
                configId: item.Id,
                appId,
                appSecret
            })
        } else {
            await createLoginConfig({
                envId: assignEnvId,
                appId,
                appSecret,
                platform
            })
        }

        successLog('配置环境登录方式成功！')
    })
