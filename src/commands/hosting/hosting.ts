import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import logSymbols from 'log-symbols'
import {
    getHostingInfo,
    hostingDeploy,
    hostingDelete,
    hostingList,
    walkLocalDir
} from '../../hosting'
import { CloudBaseError } from '../../error'
import {
    isDirectory,
    loadingFactory,
    printHorizontalTable,
    formatDate,
    formateFileSize,
    createOnProgressBar,
    genClickableLink,
    checkFullAccess
} from '../../utils'
import { errorLog, successLog } from '../../logger'

const HostingStatusMap = {
    init: '初始化中',
    process: '处理中',
    online: '已上线',
    destroying: '销毁中',
    offline: '已下线',
    create_fail: '初始化失败', // eslint-disable-line
    destroy_fail: '销毁失败' // eslint-disable-line
}

export async function detail(ctx) {
    const { envId } = ctx
    const res = await getHostingInfo({ envId })

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
}

export async function deploy(ctx, localPath = '.', cloudPath = '') {
    const { envId } = ctx
    const resolveLocalPath = path.resolve(localPath)
    checkFullAccess(resolveLocalPath, true)
    const isDir = isDirectory(resolveLocalPath)

    const loading = loadingFactory()
    loading.start('准备上传中...')

    let totalFiles = 0

    if (isDir) {
        let files = await walkLocalDir(envId, resolveLocalPath)
        files = files.filter(item => !isDirectory(item))
        totalFiles = files.length
    }

    if (totalFiles > 1000) {
        loading.stop()
        const { confirm } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: '上传文件数量大于 1000，是否继续',
            default: false
        })

        if (!confirm) {
            throw new CloudBaseError('上传中止')
        }
    }

    // 上传进度条
    const onProgress = createOnProgressBar(
        () => {
            !isDir && successLog('文件部署成功！')
        },
        () => {
            loading.stop()
        }
    )

    const successFiles = []
    const failedFiles = []

    await hostingDeploy({
        filePath: resolveLocalPath,
        cloudPath,
        envId,
        isDir,
        onProgress,
        onFileFinish: (...args) => {
            const error = args[0]
            const fileInfo = (args as any)[2]
            if (error) {
                failedFiles.push(fileInfo.Key)
            } else {
                successFiles.push(fileInfo.Key)
            }
        }
    })

    if (isDir) {
        successLog(`文件共计 ${totalFiles} 个`)
        successLog(`文件上传成功 ${successFiles.length} 个`)
        // 上传成功的文件
        if (totalFiles <= 50) {
            printHorizontalTable(
                ['状态', '文件'],
                successFiles.map(item => [logSymbols.success, item])
            )
        }

        // 上传失败的文件
        errorLog(`文件上传失败 ${failedFiles.length} 个`)
        if (failedFiles.length) {
            if (totalFiles <= 50) {
                printHorizontalTable(
                    ['状态', '文件'],
                    failedFiles.map(item => [logSymbols.error, item])
                )
            } else {
                // 写入文件到本地
                const errorLogPath = path.resolve('./cloudbase-error.log')
                errorLog('上传失败文件：')
                console.log(errorLogPath)
                fs.writeFileSync(errorLogPath, failedFiles.join('\n'))
            }
        }
    }
}

export async function deleteFiles(ctx, cloudPath = '') {
    const { options, envId } = ctx
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

    const loading = loadingFactory()
    loading.start(`删除${fileText}中...`)

    try {
        await hostingDelete({
            isDir,
            cloudPath,
            envId
        })
        loading.succeed(`删除${fileText}成功！`)
    } catch (e) {
        loading.fail(`删除${fileText}失败！`)
        console.log(e.message)
    }
}

export async function list(ctx) {
    const { envId } = ctx

    const loading = loadingFactory()
    loading.start('获取文件列表中...')

    try {
        const list = await hostingList({
            envId
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
}
