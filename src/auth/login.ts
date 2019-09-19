import { getAuthTokenFromWeb, refreshTmpToken } from './auth'
import { getCredentialConfig, CloudService } from '../utils'
import { ConfigItems } from '../constant'
import { configStore } from '../utils/configstore'
import { Credential, ILoginOptios } from '../types'

const tcbService = new CloudService('tcb', '2018-06-08')

// 调用 env:list 接口，检查密钥是否有效
async function checkAuth(credential: Credential) {
    const { tmpSecretId, tmpSecretKey, tmpToken } = credential
    tcbService.setCredential(tmpSecretId, tmpSecretKey, tmpToken)
    return await tcbService.request('DescribeEnvs')
}

// 登录返回 code 与信息
const LoginRes = {
    SUCCESS: {
        code: 'SUCCESS',
        msg: '登录成功！'
    },
    INVALID_TOKEN: {
        code: 'INVALID_TOKEN',
        msg: '无效的身份信息！'
    },
    CHECK_LOGIN_FAILED: {
        code: 'CHECK_LOGIN_FAILED',
        msg: '检查登录态失败'
    },
    INVALID_PARAM(msg) {
        return {
            code: 'INVALID_PARAM',
            msg: `参数无效：${msg}`
        }
    },
    UNKNOWN_ERROR(msg) {
        return {
            code: 'UNKNOWN_ERROR',
            msg: `未知错误：${msg}`
        }
    }
}

// 打开腾讯云-云开发控制台，通过获取临时密钥登录，临时密钥可续期，最长时间为 1 个月
export async function loginWithToken() {
    const tcbrc: Credential = getCredentialConfig()
    // 已有永久密钥
    if (tcbrc.secretId && tcbrc.secretKey) {
        return LoginRes.SUCCESS
    }
    // 如果存在临时密钥，校验临时密钥是否有效，是否需要续期
    const tmpExpired = Number(tcbrc.tmpExpired) || 0
    let refreshExpired = Number(tcbrc.expired) || 0
    const now = Date.now()

    if (now < tmpExpired) {
        return LoginRes.SUCCESS
    }

    let credential

    try {
        if (now < refreshExpired) {
            // 临时 token 过期，自动续期
            credential = await refreshTmpToken(tcbrc)
        } else {
            // 通过腾讯云-云开发控制台获取授权
            credential = await getAuthTokenFromWeb()
        }
    } catch (e) {
        return LoginRes.UNKNOWN_ERROR(e.message)
    }

    if (!credential.refreshToken || !credential.uin) {
        return LoginRes.INVALID_TOKEN
    }

    try {
        await checkAuth(credential)
    } catch (e) {
        return LoginRes.UNKNOWN_ERROR(e.message)
    }

    configStore.set(ConfigItems.credentail, credential)
    return LoginRes.SUCCESS
}

// 使用永久密钥登录
export async function loginWithKey(secretId?: string, secretKey?: string) {
    const tcbrc: Credential = await getCredentialConfig()
    // 已有永久密钥
    if (tcbrc.secretId && tcbrc.secretKey) {
        return LoginRes.SUCCESS
    }

    if (!secretId || !secretKey) {
        return LoginRes.INVALID_PARAM('SecretID 或 SecretKey 不能为空')
    }

    try {
        await checkAuth({ tmpSecretId: secretId, tmpSecretKey: secretKey })
    } catch (e) {
        return LoginRes.CHECK_LOGIN_FAILED
    }

    configStore.set(ConfigItems.credentail, { secretId, secretKey })

    return LoginRes.SUCCESS
}

export async function login(
    options?: ILoginOptios
): Promise<{ code: string; msg: string }> {
    if (options && options.key) {
        const { secretId, secretKey } = options
        return await loginWithKey(secretId, secretKey)
    } else {
        return await loginWithToken()
    }
}
