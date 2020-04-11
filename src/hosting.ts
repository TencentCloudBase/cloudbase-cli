import path from 'path'
import CloudBase from '@cloudbase/manager-node'
import { StorageService } from '@cloudbase/manager-node/types/storage'
import {
    CloudApiService,
    firstLetterToLowerCase,
    isDirectory,
    checkAndGetCredential,
    getProxy,
    genClickableLink,
    checkReadable
} from './utils'
import { CloudBaseError } from './error'

async function getStorageService(envId: string): Promise<StorageService> {
    const { secretId, secretKey, token } = await checkAndGetCredential(true)
    const app = new CloudBase({
        secretId,
        secretKey,
        token,
        envId,
        proxy: getProxy()
    })
    return app.storage
}

interface IBaseOptions {
    envId: string
}

interface IHostingFileOptions extends IBaseOptions {
    filePath: string
    cloudPath: string
    isDir: boolean
    onProgress?: (data: any) => void
    onFileFinish?: (...args) => void
}

interface IHostingCloudOptions extends IBaseOptions {
    cloudPath: string
    isDir: boolean
}

const HostingStatusMap = {
    init: '初始化中',
    process: '处理中',
    online: '上线',
    destroying: '销毁中',
    offline: '下线',
    create_fail: '初始化失败', // eslint-disable-line
    destroy_fail: '销毁失败' // eslint-disable-line
}

const tcbService = CloudApiService.getInstance('tcb')

export async function getHostingInfo(options: IBaseOptions) {
    const { envId } = options
    const res = await tcbService.request('DescribeStaticStore', {
        EnvId: envId
    })
    const data = firstLetterToLowerCase(res)
    return data
}

async function checkHostingStatus(envId: string) {
    const hostings = await getHostingInfo({ envId })

    const link = genClickableLink('https://console.cloud.tencent.com/tcb')

    if (!hostings.data || !hostings.data.length) {
        throw new CloudBaseError(
            `您还没有开启静态网站服务，请先到云开发控制台开启静态网站服务！\n👉 ${link}`,
            {
                code: 'INVALID_OPERATION'
            }
        )
    }

    const website = hostings.data[0]

    if (website.status !== 'online') {
        throw new CloudBaseError(
            `静态网站服务【${HostingStatusMap[website.status]}】，无法进行此操作！`,
            {
                code: 'INVALID_OPERATION'
            }
        )
    }

    return website
}

export async function enableHosting(options: IBaseOptions) {
    const { envId } = options
    const hostings = await getHostingInfo(options)
    if (hostings.data && hostings.data.length) {
        const website = hostings.data[0]
        // offline 状态的服务可重新开启
        if (website.status !== 'offline') {
            throw new CloudBaseError('静态网站服务已开启，请勿重复操作！')
        }
    }

    const res = await tcbService.request('CreateStaticStore', {
        EnvId: envId
    })
    const code = res.Result === 'succ' ? 0 : -1
    return {
        code,
        requestId: res.RequestId
    }
}

// 展示文件信息
export async function hostingList(options: IBaseOptions) {
    const { envId } = options
    const hosting = await checkHostingStatus(envId)
    const { bucket, regoin } = hosting
    const storageService = await getStorageService(envId)

    const list = await storageService.walkCloudDirCustom({
        prefix: '',
        bucket,
        region: regoin
    })

    return list
}

export async function destroyHosting(options: IBaseOptions) {
    const { envId } = options
    const files = await hostingList(options)

    if (files?.length) {
        throw new CloudBaseError('静态网站文件不为空，无法销毁！', {
            code: 'INVALID_OPERATION'
        })
    }

    const hostings = await getHostingInfo(options)

    if (!hostings.data || !hostings.data.length) {
        throw new CloudBaseError('静态网站服务未开启！', {
            code: 'INVALID_OPERATION'
        })
    }

    const website = hostings.data[0]

    // destroy_fail 状态可重试
    if (website.status !== 'online' && website.status !== 'destroy_fail') {
        throw new CloudBaseError(
            `静态网站服务【${HostingStatusMap[website.status]}】，无法进行此操作！`,
            {
                code: 'INVALID_OPERATION'
            }
        )
    }

    const res = await tcbService.request('DestroyStaticStore', {
        EnvId: envId
    })

    const code = res.Result === 'succ' ? 0 : -1
    return {
        code,
        requestId: res.RequestId
    }
}

// 上传文件
export async function hostingDeploy(options: IHostingFileOptions) {
    const { envId, filePath, cloudPath, onProgress, onFileFinish } = options
    const resolvePath = path.resolve(filePath)
    // 检查路径是否存在
    checkReadable(resolvePath, true)

    const hosting = await checkHostingStatus(envId)
    const { bucket, regoin } = hosting
    const storageService = await getStorageService(envId)

    if (isDirectory(resolvePath)) {
        await storageService.uploadDirectoryCustom({
            localPath: resolvePath,
            cloudPath,
            bucket,
            region: regoin,
            onProgress,
            onFileFinish,
            fileId: false
        })
    } else {
        const assignCloudPath = cloudPath || path.parse(resolvePath).base
        await storageService.uploadFileCustom({
            localPath: resolvePath,
            cloudPath: assignCloudPath,
            bucket,
            region: regoin,
            onProgress,
            fileId: false
        })
    }
}

// 删除文件
export async function hostingDelete(options: IHostingCloudOptions) {
    const { envId, cloudPath, isDir } = options
    const hosting = await checkHostingStatus(envId)
    const { bucket, regoin } = hosting
    const storageService = await getStorageService(envId)

    if (isDir) {
        await storageService.deleteDirectoryCustom({
            cloudPath,
            bucket,
            region: regoin
        })
    } else {
        await storageService.deleteFileCustom([cloudPath], bucket, regoin)
    }
}

// 删除文件
export async function walkLocalDir(envId: string, dir: string) {
    const storageService = await getStorageService(envId)
    return storageService.walkLocalDir(dir)
}
