import _fetch, { RequestInit } from 'node-fetch'
import HttpsProxyAgent from 'https-proxy-agent'
import { CloudBaseError } from '../error'
import { getProxy } from './tools'
import { REQUEST_TIMEOUT } from '../constant'

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
        const res = await _fetch(url, config)
        text = await res.text()
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
        const res = await _fetch(url, config)
        text = await res.text()
        json = JSON.parse(text)
    } catch (e) {
        handleTimeout(e)
        json = text
    }
    return json
}

export async function fetchStream(url, config: Record<string, any> = {}) {
    const proxy = getProxy()
    if (proxy) {
        config.agent = new HttpsProxyAgent(proxy)
    }

    config.timeout = REQUEST_TIMEOUT

    try {
        const res = await _fetch(url, config)
        return res
    } catch (e) {
        handleTimeout(e)
    }
}
