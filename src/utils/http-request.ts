import _fetch from 'node-fetch'
import HttpsProxyAgent from 'https-proxy-agent'

// 使用 fetch + 代理
export async function fetch(url: string, config: Record<string, any> = {}) {
    const proxy = process.env.http_proxy || process.env.HTTP_PROXY
    if (proxy) {
        config.agent = new HttpsProxyAgent(proxy)
    }
    const res = await _fetch(url, config)
    return res.json()
}

export async function fetchStream(url, config: Record<string, any> = {}) {
    const proxy = process.env.http_proxy || process.env.HTTP_PROXY
    if (proxy) {
        config.agent = new HttpsProxyAgent(proxy)
    }

    return _fetch(url, config)
}
