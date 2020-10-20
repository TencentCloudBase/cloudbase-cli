import _ from 'lodash'
import { authSupevisor } from '../utils'
import { ILoginOptions } from '../types'
import { Credential } from '@cloudbase/toolbox'

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
