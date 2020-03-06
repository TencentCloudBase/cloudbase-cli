import CloudBase from '@cloudbase/manager-node'
import { checkAndGetCredential } from './get-auth'
import { getProxy } from './tools'

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
