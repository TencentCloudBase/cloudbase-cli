import chalk from 'chalk'
import program from 'commander'
import { getHostingInfo, hostingDeploy, hostingDelete, hostingList } from '../hosting'
import { CloudBaseError } from '../error'
import { getEnvId, loadingFactory, isDirectory, printHorizontalTable, formatDate } from '../utils'

const HostingStatusMap = {
    init: '初始化中',
    process: '处理中',
    online: '已上线',
    destroying: '销毁中',
    offline: '已下线',
    create_fail: '初始化失败', // eslint-disable-line
    destroy_fail: '销毁失败' // eslint-disable-line
}

program
    .command('hosting:detail')
    .option('-e, --envId [envId]', '环境 Id')
    .description('查看静态网站服务信息')
    .action(async (options: any) => {
        const {
            parent: { configFile },
            envId
        } = options
        const assignEnvId = await getEnvId(envId, configFile)
        const res = await getHostingInfo({ envId: assignEnvId })

        const website = res.data && res.data[0]

        if (!website) {
            throw new CloudBaseError(
                '您还没有开启静态网站服务，请先到云开发控制台开启静态网站服务！\n 👉 https://console.cloud.tencent.com/tcb'
            )
        }
        const url = `https://${website.cdnDomain}`

        // offline 状态不展示域名
        if (website.status === 'offline') {
            console.log(`静态网站状态：${HostingStatusMap[website.status]}`)
        } else {
            console.log(
                `静态网站域名：${chalk.bold.underline(url)}\n静态网站状态：${
                    HostingStatusMap[website.status]
                }`
            )
        }
    })

program
    .command('hosting:deploy [filePath] [cloudPath]')
    .option('-e, --envId [envId]', '环境 Id')
    .description('部署静态网站文件')
    .action(async (filePath: string, cloudPath = '', options: any) => {
        const {
            parent: { configFile },
            envId
        } = options
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
            loading.succeed('文件部署成功！')
        } catch (error) {
            loading.fail('文件部署失败！')
        }
    })

program
    .command('hosting:delete [cloudPath]')
    .option('-e, --envId [envId]', '环境 Id')
    .option('-d, --dir', '删除文件夹')
    .description('删除静态网站文件/文件夹')
    .action(async (cloudPath = '', options: any) => {
        const {
            parent: { configFile },
            envId
        } = options
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
            loading.succeed(`删除${fileText}成功！`)
        } catch (e) {
            loading.fail(`删除${fileText}失败！`)
            console.log(e.message)
        }
    })

program
    .command('hosting:list')
    .option('-e, --envId [envId]', '环境 Id')
    .description('展示文件列表')
    .action(async (options: any) => {
        const {
            parent: { configFile },
            envId
        } = options
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
        } catch (e) {
            loading.fail('获取文件列表失败！')
            console.log(e.message)
        }
    })
