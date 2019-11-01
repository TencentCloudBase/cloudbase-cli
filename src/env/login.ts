import crypto from 'crypto'
import { CloudService } from '../utils'
import { CloudBaseError } from '../error'

const publicRsaKey = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0ZLB0ZpWWFsHPnDDw++Nc2wI3
nl2uyOrIJ5FUfxt4GAmt1Faf5pgMxAnL9exEUrrUDUX8Ri1R0KyfnHQQwCvKt8T8
bgILIJe9UB8e9dvFqgqH2oA8Vqwi0YqDcvFLFJk2BJbm/0QYtZ563FumW8LEXAgu
UeHi/0OZN9vQ33jWMQIDAQAB
-----END PUBLIC KEY-----
`
function rsaEncrypt(data: string): string {
    const buffer = Buffer.from(data)
    const encrypted = crypto.publicEncrypt(
        {
            key: publicRsaKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        },
        buffer
    )
    return encrypted.toString('base64')
}

const tcbService = new CloudService('tcb', '2018-06-08')

// 拉取登录配置列表
export async function getLoginConfigList({ envId }) {
    const { ConfigList = [] }: any = await tcbService.request(
        'DescribeLoginConfigs',
        {
            EnvId: envId
        }
    )

    return ConfigList
}

// 创建登录方式
export async function createLoginConfig({
    envId,
    platform,
    appId,
    appSecret,
    status
}) {
    const validPlatform = ['WECHAT-OPEN', 'WECHAT-PUBLIC']
    if (!validPlatform.includes(platform)) {
        throw new CloudBaseError(
            `Invalid platform value: ${platform}. Now only support 'WECHAT-OPEN', 'WECHAT-PUBLIC'`
        )
    }

    await tcbService.request('CreateLoginConfig', {
        EnvId: envId,
        // 平台， “QQ" "WECHAT-OPEN" "WECHAT-PUBLIC"
        Platform: platform,
        PlatformId: appId,
        PlatformSecret: rsaEncrypt(appSecret),
        Status: status
    })
}

// 更新登录方式
export async function updateLoginConfig({
    configId,
    envId,
    status = 'ENABLE',
    appId = '',
    appSecret = ''
}) {
    const validStatus = ['ENABLE', 'DISABLE']
    if (!validStatus.includes(status)) {
        throw new CloudBaseError(
            `Invalid status value: ${status}. Only support 'ENABLE', 'DISABLE'`
        )
    }
    const params: any = {
        EnvId: envId,
        ConfigId: configId,
        Status: status
    }

    appId && (params.PlatformId = appId)
    appSecret && (params.PlatformSecret = rsaEncrypt(appSecret))

    await tcbService.request('UpdateLoginConfig', params)
}
