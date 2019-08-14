import fetch from 'node-fetch'
import crypto from 'crypto'
import QueryString from 'query-string'
import HttpsProxyAgent from 'https-proxy-agent'
import { TcbError } from '../error'
import { getCredential } from './index'
import { AuthSecret } from '../types'

type HexBase64Latin1Encoding = 'latin1' | 'hex' | 'base64'

function sha256(
    message: string,
    secret: string = '',
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

function sign3({
    method = 'POST',
    url = '',
    payload,
    timestamp,
    service,
    secretId,
    secretKey
}) {
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

    const payloadHash = payload ? getHash(JSON.stringify(payload)) : getHash('')

    const canonicalRequest =
        method +
        '\n' +
        path +
        '\n' +
        querystring +
        '\n' +
        headers +
        '\n' +
        signedHeaders +
        '\n' +
        payloadHash

    const date = getDate(timestamp)

    const StringToSign =
        'TC3-HMAC-SHA256' +
        '\n' +
        timestamp +
        '\n' +
        `${date}/${service}/tc3_request` +
        '\n' +
        getHash(canonicalRequest)

    const kDate = sha256(date, 'TC3' + secretKey)
    const kService = sha256(service, kDate)
    const kSigning = sha256('tc3_request', kService)
    const signature = sha256(StringToSign, kSigning, 'hex')

    return `TC3-HMAC-SHA256 Credential=${secretId}/${date}/${service}/tc3_request, SignedHeaders=${signedHeaders}, Signature=${signature}`
}

async function requestWithSign3({
    method,
    url,
    data,
    service,
    action,
    secretId,
    secretKey,
    token,
    timeout = 60000,
    version
}) {
    // data 中可能带有 readStream，由于需要计算整个 body 的 hash，
    // 所以这里把 readStream 转为 Buffer
    // await convertReadStreamToBuffer(data)

    const timestamp = Math.floor(Date.now() / 1000)
    method = method.toUpperCase()

    let payload = ''
    if (method === 'GET') {
        url += '?' + QueryString.stringify(data)
    }
    if (method === 'POST') {
        payload = data
    }

    const config: any = {
        method,
        timeout,
        headers: {
            Host: new URL(url).host,
            'X-TC-Action': action,
            'X-TC-Region': 'ap-shanghai',
            'X-TC-Timestamp': timestamp,
            'X-TC-Version': version
        }
    }

    if (token) {
        config.headers['X-TC-Token'] = token
    }

    if (method === 'GET') {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    if (method === 'POST') {
        config.body = JSON.stringify(data)
        config.headers['Content-Type'] = 'application/json'
    }

    const signature = sign3({
        method,
        url,
        payload,
        timestamp,
        service,
        secretId,
        secretKey
    })

    config.headers['Authorization'] = signature

    // 代理
    if (!config.agent && process.env.http_proxy) {
        config.agent = new HttpsProxyAgent(process.env.http_proxy)
    }

    const res = await fetch(url, config)
    return res
}

export class BaseHTTPService {
    service: string
    version: string

    constructor(service: string, version) {
        this.service = service
        this.version = version
    }

    async request(
        action: string,
        data: Record<string, any> = {},
        method: string = 'POST'
    ) {
        const url = `https://${this.service}.tencentcloudapi.com`

        const credential: AuthSecret = await getCredential()
        const { secretId, secretKey, token } = credential

        try {
            const res = await requestWithSign3({
                url,
                action,
                data,
                method,
                secretId,
                secretKey,
                token: token,
                service: this.service,
                version: this.version
            })

            if (res.status !== 200) {
                const tcError = new TcbError(res.statusText, {
                    code: res.status
                })
                throw tcError
            } else {
                // res.json 返回值为 Promise
                const data: Record<string, any> = await res.json()

                if (data.Response.Error) {
                    const tcError = new TcbError(data.Response.Error.Message, {
                        requestId: data.Response.RequestId,
                        code: data.Response.Error.Code
                    })
                    throw tcError
                } else {
                    return data.Response
                }
            }
        } catch (e) {
            throw new TcbError(e.message, {
                code: e.code
            })
        }
    }
}
