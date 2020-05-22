import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import logSymbols from 'log-symbols'
import { StorageService } from '@cloudbase/manager-node/types/storage'
import { Command, ICommand } from '../common'

import {
    loadingFactory,
    printHorizontalTable,
    formatDate,
    createUploadProgressBar,
    formateFileSize,
    getMangerService,
    isDirectory,
    checkFullAccess
} from '../../utils'

import { CloudBaseError } from '../../error'
import { InjectParams, EnvId, ArgsParams, ArgsOptions, Log, Logger } from '../../decorators'

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

@ICommand()
export class UploadCommand extends Command {
    get options() {
        return {
            cmd: 'storage:upload <localPath> [cloudPath]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '上传文件/文件夹'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsParams() params, @Log() log: Logger) {
        const localPath = params?.[0]
        const cloudPath = params?.[1]
        const resolveLocalPath = path.resolve(localPath)
        if (!checkFullAccess(resolveLocalPath)) {
            throw new CloudBaseError('文件未找到！')
        }

        const loading = loadingFactory()
        loading.start('准备上传中...')
        const storageService = await getStorageService(envId)
        const isDir = fs.statSync(resolveLocalPath).isDirectory()

        let totalFiles = 0

        if (isDir) {
            let files = await storageService.walkLocalDir(resolveLocalPath)
            files = files.filter((item) => !isDirectory(item))
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
        const onProgress = createUploadProgressBar(
            () => {
                !isDir && log.success('上传文件成功！')
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

            log.success(`文件共计 ${totalFiles} 个`)
            log.success(`文件上传成功 ${successFiles.length} 个`)
            // 上传成功的文件
            if (totalFiles <= 50) {
                printHorizontalTable(
                    ['状态', '文件'],
                    successFiles.map((item) => [logSymbols.success, item])
                )
            }

            // 上传失败的文件
            log.error(`文件上传失败 ${failedFiles.length} 个`)
            if (failedFiles.length) {
                if (totalFiles <= 50) {
                    printHorizontalTable(
                        ['状态', '文件'],
                        failedFiles.map((item) => [logSymbols.error, item])
                    )
                } else {
                    // 写入文件到本地
                    const errorLogPath = path.resolve('./cloudbase-error.log')
                    log.error('上传失败文件：')
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
}

@ICommand()
export class DownloadCommand extends Command {
    get options() {
        return {
            cmd: 'storage:download <cloudPath> <localPath>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-d, --dir',
                    desc: '下载目标是否为文件夹'
                }
            ],
            desc: '下载文件/文件夹，文件夹需指定 --dir 选项'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options, @ArgsParams() params) {
        const cloudPath = params?.[0]
        const localPath = params?.[1]
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
}

@ICommand()
export class DeleteFileCommand extends Command {
    get options() {
        return {
            cmd: 'storage:delete <cloudPath>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-d, --dir',
                    desc: '下载目标是否为文件夹'
                }
            ],
            desc: '删除文件/文件夹，文件夹需指定 --dir 选项'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options, @ArgsParams() params) {
        const cloudPath = params?.[0]
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
}

@ICommand()
export class StorageListCommand extends Command {
    get options() {
        return {
            cmd: 'storage:list [cloudPath]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
                // {
                //     flags: '-m, --max',
                //     desc: '传输数据的最大条数'
                // },
                // {
                //     flags: '--markder',
                //     desc: '起始路径名，后（不含）按照 UTF-8 字典序返回条目'
                // }
            ],
            desc: '获取文件存储的文件列表，不指定路径时获取全部文件列表'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsParams() params) {
        const cloudPath = params?.[0]
        const storageService = await getStorageService(envId)

        const loading = loadingFactory()
        loading.start('获取文件列表中...')
        const list = await storageService.listDirectoryFiles(cloudPath)
        loading.stop()

        const head = ['序号', 'Key', 'LastModified', 'ETag', 'Size(KB)']

        const notDir = (item) => !(Number(item.Size) === 0 && /\/$/g.test(item.Key))

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
}

@ICommand()
export class GetUrlCommand extends Command {
    get options() {
        return {
            cmd: 'storage:url <cloudPath>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '获取文件临时访问地址'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsParams() params, @Log() log: Logger) {
        const cloudPath = params?.[0]
        const storageService = await getStorageService(envId)

        const fileList = await storageService.getTemporaryUrl([cloudPath])
        const { url } = fileList[0]

        log.success(`文件临时访问地址：${url}`)
    }
}

@ICommand()
export class StorageDetailCommand extends Command {
    get options() {
        return {
            cmd: 'storage:detail <cloudPath>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '获取文件信息'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsParams() params) {
        const cloudPath = params?.[0]
        const storageService = await getStorageService(envId)

        const fileInfo = await storageService.getFileInfo(cloudPath)
        const date = formatDate(fileInfo.Date, 'yyyy-MM-dd hh:mm:ss')

        const logInfo = `文件大小：${fileInfo.Size}\n文件类型：${fileInfo.Type}\n修改日期：${date}\nETag：${fileInfo.ETag}
            `
        console.log(logInfo)
    }
}

@ICommand()
export class GetAclCommand extends Command {
    get options() {
        return {
            cmd: 'storage:get-acl',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '获取文件存储权限信息'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId) {
        const storageService = await getStorageService(envId)
        const acl = await storageService.getStorageAcl()

        console.log(`当前权限【${AclMap[acl]}】`)
    }
}

@ICommand()
export class setAclCommand extends Command {
    get options() {
        return {
            cmd: 'storage:set-acl',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '设置文件存储权限信息'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @Log() log: Logger) {
        const storageService = await getStorageService(envId)

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
        log.success('设置存储权限成功！')
    }
}
