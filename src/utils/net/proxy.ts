// 解析 Proxy 配置
export function getProxy(): string {
    const httpProxy = process.env.http_proxy || process.env.HTTP_PROXY
    const isTestMode = process.env.TCB_TEST_MODE
    return isTestMode ? process.env.TCB_TEST_PROXY || httpProxy : httpProxy
}
