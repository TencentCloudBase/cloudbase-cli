import { getCredentialData, refreshTmpToken } from './auth'
import { AuthSecret } from '../types'
import { CloudService } from './qcloud-request'
import { authStore } from './store'
import { ConfigItems } from '../constant'

const tcbService = new CloudService('tcb', '2018-06-08')

// 调用 env:list 接口，检查密钥是否有效
async function checkAuth(secretId, secretKey, token?) {
    tcbService.setCredential(secretId, secretKey, token)
    return await tcbService.request('DescribeEnvs')
}

// 获取身份认证信息并校验、自动刷新
export async function checkAndGetCredential(): Promise<AuthSecret> {
    const credential = getCredentialData()
    if (!credential) {
        return null
    }

    // 存在永久密钥
    if (credential.secretId && credential.secretKey) {
        const { secretId, secretKey } = credential
        await checkAuth(secretId, secretKey)
        return {
            secretId,
            secretKey
        }
    }

    // 存在临时密钥信息
    if (credential.refreshToken) {
        // 临时密钥在 2 小时有效期内，可以直接使用
        if (Date.now() < Number(credential.tmpExpired)) {
            const { tmpSecretId, tmpSecretKey, tmpToken } = credential
            await checkAuth(tmpSecretId, tmpSecretKey, tmpToken)
            return {
                secretId: tmpSecretId,
                secretKey: tmpSecretKey,
                token: tmpToken
            }
        } else if (Date.now() < Number(credential.expired)) {
            // 临时密钥超过两小时有效期，但在 1 个月 refresh 有效期内，刷新临时密钥
            let refreshCredential = null
            try {
                refreshCredential = await refreshTmpToken(credential)
            } catch (e) {
                // 登录态失效
                if (e.code === 'AUTH_FAIL') {
                    return null
                } else {
                    // 异常错误
                    throw e
                }
            }
            // 存储
            authStore.set(ConfigItems.credentail, refreshCredential || {})
            const { tmpSecretId, tmpSecretKey, tmpToken } = refreshCredential
            await checkAuth(tmpSecretId, tmpSecretKey, tmpToken)
            return {
                secretId: tmpSecretId,
                secretKey: tmpSecretKey,
                token: tmpToken
            }
        }
    }

    return null
}
