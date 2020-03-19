import _ from 'lodash'
import { checkAuth } from './web-auth'
import { authStore } from './store'
import { getCredentialData, refreshTmpToken } from './credential'
import { AuthSecret } from '../types'
import { ConfigItems } from '../constant'
import { CloudBaseError } from '../error'

async function wrapCheckAuth({ secretId, secretKey, token = '', throwError }) {
    try {
        await checkAuth({
            tmpSecretId: secretId,
            tmpSecretKey: secretKey,
            tmpToken: token
        })
        return {
            token,
            secretId,
            secretKey
        }
    } catch (error) {
        if (throwError) {
            throw new CloudBaseError('无有效身份信息，请使用 cloudbase login 登录')
        }
        return null
    }
}

// 获取身份认证信息并校验、自动刷新
export async function checkAndGetCredential(throwError = false): Promise<AuthSecret> {
    const credential = await getCredentialData()
    if (!credential || _.isEmpty(credential)) {
        if (throwError) {
            throw new CloudBaseError('无有效身份信息，请使用 cloudbase login 登录')
        }
        return null
    }

    // 存在永久密钥
    if (credential.secretId && credential.secretKey) {
        const { secretId, secretKey } = credential
        return wrapCheckAuth({
            secretId,
            secretKey,
            throwError
        })
    }

    // 存在临时密钥信息
    if (credential.refreshToken) {
        // 临时密钥在 2 小时有效期内，可以直接使用
        if (Date.now() < Number(credential.tmpExpired)) {
            const { tmpSecretId, tmpSecretKey, tmpToken } = credential
            return wrapCheckAuth({
                secretId: tmpSecretId,
                secretKey: tmpSecretKey,
                token: tmpToken,
                throwError
            })
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
            await authStore.set(ConfigItems.credentail, refreshCredential || {})
            const { tmpSecretId, tmpSecretKey, tmpToken } = refreshCredential

            return wrapCheckAuth({
                secretId: tmpSecretId,
                secretKey: tmpSecretKey,
                token: tmpToken,
                throwError
            })
        }
    }

    if (throwError) {
        throw new CloudBaseError('无有效身份信息，请使用 cloudbase login 登录')
    }

    return null
}
