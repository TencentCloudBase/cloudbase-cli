import CloudBase from '@cloudbase/manager-node'
import { checkAndGetCredential } from './check-auth'
import { getProxy } from './proxy'

export async function getMangerService(envId = ''): Promise<CloudBase> {
    const { secretId, secretKey, token } = await checkAndGetCredential()
    const app = new CloudBase({
        secretId,
        secretKey,
        token,
        envId,
        proxy: getProxy()
    })

    return app
}
