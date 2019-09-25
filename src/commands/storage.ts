import fs from 'fs'
import path from 'path'
import program from 'commander'
import CloudBase from '@cloudbase/manager-node'
import { getCredential, getEnvId, loading } from '../utils'
import { StorageService } from '@cloudbase/manager-node/types/storage'
import { CloudBaseError } from '../error'
import { successLog } from '../logger'
import { printCliTable, formatDate } from '../utils'

async function getStorageService(envId: string): Promise<StorageService> {
    const { secretId, secretKey, token } = await getCredential()
    const app = new CloudBase({
        secretId,
        secretKey,
        token,
        envId
    })
    return app.storage
}

program
    .command('storage:upload <localPath> <cloudPath> [envId]')
    .description('上传文件/文件夹')
    .action(async function(
        localPath: string,
        cloudPath: string,
        envId: string,
        options
    ) {
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)
        const storageService = await getStorageService(assignEnvId)
        const resolveLocalPath = path.resolve(localPath)

        if (!fs.existsSync(resolveLocalPath)) {
            throw new CloudBaseError('文件未找到！')
        }

        const isDir = fs.statSync(resolveLocalPath).isDirectory()
        let cancelLoading = loading('上传文件中')
        if (isDir) {
            await storageService.uploadDirectory(resolveLocalPath, cloudPath)
        } else {
            await storageService.uploadFile(resolveLocalPath, cloudPath)
        }
        cancelLoading()
        successLog('上传文件成功！')
    })

program
    .command('storage:download <cloudPath> <localPath> [envId]')
    .option('-d, --dir', '下载目标是否为文件夹')
    .description('下载文件/文件夹，文件夹需指定 --dir 选项')
    .action(async function(
        cloudPath: string,
        localPath: string,
        envId: string,
        options
    ) {
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)
        const storageService = await getStorageService(assignEnvId)
        const resolveLocalPath = path.resolve(localPath)

        const { dir } = options
        if (dir && !fs.existsSync(resolveLocalPath)) {
            throw new CloudBaseError('存储文件夹不存在！')
        }

        let cancelLoading = loading('下载文件中')

        if (dir) {
            await storageService.downloadDirectory(cloudPath, resolveLocalPath)
        } else {
            await storageService.downloadFile(cloudPath, resolveLocalPath)
        }

        cancelLoading()
        successLog('下载文件成功！')
    })

program
    .command('storage:delete <cloudPath> [envId]')
    .option('-d, --dir', '下载目标是否为文件夹')
    .description('删除文件/文件夹，文件夹需指定 --dir 选项')
    .action(async function(cloudPath: string, envId: string, options) {
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)
        const storageService = await getStorageService(assignEnvId)

        const { dir } = options

        if (dir) {
            await storageService.deleteDirectory(cloudPath)
        } else {
            await storageService.deleteFile([cloudPath])
        }

        successLog('删除文件成功！')
    })

program
    .command('storage:list <cloudPath> [envId]')
    .option('--max', '传输数据的最大条数')
    .option('--markder', '起始路径名，后（不含）按照 UTF-8 字典序返回条目')
    .description('获取文件夹中的文件列表')
    .action(async function(cloudPath: string, envId: string, options) {
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)
        const storageService = await getStorageService(assignEnvId)
        const list = await storageService.listDirectoryFiles(cloudPath)

        const head = ['序号', 'Key', 'LastModified', 'ETag', 'Size(B)']

        const notDir = item =>
            !(Number(item.Size) === 0 && /\/$/g.test(item.Key))

        const tableData = list
            .filter(notDir)
            .map((item, index) => [
                index + 1,
                item.Key,
                formatDate(item.LastModified, 'yyyy-MM-dd hh:mm:ss'),
                item.ETag,
                String(item.Size)
            ])
        printCliTable(head, tableData)
    })

program
    .command('storage:url <cloudPath> [envId]')
    .description('获取文件临时访问地址')
    .action(async function(cloudPath: string, envId: string, options) {
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)
        const storageService = await getStorageService(assignEnvId)
        const fileList = await storageService.getTemporaryUrl([cloudPath])
        const { url } = fileList[0]

        successLog(`文件临时访问地址：${url}`)
    })

program
    .command('storage:detail <cloudPath> [envId]')
    .description('获取文件信息')
    .action(async function(cloudPath: string, envId: string, options) {
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)
        const storageService = await getStorageService(assignEnvId)

        const fileInfo = await storageService.getFileInfo(cloudPath)
        const date = formatDate(fileInfo.Date, 'yyyy-MM-dd hh:mm:ss')

        const logInfo = `文件大小：${fileInfo.Size}\n文件类型：${fileInfo.Type}\n修改日期：${date}\nETag：${fileInfo.ETag}
        `
        console.log(logInfo)
    })

program
    .command('storage:get-acl [envId]')
    .description('获取文件存储权限信息')
    .action(async function(envId: string, options) {
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)
        const storageService = await getStorageService(assignEnvId)

        const acl = await storageService.getStorageAcl()

        console.log(acl)
    })

program
    .command('storage:set-acl <acl> [envId]')
    .description('设置文件存储权限信息')
    .action(async function(
        acl: 'READONLY' | 'PRIVATE' | 'ADMINWRITE' | 'ADMINONLY',
        envId: string,
        options
    ) {
        const validAcl = ['READONLY', 'PRIVATE', 'ADMINWRITE', 'ADMINONLY']
        if (!validAcl.includes(acl)) {
            throw new CloudBaseError(
                '非法的权限值，仅支持：READONLY, PRIVATE, ADMINWRITE, ADMINONLY'
            )
        }
        const { configFile } = options.parent
        const assignEnvId = await getEnvId(envId, configFile)
        const storageService = await getStorageService(assignEnvId)

        await storageService.setStorageAcl(acl)
    })
