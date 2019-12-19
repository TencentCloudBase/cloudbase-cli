import tencentcloud from '../../deps/tencentcloud-sdk-nodejs'
import { CloudBaseError } from '../error'
import { AuthSecret } from '../types'
import { getCredentialWithoutCheck } from './auth'

function isObject(x) {
    return typeof x === 'object' && !Array.isArray(x) && x !== null
}

// 移除对象中的空值
function deepRemoveVoid(obj) {
    if (Array.isArray(obj)) {
        return obj.map(deepRemoveVoid)
    } else if (isObject(obj)) {
        let result = {}
        /* eslint-disable guard-for-in */
        for (let key in obj) {
            const value = obj[key]
            if (typeof value !== 'undefined' && value !== null) {
                result[key] = deepRemoveVoid(value)
            }
        }
        return result
    } else {
        return obj
    }
}

export class CloudService {
    version: string
    service: string
    sdkCredential: Record<string, string>
    baseParams: Record<string, string>

    constructor(service: string, version: string, baseParams?: Record<string, string>) {
        this.service = service
        // 将 2018-08-06 转换成 v20180806 形式
        this.version = `v${version.split('-').join('')}`
        if (!tencentcloud[service][this.version]) {
            throw new CloudBaseError('CloudService: Service Not Found')
        }
        this.baseParams = baseParams || {}
    }

    async request(interfaceName: string, inParams: any = {}): Promise<any> {
        const { Credential, HttpProfile } = tencentcloud.common

        // 缓存 secret 信息
        if (!this.sdkCredential || !this.sdkCredential.secretId) {
            const credential: AuthSecret = await getCredentialWithoutCheck()

            if (!credential) {
                throw new CloudBaseError('无有效身份信息，请使用 cloudbase login 登录')
            }

            const { secretId, secretKey, token } = credential
            this.sdkCredential = new Credential(secretId, secretKey, token)
        }

        const Client = tencentcloud[this.service][this.version].Client
        const models = tencentcloud[this.service][this.version].Models

        let client = new Client(this.sdkCredential, 'ap-shanghai', {
            signMethod: 'TC3-HMAC-SHA256',
            httpProfile: new HttpProfile()
        })

        let req = new models[`${interfaceName}Request`]()

        // 移除空值

        const params = deepRemoveVoid(inParams)

        const _params = {
            Region: 'ap-shanghai',
            ...this.baseParams,
            ...params
        }

        req.deserialize(_params)

        return new Promise((resolve, reject) => {
            client[interfaceName](req, (err, response) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(response)
            })
        })
    }

    setCredential(secretId: string, secretKey: string, token: string) {
        const { Credential } = tencentcloud.common
        this.sdkCredential = new Credential(secretId, secretKey, token)
    }
}
