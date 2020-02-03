import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import logSymbols from 'log-symbols'
import { StorageService } from '@cloudbase/manager-node/types/storage'
import {
    loadingFactory,
    printHorizontalTable,
    formatDate,
    createOnProgressBar,
    formateFileSize,
    getMangerService,
    isDirectory,
    checkFullAccess
} from '../../utils'
import { ICommandContext } from '../command'

import { CloudBaseError } from '../../error'
import { successLog, errorLog } from '../../logger'

const AclMap = {
    READONLY: '所有用户可读，仅创建者和管理员可写',
    PRIVATE: '仅创建者及管理员可读写',
    ADMINWRITE: '所有用户可读，仅管理员可写',
    ADMINONLY: '仅管理员可读写'
}

async function getStorageService(envId: string): Promise<StorageService> {
    const { storage } = await getMangerService(envId)
    return storage
}

function checkCloudPath(cloudPath: string) {
    if (cloudPath?.[0] === '/') {
        throw new CloudBaseError('cloudPath 不能以 "/" 开头')
    }
}

export async function upload(ctx: ICommandContext, localPath = '.', cloudPath = '') {
    const resolveLocalPath = path.resolve(localPath)
    if (!checkFullAccess(resolveLocalPath)) {
        throw new CloudBaseError('文件未找到！')
    }

    const loading = loadingFactory()
    loading.start('准备上传中...')
    const storageService = await getStorageService(ctx.envId)
    const isDir = fs.statSync(resolveLocalPath).isDirectory()

    let totalFiles = 0

    if (isDir) {
        let files = await storageService.walkLocalDir(resolveLocalPath)
        files = files.filter(item => !isDirectory(item))
        totalFiles = files.length
    }

    if (totalFiles > 1000) {
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
            !isDir && successLog('上传文件成功！')
        },
        () => {
            loading.stop()
        }
    )

    const successFiles = []
    const failedFiles = []

    if (isDir) {
        await storageService.uploadDirectory({
            localPath: resolveLocalPath,
            cloudPath,
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
    } else {
        const assignCloudPath = cloudPath || path.parse(resolveLocalPath).base
        await storageService.uploadFile({
            localPath: resolveLocalPath,
            cloudPath: assignCloudPath,
            onProgress
        })
    }
}

export async function download(ctx: ICommandContext, cloudPath: string, localPath: string) {
    const { envId, options } = ctx
    const storageService = await getStorageService(envId)
    const resolveLocalPath = path.resolve(localPath)

    const { dir } = options
    const fileText = dir ? '文件夹' : '文件'

    if (dir && !checkFullAccess(resolveLocalPath)) {
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
}

export async function deleteFile(ctx: ICommandContext, cloudPath: string) {
    const { envId, options } = ctx
    const storageService = await getStorageService(envId)

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
}

export async function list(ctx: ICommandContext, cloudPath = '') {
    const storageService = await getStorageService(ctx.envId)

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
}

export async function getUrl(ctx: ICommandContext, cloudPath: string) {
    const storageService = await getStorageService(ctx.envId)

    const fileList = await storageService.getTemporaryUrl([cloudPath])
    const { url } = fileList[0]

    successLog(`文件临时访问地址：${url}`)
}

export async function detail(ctx: ICommandContext, cloudPath: string) {
    const storageService = await getStorageService(ctx.envId)

    const fileInfo = await storageService.getFileInfo(cloudPath)
    const date = formatDate(fileInfo.Date, 'yyyy-MM-dd hh:mm:ss')

    const logInfo = `文件大小：${fileInfo.Size}\n文件类型：${fileInfo.Type}\n修改日期：${date}\nETag：${fileInfo.ETag}
        `
    console.log(logInfo)
}

export async function getAcl(ctx: ICommandContext) {
    const storageService = await getStorageService(ctx.envId)
    const acl = await storageService.getStorageAcl()

    console.log(`当前权限【${AclMap[acl]}】`)
}

export async function setAcl(ctx: ICommandContext) {
    const storageService = await getStorageService(ctx.envId)

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
}
