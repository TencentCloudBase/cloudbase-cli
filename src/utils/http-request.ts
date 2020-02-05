import _fetch, { RequestInit } from 'node-fetch'
import HttpsProxyAgent from 'https-proxy-agent'
import { getProxy } from './tools'

// 使用 fetch + 代理
export async function fetch(url: string, config?: RequestInit) {
    const proxy = getProxy()
    if (proxy) {
        config.agent = new HttpsProxyAgent(proxy)
    }

    const res = await _fetch(url, config)
    // const text = await
    const text = await res.text()
    let json
    try {
        json = JSON.parse(text)
    } catch (e) {
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

    const res = await _fetch(url, config)
    // const text = await
    const text = await res.text()
    let json
    try {
        json = JSON.parse(text)
    } catch (e) {
        json = text
    }
    return json
}

export async function fetchStream(url, config: Record<string, any> = {}) {
    const proxy = getProxy()
    if (proxy) {
        config.agent = new HttpsProxyAgent(proxy)
    }

    return _fetch(url, config)
}
