import _ from 'lodash'
import { Credential } from '@cloudbase/toolbox'
import { authSupevisor, checkAndGetCredential, execWithLoading, checkEnvAvaliable } from '../utils'
import { ILoginOptions } from '../types'
import { ENV_STATUS } from '../constant'
import { Logger } from '../decorators'
import { getEnvInfo } from '../env'

const log = new Logger()

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
    }
}

// 打开腾讯云-云开发控制台，通过获取临时密钥登录，临时密钥可续期，最长时间为 1 个月
export async function loginByWebAuth() {
    const credential = await authSupevisor.loginByWebAuth({
        throwError: true
    })

    if (_.isEmpty(credential)) {
        return LoginRes.INVALID_TOKEN
    }

    return {
        credential,
        ...LoginRes.SUCCESS
    }
}

// 使用密钥登录
export async function loginWithKey(secretId?: string, secretKey?: string, token?: string) {
    if (!secretId || !secretKey) {
        return LoginRes.INVALID_PARAM('SecretID 或 SecretKey 不能为空')
    }

    const credential = await authSupevisor.loginByApiSecret(secretId, secretKey, token)

    if (_.isEmpty(credential)) {
        return LoginRes.INVALID_TOKEN
    }

    return LoginRes.SUCCESS
}

export async function login(
    options: ILoginOptions = {}
): Promise<{ code: string; msg: string; credential?: Credential }> {
    const { secretId, secretKey, key, token } = options
    return key ? loginWithKey(secretId, secretKey, token) : loginByWebAuth()
}

// 检查是否登录，没有登录时，自动拉起浏览器授权
export async function checkLogin() {
    const credential = await checkAndGetCredential()
    // 没有登录，拉起 Web 登录
    if (_.isEmpty(credential)) {
        log.info('你还没有登录，请在控制台中授权登录')

        const res = await execWithLoading(() => login(), {
            startTip: '获取授权中...',
            successTip: '授权登录成功！'
        })

        const envId = res?.credential?.envId

        // 登录返回 envId，检查环境初始化
        if (envId) {
            const env = await getEnvInfo(envId)
            if (env.Status === ENV_STATUS.UNAVAILABLE) {
                await checkEnvAvaliable(envId)
            }
        }
    }
}
