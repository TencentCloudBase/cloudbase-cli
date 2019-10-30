import os from 'os'
import http, { Server, IncomingMessage, ServerResponse } from 'http'
import crypto from 'crypto'
import portfinder from 'portfinder'
import queryString from 'query-string'
import open from 'open'

import { Credential, AuthSecret } from '../types'
export { printCliTable } from './cli-table'
import { authStore } from './store'
import { ConfigItems } from '../constant'
import Logger from '../logger'
import { fetch, loadingFactory, getPlatformRelease } from '../utils'
import { CloudBaseError } from '../error'

const logger = new Logger('Auth')

const defaultPort = 9012
const CliAuthBaseUrl = 'https://console.cloud.tencent.com/tcb/auth'
const refreshTokenUrl = 'https://iaas.cloud.tencent.com/tcb_refresh'

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

// 获取 hostname 和平台信息
function getOSInfo() {
    const hostname = os.hostname()
    const platform = os.platform()
    const release = os.release()

    const platformRelease = getPlatformRelease(platform, release)

    return [hostname, platformRelease].join('/')
}

// MD5
function md5(str: string): string {
    const hash = crypto.createHash('md5')
    hash.update(str)
    return hash.digest('hex')
}

// 临时密钥过期后，进行续期
export async function refreshTmpToken(
    metaData: Credential & { isLogout?: boolean }
): Promise<Credential> {
    const mac = getMacAddress()
    const hash = md5(mac)
    metaData.hash = hash

    const res = await fetch(refreshTokenUrl, {
        method: 'POST',
        body: JSON.stringify(metaData),
        headers: { 'Content-Type': 'application/json' }
    })

    if (res.code !== 0) {
        throw new CloudBaseError(res.message, {
            code: res.code
        })
    }

    const { data: credential } = res
    return credential
}

// 获取 credentail 数据
export function getCredentialData(): Credential {
    return authStore.get(ConfigItems.credentail) as Credential
}

// 获取身份认证信息并校验、自动刷新
export async function getCredentialWithoutCheck(): Promise<AuthSecret> {
    const credential = getCredentialData()
    if (!credential) {
        return null
    }

    // 存在永久密钥
    if (credential.secretId && credential.secretKey) {
        const { secretId, secretKey } = credential
        return {
            secretId,
            secretKey
        }
    }

    // 存在临时密钥信息
    if (credential.refreshToken) {
        // 临时密钥在 2 小时有效期内，可以直接使用
        if (Date.now() < Number(credential.tmpExpired)) {
            const { tmpSecretId, tmpSecretKey, tmpToken } = credential
            return {
                secretId: tmpSecretId,
                secretKey: tmpSecretKey,
                token: tmpToken
            }
        } else if (Date.now() < Number(credential.expired)) {
            // 临时密钥超过两小时有效期，但在 1 个月 refresh 有效期内，刷新临时密钥
            const refreshCredential = await refreshTmpToken(credential)
            // 存储
            authStore.set(ConfigItems.credentail, refreshCredential)
            const { tmpSecretId, tmpSecretKey, tmpToken } = refreshCredential

            return {
                secretId: tmpSecretId,
                secretKey: tmpSecretKey,
                token: tmpToken
            }
        }
    }

    return null
}

// 创建本地 Web 服务器，接受 Web 控制台传入的信息
async function createLocalServer(): Promise<ServerRes> {
    return new Promise(async (resolve, reject) => {
        const server = http.createServer()
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
        const loading = loadingFactory()
        loading.start('正在打开腾讯云获取授权')

        try {
            const { server, port } = await createLocalServer()
            const mac = getMacAddress()
            const os = getOSInfo()
            const hash = md5(mac)

            const CliAuthUrl = `${CliAuthBaseUrl}?port=${port}&hash=${hash}&mac=${mac}&os=${os}`
            await open(CliAuthUrl)

            loading.succeed(
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
            loading.fail('获取授权失败！')
            reject(err)
        }
    })
}
