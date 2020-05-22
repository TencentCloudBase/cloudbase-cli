import CloudBase from '@cloudbase/manager-node'
import { checkAndGetCredential } from './credential'
import { getProxy } from './tools'

export async function getMangerService(envId = ''): Promise<CloudBase> {
    const { secretId, secretKey, token } = await checkAndGetCredential(true)
    const app = new CloudBase({
        secretId,
        secretKey,
        token,
        envId,
        proxy: getProxy()
    })

    return app
}
