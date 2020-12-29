import { getCredentialWithoutCheck, getRegion } from '@cloudbase/toolbox'
import { CloudApiService as _CloudApiService, Credential } from '@cloudbase/cloud-api'
import { CloudBaseError } from '../error'
import { getProxy } from './tools'
import { REQUEST_TIMEOUT } from '../constant'

let commonCredential: Credential

export class CloudApiService {
    // 缓存请求实例
    static serviceCacheMap: Record<string, CloudApiService> = {}

    static getInstance(service: string) {
        if (CloudApiService.serviceCacheMap?.[service]) {
            return CloudApiService.serviceCacheMap[service]
        }
        const apiService = new CloudApiService(service)
        CloudApiService.serviceCacheMap[service] = apiService
        return apiService
    }

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
                if (commonCredential?.secretId) {
                    return commonCredential
                }

                const credential = await getCredentialWithoutCheck()
                if (!credential) {
                    throw new CloudBaseError('无有效身份信息，请使用 cloudbase login 登录')
                }
                commonCredential = credential
                return credential
            }
        })
    }

    async request(action: string, data: Record<string, any> = {}, method: 'POST' | 'GET' = 'POST') {
        const region = await getRegion()
        return this.apiService.request({ action, data, method, region })
    }
}
