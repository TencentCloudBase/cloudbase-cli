import path from 'path'
import CloudBase from '@cloudbase/manager-node'
import { StorageService } from '@cloudbase/manager-node/types/storage'
import { CloudApiService, firstLetterToLowerCase, checkPathExist, isDirectory } from './utils'
import { list } from './storage'
import { CloudBaseError } from './error'
import { checkAndGetCredential, getProxy } from './utils'

async function getStorageService(envId: string): Promise<StorageService> {
    const { secretId, secretKey, token } = await checkAndGetCredential()
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
}

interface IHostingCloudOptions extends IBaseOptions {
    cloudPath: string
    isDir: boolean
}

const tcbService = new CloudApiService('tcb')

export async function enableHosting(options: IBaseOptions) {
    const { envId } = options
    const res = await tcbService.request('CreateStaticStore', {
        EnvId: envId
    })
    const code = res.Result === 'succ' ? 0 : -1
    return {
        code,
        requestId: res.RequestId
    }
}

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

    if (!hostings.data || !hostings.data.length) {
        throw new CloudBaseError('静态托管服务未开启！', {
            code: 'INVALID_OPERATION'
        })
    }
    return hostings
}

export async function destroyHosting(options: IBaseOptions) {
    const { envId } = options
    const files = await list({
        envId,
        cloudPath: ''
    })

    const hostings = await getHostingInfo(options)

    if (!hostings.data || !hostings.data.length) {
        throw new CloudBaseError('静态托管服务未开启！', {
            code: 'INVALID_OPERATION'
        })
    }

    const website = hostings.data[0]

    if (website.status !== 'online') {
        throw new CloudBaseError('静态托管服务状态异常，无法销毁！', {
            code: 'INVALID_OPERATION'
        })
    }

    if (files.length) {
        throw new CloudBaseError('静态托管文件不为空，无法销毁！', {
            code: 'INVALID_OPERATION'
        })
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
    const { envId, filePath, cloudPath } = options
    const resolvePath = path.resolve(filePath)
    // 检查路径是否存在
    checkPathExist(resolvePath, true)

    const hostings = await checkHostingStatus(envId)
    const { bucket, region } = hostings.data[0]
    const storageService = await getStorageService(envId)

    if (isDirectory(resolvePath)) {
        storageService.uploadDirectoryCustom(resolvePath, cloudPath, bucket, region)
    } else {
        storageService.uploadFileCustom(resolvePath, cloudPath, bucket, region)
    }
}

// 删除文件
export async function hostingDelete(options: IHostingCloudOptions) {
    const { envId, cloudPath, isDir } = options
    const hostings = await checkHostingStatus(envId)
    const { bucket, region } = hostings.data[0]
    const storageService = await getStorageService(envId)

    if (isDir) {
        storageService.deleteDirectoryCustom(cloudPath, bucket, region)
    } else {
        storageService.deleteFileCustom([cloudPath], bucket, region)
    }
}

// 展示文件信息
export async function hostingList(options: IBaseOptions) {
    const { envId } = options
    const hostings = await checkHostingStatus(envId)
    const { bucket, region } = hostings.data[0]
    const storageService = await getStorageService(envId)

    const list = await storageService.walkCloudDirCustom('', bucket, region)

    return list
}
