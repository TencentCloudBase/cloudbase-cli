import CloudBase from '@cloudbase/manager-node'
import { StorageService } from '@cloudbase/manager-node/types/storage'
import { getRegion } from '@cloudbase/toolbox'
import { checkAndGetCredential } from './credential'
import { getProxy } from './proxy'

export async function getMangerService(envId = ''): Promise<CloudBase> {
    const { secretId, secretKey, token } = await checkAndGetCredential(true)
    const region = await getRegion()

    const app = new CloudBase({
        token,
        envId,
        region,
        secretId,
        secretKey,
        proxy: getProxy()
    })

    return app
}

export async function getStorageService(envId: string): Promise<StorageService> {
    const { secretId, secretKey, token } = await checkAndGetCredential(true)
    const region = await getRegion()

    const app = new CloudBase({
        token,
        envId,
        secretId,
        region,
        secretKey,
        proxy: getProxy()
    })
    return app.storage
}
