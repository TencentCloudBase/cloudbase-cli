import _fetch, { RequestInit } from 'node-fetch'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { REQUEST_TIMEOUT } from '../../constant'
import { CloudBaseError } from '../../error'
import { getProxy } from './proxy'
import { debugLogger } from '../debug-logger'

function handleTimeout(e) {
    if (e.type === 'request-timeout') {
        throw new CloudBaseError(
            '请求超时，请检查你的网络，如果终端无法直接访问公网，请设置终端 HTTP 请求代理！'
        )
    } else {
        // 其他错误，抛出
        throw e
    }
}

type fetchType = Parameters<typeof _fetch>
type fetchReturnType = ReturnType<typeof _fetch>
type UnPromisify<T> = T extends PromiseLike<infer U> ? U : T;
type fetchReturnTypeExtracted = UnPromisify<fetchReturnType>

/**
 * 
 * @description 使用 debug logger 包装 fetch 打印请求和响应信息
 * @param useTextTransform 是否使用 `text()` 解析响应流并返回解析后结果
 * @param args `fetch`方法入参
 * @returns `Response`或`string`，响应流或使用 `text()` 解析后的响应结果
 */
async function fetchWithDebugLogger(useTextTransform: boolean, ...args: fetchType): Promise<string | fetchReturnTypeExtracted> {
    const startTime = new Date()
    const rawRes = await _fetch(...args)
    const res = useTextTransform ? await rawRes.text() : rawRes
    const endTime = new Date()
    debugLogger(args, res, startTime, endTime)
    return res
}

// 使用 fetch + 代理
export async function fetch(url: string, config: RequestInit = {}) {
    const proxy = getProxy()
    if (proxy) {
        config.agent = new HttpsProxyAgent(proxy)
    }

    config.timeout = REQUEST_TIMEOUT

    let json
    let text
    try {
        const res = await fetchWithDebugLogger(true, url, config)
        text = res
        json = JSON.parse(text)
    } catch (e) {
        handleTimeout(e)
        json = text
    }
    return json
}

// 使用 fetch + 代理
export async function postFetch(url: string, data?: Record<string, any>) {
    const proxy = getProxy()
    const config: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    if (proxy) {
        config.agent = new HttpsProxyAgent(proxy)
    }

    config.timeout = REQUEST_TIMEOUT

    let json
    let text
    try {
        const res = await fetchWithDebugLogger(true, url, config)
        text = res
        json = JSON.parse(text)
    } catch (e) {
        handleTimeout(e)
        json = text
    }
    return json
}

export async function fetchStream(url, config: Record<string, any> = {}): Promise<fetchReturnTypeExtracted> {
    const proxy = getProxy()
    if (proxy) {
        config.agent = new HttpsProxyAgent(proxy)
    }

    config.timeout = REQUEST_TIMEOUT

    try {
        const res = await fetchWithDebugLogger(false, url, config) as fetchReturnTypeExtracted
        return res
    } catch (e) {
        handleTimeout(e)
    }
}
