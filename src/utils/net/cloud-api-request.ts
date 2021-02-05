import { getCredentialWithoutCheck, getRegion, Credential, getProxy } from '@cloudbase/toolbox'
import { CloudApiService as _CloudApiService } from '@cloudbase/cloud-api'
import { CloudBaseError } from '../../error'
import { REQUEST_TIMEOUT } from '../../constant'

let commonCredential: Credential

// token 将在 n 分钟内过期
const isTokenExpired = (credential: Credential, gap = 120) =>
    credential.accessTokenExpired && Number(credential.accessTokenExpired) < Date.now() + gap * 1000

export class CloudApiService {
    // 缓存请求实例
    static serviceCacheMap: Record<string, CloudApiService> = {}

    // 单例模式
    static getInstance(service: string) {
        if (CloudApiService.serviceCacheMap?.[service]) {
            return CloudApiService.serviceCacheMap[service]
        }
        const apiService = new CloudApiService(service)
        CloudApiService.serviceCacheMap[service] = apiService
        return apiService
    }

    region: string
    apiService: _CloudApiService

    constructor(service: string, baseParams?: Record<string, any>, version = '') {
        // 初始化 API 实例
        this.apiService = new _CloudApiService({
            service,
            version,
            baseParams,
            proxy: getProxy(),
            timeout: REQUEST_TIMEOUT,
            getCredential: async () => {
                // 存在未过期的 token
                if (commonCredential?.secretId && !isTokenExpired(commonCredential)) {
                    return commonCredential
                }

                const credential = await getCredentialWithoutCheck()
                if (!credential) {
                    throw new CloudBaseError('无有效身份信息，请使用 cloudbase login 登录')
                }

                commonCredential = credential

                return {
                    ...credential,
                    tokenExpired: Number(credential.accessTokenExpired)
                }
            }
        })
    }

    async request(action: string, data: Record<string, any> = {}, method: 'POST' | 'GET' = 'POST') {
        const region = this.region || (await getRegion())
        return this.apiService.request({ action, data, method, region })
    }
}
