import portfinder from 'portfinder'
const PORT = 9012

// 获取本地可用端口
export async function getPort(): Promise<number> {
    const port: number = await portfinder.getPortPromise({
        port: PORT
    })
    return port
}
