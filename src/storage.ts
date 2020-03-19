import CloudBase from '@cloudbase/manager-node'
import { StorageService } from '@cloudbase/manager-node/types/storage'
import { checkAndGetCredential, getProxy } from './utils'
import { CloudBaseError } from './error'

interface IStorageOptions {
    envId: string
    localPath: string
    cloudPath: string
}

interface IStorageCloudOptions {
    envId: string
    cloudPath: string
    cloudPaths?: string[]
}

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

export async function uploadFile(options: IStorageOptions) {
    const { envId, localPath, cloudPath } = options
    const storageService = await getStorageService(envId)
    return storageService.uploadFile({
        localPath,
        cloudPath
    })
}

export async function uploadDirectory(options: IStorageOptions) {
    const { envId, localPath, cloudPath } = options
    const storageService = await getStorageService(envId)
    return storageService.uploadDirectory({
        localPath,
        cloudPath
    })
}

export async function downloadFile(options: IStorageOptions) {
    const { envId, localPath, cloudPath } = options
    const storageService = await getStorageService(envId)
    return storageService.downloadFile({
        cloudPath,
        localPath
    })
}

export async function downloadDirectory(options: IStorageOptions) {
    const { envId, localPath, cloudPath } = options
    const storageService = await getStorageService(envId)

    return storageService.downloadDirectory({
        cloudPath,
        localPath
    })
}

export async function deleteFile(options: IStorageCloudOptions) {
    const { envId, cloudPath, cloudPaths } = options
    const storageService = await getStorageService(envId)

    if (cloudPaths?.length) {
        return storageService.deleteFile(cloudPaths)
    }

    return storageService.deleteFile([cloudPath])
}

export async function deleteDirectory(options: IStorageCloudOptions) {
    const { envId, cloudPath } = options
    const storageService = await getStorageService(envId)

    return storageService.deleteDirectory(cloudPath)
}

export async function list(options: IStorageCloudOptions) {
    const { envId, cloudPath } = options
    const storageService = await getStorageService(envId)

    return storageService.listDirectoryFiles(cloudPath)
}

export async function getUrl(options: IStorageCloudOptions) {
    const { envId, cloudPaths } = options
    const storageService = await getStorageService(envId)

    return storageService.getTemporaryUrl(cloudPaths)
}

export async function detail(options: IStorageCloudOptions) {
    const { envId, cloudPath } = options
    const storageService = await getStorageService(envId)

    return storageService.getFileInfo(cloudPath)
}

export async function getAcl(options) {
    const { envId } = options
    const storageService = await getStorageService(envId)

    return storageService.getStorageAcl()
}

export async function setAcl(options) {
    const { envId, acl } = options
    const validAcl = ['READONLY', 'PRIVATE', 'ADMINWRITE', 'ADMINONLY']
    if (!validAcl.includes(acl)) {
        throw new CloudBaseError('非法的权限值，仅支持：READONLY, PRIVATE, ADMINWRITE, ADMINONLY')
    }
    const storageService = await getStorageService(envId)

    return storageService.setStorageAcl(acl)
}
