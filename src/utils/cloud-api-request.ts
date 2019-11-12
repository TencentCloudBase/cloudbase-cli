import crypto from 'crypto'
import { URL } from 'url'
import QueryString from 'query-string'
import { CloudBaseError } from '../error'
import { fetch } from './http-request'
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
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key]
                if (typeof value !== 'undefined' && value !== null) {
                    result[key] = deepRemoveVoid(value)
                }
            }
        }
        return result
    } else {
        return obj
    }
}

type HexBase64Latin1Encoding = 'latin1' | 'hex' | 'base64'

function sha256(
    message: string,
    secret: string,
    encoding?: HexBase64Latin1Encoding
) {
    const hmac = crypto.createHmac('sha256', secret)
    return hmac.update(message).digest(encoding)
}

function getHash(message: string): string {
    const hash = crypto.createHash('sha256')
    return hash.update(message).digest('hex')
}

function getDate(timestamp: number): string {
    const date = new Date(timestamp * 1000)
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    return `${year}-${month}-${day}`
}

export class CloudApiService {
    service: string
    version: string
    url: string
    action: string
    method: 'POST' | 'GET'
    secretId: string //
    secretKey: string //
    token: string //
    timeout: number
    data: Record<string, any>
    payload: Record<string, any>
    baseParams: Record<string, any>

    constructor(
        service: string,
        version: string,
        baseParams?: Record<string, any>
    ) {
        this.service = service
        this.version = version
        this.timeout = 60000
        this.baseParams = baseParams || {}
    }

    getUrl() {
        const urlMap = {
            tcb: 'https://tcb.tencentcloudapi.com',
            scf: 'https://scf.tencentcloudapi.com',
            flexdb: 'https://flexdb.ap-shanghai.tencentcloudapi.com'
        }
        return urlMap[this.service]
    }

    async request(
        action: string,
        data: Record<string, any> = {},
        method: 'POST' | 'GET' = 'POST'
    ) {
        this.action = action
        this.data = deepRemoveVoid({ ...data, ...this.baseParams })
        this.method = method

        this.url = this.getUrl()

        const { secretId, secretKey, token } = await getCredentialWithoutCheck()

        this.secretId = secretId
        this.secretKey = secretKey
        this.token = token

        try {
            const data: Record<string, any> = await this.requestWithSign()

            if (data.Response.Error) {
                const tcError = new CloudBaseError(
                    data.Response.Error.Message,
                    {
                        requestId: data.Response.RequestId,
                        code: data.Response.Error.Code
                    }
                )
                throw tcError
            } else {
                return data.Response
            }
        } catch (e) {
            // throw e
            throw new CloudBaseError(e.message, {
                action,
                code: e.code
            })
        }
    }

    async requestWithSign() {
        // data 中可能带有 readStream，由于需要计算整个 body 的 hash，
        // 所以这里把 readStream 转为 Buffer
        // await convertReadStreamToBuffer(data)
        const timestamp = Math.floor(Date.now() / 1000)

        const { method, timeout, data = {} } = this

        if (method === 'GET') {
            this.url += '?' + QueryString.stringify(data)
        }

        if (method === 'POST') {
            this.payload = data
        }

        const config: any = {
            method,
            timeout,
            headers: {
                Host: new URL(this.url).host,
                'X-TC-Action': this.action,
                'X-TC-Region': 'ap-shanghai',
                'X-TC-Timestamp': timestamp,
                'X-TC-Version': this.version
            }
        }

        if (this.token) {
            config.headers['X-TC-Token'] = this.token
        }

        if (method === 'GET') {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }
        if (method === 'POST') {
            config.body = JSON.stringify(data)
            config.headers['Content-Type'] = 'application/json'
        }

        const sign = this.getRequestSign(timestamp)

        config.headers['Authorization'] = sign

        return fetch(this.url, config)
    }

    getRequestSign(timestamp: number) {
        const { method = 'POST', url, service, secretId, secretKey } = this
        const urlObj = new URL(url)

        // 通用头部
        let headers = ''
        const signedHeaders = 'content-type;host'
        if (method === 'GET') {
            headers = 'content-type:application/x-www-form-urlencoded\n'
        } else if (method === 'POST') {
            headers = 'content-type:application/json\n'
        }

        headers += `host:${urlObj.hostname}\n`

        const path = urlObj.pathname
        const querystring = urlObj.search.slice(1)

        const payloadHash = this.payload
            ? getHash(JSON.stringify(this.payload))
            : getHash('')

        const canonicalRequest = `${method}\n${path}\n${querystring}\n${headers}\n${signedHeaders}\n${payloadHash}`

        const date = getDate(timestamp)

        const StringToSign = `TC3-HMAC-SHA256\n${timestamp}\n${date}/${service}/tc3_request\n${getHash(
            canonicalRequest
        )}`

        const kDate = sha256(date, `TC3${secretKey}`)
        const kService = sha256(service, kDate)
        const kSigning = sha256('tc3_request', kService)
        const signature = sha256(StringToSign, kSigning, 'hex')

        return `TC3-HMAC-SHA256 Credential=${secretId}/${date}/${service}/tc3_request, SignedHeaders=${signedHeaders}, Signature=${signature}`
    }
}
