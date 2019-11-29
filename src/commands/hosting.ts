import chalk from 'chalk'
import program from 'commander'
import inquirer from 'inquirer'
import {
    enableHosting,
    getHostingInfo,
    destroyHosting,
    hostingDeploy,
    hostingDelete,
    hostingList
} from '../hosting'
import { CloudBaseError } from '../error'
import { getEnvId, loadingFactory, isDirectory, printHorizontalTable, formatDate } from '../utils'
import { successLog } from '../logger'

const HostingStatusMap = {
    init: '初始化中',
    process: '处理中',
    online: '上线',
    destroying: '销毁中',
    offline: '下线'
}

program
    .command('hosting:enable [envId]')
    .description('开启静态网站服务')
    .action(async (envId: string, options: any) => {
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)
        const res = await enableHosting({ envId: assignEnvId })
        if (res.code === 0) {
            successLog('静态网站服务开启成功！')
        } else {
            throw new CloudBaseError('静态网站服务失败！')
        }
    })

program
    .command('hosting:detail [envId]')
    .description('查看静态网站服务信息')
    .action(async (envId: string, options: any) => {
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)
        const res = await getHostingInfo({ envId: assignEnvId })

        const website = res.data && res.data[0]
        if (!website) {
            throw new CloudBaseError(
                '你还没有开启静态网站服务，请使用 cloudbase hosting:enable 命令启用静态网站服务！'
            )
        }
        const url = `https://${website.CdnDomain}`
        console.log(
            `静态网站域名：${chalk.bold.underline(url)}\n静态网站状态：${
                HostingStatusMap[website.Status]
            }`
        )
    })

program
    .command('hosting:destroy [envId]')
    .description('关闭静态网站服务')
    .action(async (envId: string, options: any) => {
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)
        // 危险操作，再次确认
        const { confirm } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: '确定要关闭静态网站服务吗，关闭后您的所有静态网站资源将被销毁，无法恢复！',
            default: false
        })
        if (!confirm) {
            throw new CloudBaseError('操作终止！')
        }

        const loading = loadingFactory()
        loading.start('静态网站销毁中')
        const res = await destroyHosting({ envId: assignEnvId })
        if (res.code === 0) {
            loading.succeed('静态网站服务销毁成功！')
        } else {
            loading.fail('静态网站服务销毁失败！')
        }
    })

program
    .command('hosting:deploy [filePath] [cloudPath] [envId]')
    .description('部署静态网站文件')
    .action(async (filePath: string, cloudPath = '', envId: string, options: any) => {
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)

        const isDir = isDirectory(filePath)

        const loading = loadingFactory()

        loading.start('文件部署中...')

        try {
            await hostingDeploy({
                filePath,
                cloudPath,
                envId: assignEnvId,
                isDir
            })
            loading.succeed('文件部署中...')
        } catch (error) {
            loading.fail('文件部署失败！')
        }
    })

program
    .command('hosting:delete [cloudPath] [envId]')
    .option('-d, --dir', '删除文件夹')
    .description('删除静态网站文件/文件夹')
    .action(async (cloudPath = '', envId: string, options: any) => {
        const { configFile } = options.parent
        const { dir } = options
        const fileText = dir ? '文件夹' : '文件'

        const assignEnvId = await getEnvId(envId, configFile)

        const loading = loadingFactory()
        loading.start(`删除${fileText}中...`)

        try {
            await hostingDelete({
                cloudPath,
                envId: assignEnvId,
                isDir: dir
            })
            loading.succeed(`删除${fileText}成功...`)
        } catch (error) {
            loading.fail(`删除${fileText}失败...`)
        }
    })

program
    .command('hosting:list [envId]')
    .description('展示文件列表')
    .action(async (envId: string, options: any) => {
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)

        const loading = loadingFactory()
        loading.start('获取文件列表中...')

        try {
            const list = await hostingList({
                envId: assignEnvId
            })
            loading.stop()
            const head = ['序号', 'Key', 'LastModified', 'ETag', 'Size(B)']
            const notDir = item => !(Number(item.Size) === 0 && /\/$/g.test(item.Key))
            const tableData = list
                .filter(notDir)
                .map((item, index) => [
                    index + 1,
                    item.Key,
                    formatDate(item.LastModified, 'yyyy-MM-dd hh:mm:ss'),
                    item.ETag,
                    String(item.Size)
                ])
            printHorizontalTable(head, tableData)
        } catch (error) {
            loading.fail('获取文件列表失败')
        }
    })
