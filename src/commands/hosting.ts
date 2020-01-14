import chalk from 'chalk'
import program from 'commander'
import inquirer from 'inquirer'
import { getHostingInfo, hostingDeploy, hostingDelete, hostingList } from '../hosting'
import { CloudBaseError } from '../error'
import {
    getEnvId,
    loadingFactory,
    isDirectory,
    printHorizontalTable,
    formatDate,
    formateFileSize,
    createOnProgressBar,
    genClickableLink
} from '../utils'
import { errorLog, successLog } from '../logger'

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
    .option('-e, --envId <envId>', '环境 Id')
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
            const link = genClickableLink('https://console.cloud.tencent.com/tcb')
            throw new CloudBaseError(
                `您还没有开启静态网站服务，请先到云开发控制台开启静态网站服务！\n 👉 ${link}`
            )
        }

        const link = genClickableLink(`https://${website.cdnDomain}`)
        // offline 状态不展示域名
        if (website.status !== 'offline') {
            console.log(`静态网站域名：${link}`)
        }
        console.log(`静态网站状态：【${HostingStatusMap[website.status]}】`)
    })

program
    .command('hosting:deploy [filePath] [cloudPath]')
    .option('-e, --envId <envId>', '环境 Id')
    .description('部署静态网站文件')
    .action(async (filePath = '.', cloudPath = '', options: any) => {
        const {
            parent: { configFile },
            envId
        } = options
        const assignEnvId = await getEnvId(envId, configFile)
        const isDir = isDirectory(filePath)

        console.log('> 文件部署中...')

        try {
            const onProgress = createOnProgressBar(() => {
                successLog('文件部署成功！')
            })
            await hostingDeploy({
                filePath,
                cloudPath,
                envId: assignEnvId,
                isDir,
                onProgress
            })
        } catch (e) {
            errorLog('文件部署失败！')
            console.log(e.message)
        }
    })

program
    .command('hosting:delete [cloudPath]')
    .option('-e, --envId <envId>', '环境 Id')
    .option('-d, --dir', '删除目标是否为文件夹')
    .description('删除静态网站文件/文件夹，文件夹需指定 --dir 选项')
    .action(async (cloudPath = '', options: any) => {
        const {
            parent: { configFile },
            envId
        } = options

        let isDir = options.dir

        // 删除所有文件，危险操作，需要提示
        if (cloudPath === '') {
            const { confirm } = await inquirer.prompt({
                type: 'confirm',
                name: 'confirm',
                message: '指定云端路径为空，将会删除所有文件，是否继续',
                default: false
            })
            if (!confirm) {
                throw new CloudBaseError('操作终止！')
            }
            isDir = true
        }
        const fileText = isDir ? '文件夹' : '文件'

        const assignEnvId = await getEnvId(envId, configFile)

        const loading = loadingFactory()
        loading.start(`删除${fileText}中...`)

        try {
            await hostingDelete({
                isDir,
                cloudPath,
                envId: assignEnvId
            })
            loading.succeed(`删除${fileText}成功！`)
        } catch (e) {
            loading.fail(`删除${fileText}失败！`)
            console.log(e.message)
        }
    })

program
    .command('hosting:list')
    .option('-e, --envId <envId>', '环境 Id')
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
            const head = ['序号', 'Key', 'LastModified', 'ETag', 'Size(KB)']
            const notDir = item => !(Number(item.Size) === 0 && /\/$/g.test(item.Key))
            const tableData = list
                .filter(notDir)
                .map((item, index) => [
                    index + 1,
                    item.Key,
                    formatDate(item.LastModified, 'yyyy-MM-dd hh:mm:ss'),
                    item.ETag,
                    String(formateFileSize(item.Size, 'KB'))
                ])
            printHorizontalTable(head, tableData)
        } catch (e) {
            loading.fail('获取文件列表失败！')
            console.log(e.message)
        }
    })
