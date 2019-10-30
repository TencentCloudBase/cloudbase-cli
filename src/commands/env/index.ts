import program from 'commander'
import { listEnvs, createEnv, getEnvInfo, updateEnvInfo } from '../../env'
import { printCliTable, loadingFactory, getEnvId } from '../../utils'
import { CloudBaseError } from '../../error'
import { warnLog, successLog } from '../../logger'

import './domain'
import './login'

program
    .command('env:list')
    .description('列出云开发所有环境')
    .action(async function() {
        const data = await listEnvs()
        const head = [
            'EnvId',
            'Alias',
            'PackageName',
            'Source',
            'CreateTime',
            'Status'
        ]
        const tableData = data.map(item => [
            item.EnvId,
            item.Alias,
            item.PackageName,
            item.Source === 'miniapp' ? '小程序' : '云开发',
            item.CreateTime,
            item.Status === 'NORMAL' ? '正常' : '不可用'
        ])
        printCliTable(head, tableData)
        // 不可用环境警告
        const unavailableEnv = data.find(item => item.Status === 'UNAVAILABLE')
        if (unavailableEnv) {
            warnLog(
                `您的环境中存在不可用的环境：[${unavailableEnv.EnvId}]，请留意！`
            )
        }
    })

async function checkEnvAvailability(envId: string) {
    const MAX_TRY = 10
    let retry = 0

    return new Promise((resolve, reject) => {
        const timer = setInterval(async () => {
            const envInfo = await getEnvInfo(envId)
            if (envInfo.Status === 'NORMAL') {
                clearInterval(timer)
                resolve()
            } else {
                retry++
            }
            if (retry > MAX_TRY) {
                reject(
                    new CloudBaseError(
                        '环境初始化查询超时，请稍后通过 cloudbase env:list 查看环境状态'
                    )
                )
            }
        }, 1000)
    })
}

program
    .command('env:create <alias>')
    .description('创建新的云环境')
    .action(async function(alias: string) {
        if (!alias) {
            throw new CloudBaseError('环境名称不能为空！')
        }

        const  loading = loadingFactory()

        loading.start('创建环境中')

        const res = await createEnv({
            alias
        })

        loading.succeed('创建环境成功！')
        loading.start('环境初始化中')

        if (res.Status === 'NORMAL') {
            loading.start('环境初始化成功')
            return
        }

        // 检查环境是否初始化成功
        try {
            await checkEnvAvailability(res.EnvId)
            loading.succeed('环境初始化成功')
        } catch (e) {
            loading.fail(e.message)
        }
    })

program
    .command('env:rename <name> [envId]')
    .description('重命名环境')
    .action(async function(name: string, envId: string, options) {
        if (!name) {
            throw new CloudBaseError('环境名称不能为空！')
        }

        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)

        await updateEnvInfo({
            envId: assignEnvId,
            alias: name
        })

        successLog('更新环境名成功 ！')
    })
