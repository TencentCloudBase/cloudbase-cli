import { createServer, IncomingMessage, ServerResponse, Server } from 'http'
import os from 'os'
import portfinder from 'portfinder'
import queryString from 'query-string'
import open from 'open'
import ora from 'ora'
import request from 'request'
import { createHash } from 'crypto'
import Logger from '../logger'
import { Credential } from '../types'

const logger = new Logger('Auth')

const defaultPort = 9012
const CliAuthBaseUrl = 'https://console.cloud.tencent.com/tcb/auth'
const refreshTokenUrl = 'https://iaas.cloud.tencent.com/tcb_refresh'
// const refreshTokenUrl = 'http://127.0.0.1:1984/tcb_refresh'

interface ServerRes {
    server: Server
    port: number
}

// 获取本地可用端口
async function getPort(): Promise<number> {
    const port: number = await portfinder.getPortPromise({
        port: defaultPort
    })
    return port
}

// 获取本机 Mac 地址
function getMacAddress(): string {
    const networkInterfaces = os.networkInterfaces()
    const options = ['eth0', 'eth1', 'en0', 'en1']
    let netInterface: os.NetworkInterfaceInfo[] = []
    options.some(key => {
        if (networkInterfaces[key]) {
            netInterface = networkInterfaces[key]
            return true
        }
    })
    const mac: string = (netInterface.length && netInterface[0].mac) || ''
    return mac
}

// MD5
function md5(str: string): string {
    const hash = createHash('md5')
    hash.update(str)
    return hash.digest('hex')
}

async function createLocalServer(): Promise<ServerRes> {
    return new Promise(async (resolve, reject) => {
        const server = createServer()
        try {
            const port = await getPort()
            server.listen(port, () => {
                resolve({
                    port,
                    server
                })
            })
        } catch (err) {
            reject(err)
        }
    })
}

// 打开云开发控制台，获取授权
export async function getAuthTokenFromWeb(): Promise<Credential> {
    return new Promise(async (resolve, reject) => {
        const authSpinner = ora('正在打开腾讯云获取授权').start()

        try {
            const { server, port } = await createLocalServer()
            const mac = getMacAddress()
            const hash = md5(mac)
            const CliAuthUrl = `${CliAuthBaseUrl}?port=${port}&hash=${hash}`
            await open(CliAuthUrl)

            authSpinner.succeed(
                '已打开云开发 CLI 授权页面，请在云开发 CLI 授权页面同意授权！'
            )

            server.on(
                'request',
                (req: IncomingMessage, res: ServerResponse) => {
                    const { url } = req
                    const { query } = queryString.parseUrl(url)

                    // CORS
                    res.writeHead(200, {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'text/plain',
                        // 立即关闭 http 连接
                        Connection: 'close'
                    })

                    res.end('ok')

                    // 防止接受到异常请求导致本地服务关闭
                    if (query && query.tmpToken) {
                        server.close()
                    }

                    resolve(query as Credential)
                }
            )
        } catch (err) {
            logger.error(err.message)
            authSpinner.fail('获取授权失败！')
            reject(err)
        }
    })
}

// 临时密钥过期后，进行续期
export async function refreshTmpToken(
    metaData: Credential
): Promise<Credential> {
    const mac = getMacAddress()
    const hash = md5(mac)
    metaData.hash = hash

    return new Promise((resolve, reject) => {
        request(
            {
                url: refreshTokenUrl,
                method: 'POST',
                json: metaData
            },
            (err, res) => {
                if (err) {
                    reject(err)
                    return
                }
                if (res.body.code !== 0) {
                    reject(new Error(res.body.message))
                    return
                }
                const { data: credential } = res.body
                resolve(credential)
            }
        )
    })
}
