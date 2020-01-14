import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import program from 'commander'
import { StorageService } from '@cloudbase/manager-node/types/storage'
import {
    getEnvId,
    loadingFactory,
    printHorizontalTable,
    formatDate,
    createOnProgressBar,
    formateFileSize,
    getMangerService
} from '../utils'

import { CloudBaseError } from '../error'
import { successLog } from '../logger'

const AclMap = {
    READONLY: '所有用户可读，仅创建者和管理员可写',
    PRIVATE: '仅创建者及管理员可读写',
    ADMINWRITE: '所有用户可读，仅管理员可写',
    ADMINONLY: '仅管理员可读写'
}

async function getStorageService(options: any): Promise<StorageService> {
    const envId = options?.envId
    const configFile = options?.parent.configFile
    const assignEnvId = await getEnvId(envId, configFile)
    const { storage } = await getMangerService(assignEnvId)
    return storage
}

function checkCloudPath(cloudPath: string) {
    if (cloudPath?.[0] === '/') {
        throw new CloudBaseError('cloudPath 不能以 "/" 开头')
    }
}

program
    .command('storage:upload <localPath> [cloudPath]')
    .option('-e, --envId <envId>', '环境 Id')
    .description('上传文件/文件夹')
    .action(async function(localPath: string, cloudPath = '', options) {
        const storageService = await getStorageService(options)
        const resolveLocalPath = path.resolve(localPath)

        if (!fs.existsSync(resolveLocalPath)) {
            throw new CloudBaseError('文件未找到！')
        }

        const isDir = fs.statSync(resolveLocalPath).isDirectory()
        const fileText = isDir ? '文件夹' : '文件'
        // 上传进度条
        const onProgress = createOnProgressBar(() => {
            successLog(`上传${fileText}成功！`)
        })
        if (isDir) {
            await storageService.uploadDirectory({
                localPath: resolveLocalPath,
                cloudPath,
                onProgress
            })
        } else {
            await storageService.uploadFile({
                localPath: resolveLocalPath,
                cloudPath,
                onProgress
            })
        }
    })

program
    .command('storage:download <cloudPath> <localPath>')
    .option('-e, --envId <envId>', '环境 Id')
    .option('-d, --dir', '下载目标是否为文件夹')
    .description('下载文件/文件夹，文件夹需指定 --dir 选项')
    .action(async function(cloudPath: string, localPath: string, options) {
        const storageService = await getStorageService(options)
        const resolveLocalPath = path.resolve(localPath)

        const { dir } = options
        const fileText = dir ? '文件夹' : '文件'

        if (dir && !fs.existsSync(resolveLocalPath)) {
            throw new CloudBaseError('存储文件夹不存在！')
        }

        const loading = loadingFactory()

        loading.start(`下载${fileText}中`)

        if (dir) {
            await storageService.downloadDirectory({
                localPath: resolveLocalPath,
                cloudPath
            })
        } else {
            await storageService.downloadFile({
                cloudPath,
                localPath: resolveLocalPath
            })
        }

        loading.succeed(`下载${fileText}成功！`)
    })

program
    .command('storage:delete <cloudPath>')
    .option('-e, --envId <envId>', '环境 Id')
    .option('-d, --dir', '下载目标是否为文件夹')
    .description('删除文件/文件夹，文件夹需指定 --dir 选项')
    .action(async function(cloudPath: string, options) {
        const storageService = await getStorageService(options)

        const { dir } = options
        const fileText = dir ? '文件夹' : '文件'
        const loading = loadingFactory()
        loading.start(`删除${fileText}中`)

        if (dir) {
            await storageService.deleteDirectory(cloudPath)
        } else {
            await storageService.deleteFile([cloudPath])
        }

        loading.succeed(`删除${fileText}成功！`)
    })

program
    .command('storage:list [cloudPath]')
    .option('-e, --envId <envId>', '环境 Id')
    .option('--max', '传输数据的最大条数')
    .option('--markder', '起始路径名，后（不含）按照 UTF-8 字典序返回条目')
    .description('获取文件存储的文件列表')
    .action(async function(cloudPath = '', options) {
        const storageService = await getStorageService(options)

        const loading = loadingFactory()
        loading.start('获取文件列表中...')
        const list = await storageService.listDirectoryFiles(cloudPath)
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
    })

program
    .command('storage:url <cloudPath>')
    .option('-e, --envId <envId>', '环境 Id')
    .description('获取文件临时访问地址')
    .action(async function(cloudPath: string, options) {
        const storageService = await getStorageService(options)

        const fileList = await storageService.getTemporaryUrl([cloudPath])
        const { url } = fileList[0]

        successLog(`文件临时访问地址：${url}`)
    })

program
    .command('storage:detail <cloudPath>')
    .option('-e, --envId <envId>', '环境 Id')
    .description('获取文件信息')
    .action(async function(cloudPath: string, options) {
        const storageService = await getStorageService(options)

        const fileInfo = await storageService.getFileInfo(cloudPath)
        const date = formatDate(fileInfo.Date, 'yyyy-MM-dd hh:mm:ss')

        const logInfo = `文件大小：${fileInfo.Size}\n文件类型：${fileInfo.Type}\n修改日期：${date}\nETag：${fileInfo.ETag}
        `
        console.log(logInfo)
    })

program
    .command('storage:get-acl')
    .option('-e, --envId <envId>', '环境 Id')
    .description('获取文件存储权限信息')
    .action(async function(options) {
        const storageService = await getStorageService(options)
        const acl = await storageService.getStorageAcl()

        console.log(`当前权限【${AclMap[acl]}】`)
    })

program
    .command('storage:set-acl')
    .option('-e, --envId <envId>', '环境 Id')
    .description('设置文件存储权限信息')
    .action(async function(options) {
        const storageService = await getStorageService(options)

        const { acl } = await inquirer.prompt({
            type: 'list',
            name: 'acl',
            message: '选择权限',
            choices: [
                {
                    name: '所有用户可读，仅创建者和管理员可写',
                    value: 'READONLY'
                },
                {
                    name: '仅创建者及管理员可读写',
                    value: 'PRIVATE'
                },
                {
                    name: '所有用户可读，仅管理员可写',
                    value: 'ADMINWRITE'
                },
                {
                    name: '仅管理员可读写',
                    value: 'ADMINONLY'
                }
            ]
        })

        await storageService.setStorageAcl(acl)
        successLog('设置存储权限成功！')
    })
