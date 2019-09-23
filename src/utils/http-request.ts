import _fetch from 'node-fetch'
import HttpsProxyAgent from 'https-proxy-agent'

// 使用 fetch + 代理
export async function fetch(url: string, config: Record<string, any> = {}) {
    if (process.env.http_proxy) {
        config.agent = new HttpsProxyAgent(process.env.http_proxy)
    }
    const res = await _fetch(url, config)
    return res.json()
}

export async function fetchStream(url, config: Record<string, any> = {}) {
    if (process.env.http_proxy) {
        config.agent = new HttpsProxyAgent(process.env.http_proxy)
    }

    return _fetch(url, config)
}
