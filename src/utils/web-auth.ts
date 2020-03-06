import fs from 'fs'
import path from 'path'
import http, { Server, IncomingMessage, ServerResponse } from 'http'
import queryString from 'query-string'
import open from 'open'

import { md5 } from './tools'
import { loadingFactory } from './output'
import { CloudApiService } from './cloud-api-request'
import { getMacAddress, getOSInfo, getPort } from './platform'

import Logger from '../logger'
import { CloudBaseError } from '../error'
import { Credential, ILoginOptions } from '../types'


const logger = new Logger('Auth')
const tcbService = new CloudApiService('tcb')

const CliAuthBaseUrl = 'https://console.cloud.tencent.com/tcb/auth'

interface ServerRes {
    server: Server
    port: number
}

// 创建本地 Web 服务器，接受 Web 控制台传入的信息
async function createLocalServer(): Promise<ServerRes> {
    const server = http.createServer()
    const port = await getPort()
    return new Promise((resolve, reject) => {
        server.listen(port, () => {
            resolve({
                port,
                server
            })
        })
    })
}

function respondWithFile(req, res, statusCode, filename) {
    return new Promise(function(resolve, reject) {
        fs.readFile(path.join(__dirname, '../../templates', filename), function(err, response) {
            if (err) {
                return reject(err)
            }
            res.writeHead(statusCode, {
                'Content-Length': response.length,
                'Content-Type': 'text/html'
            })
            res.end(response)
            req.socket.destroy()
            return resolve()
        })
    })
}

// 调用 env:list 接口，检查密钥是否有效
export async function checkAuth(credential: Credential) {
    const { tmpSecretId, tmpSecretKey, tmpToken } = credential
    tcbService.setCredential(tmpSecretId, tmpSecretKey, tmpToken)
    return tcbService.request('DescribeEnvs')
}

// 打开云开发控制台，获取授权
export async function getAuthTokenFromWeb(options: ILoginOptions): Promise<Credential> {
    const { getAuthUrl } = options
    const loading = loadingFactory()
    loading.start('正在打开腾讯云获取授权')

    try {
        const { server, port } = await createLocalServer()
        const mac = await getMacAddress()
        const os = getOSInfo()
        const hash = md5(mac)

        if (!mac) {
            throw new CloudBaseError('获取 Mac 地址失败，无法登录！')
        }

        let cliAuthUrl = `${CliAuthBaseUrl}?port=${port}&hash=${hash}&mac=${mac}&os=${os}`

        if (getAuthUrl) {
            try {
                cliAuthUrl = getAuthUrl(
                    `${CliAuthBaseUrl}?port=${port}&hash=${hash}&mac=${mac}&os=${os}`
                )
            } catch (error) {
                // 忽略错误
            }
        }

        await open(cliAuthUrl)

        loading.succeed('已打开云开发 CLI 授权页面，请在云开发 CLI 授权页面同意授权')

        return new Promise(resolve => {
            server.on('request', (req: IncomingMessage, res: ServerResponse) => {
                const { url } = req
                const { query } = queryString.parseUrl(url)

                // 响应 HTML 文件
                if (query?.html) {
                    return checkAuth(query as Credential)
                        .then(() => {
                            return respondWithFile(req, res, 200, 'html/loginSuccess.html')
                        })
                        .then(() => {
                            server.close()
                            resolve(query as Credential)
                        })
                        .catch(e => {
                            server.close()
                            return respondWithFile(req, res, 502, 'html/loginFail.html')
                        })
                }

                // CORS 响应普通文本
                res.writeHead(200, {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Content-Type': 'text/plain',
                    // 立即关闭 http 连接
                    Connection: 'close'
                })

                res.end()

                // 防止接受到异常请求导致本地服务关闭
                if (query?.tmpToken) {
                    server.close()
                }

                resolve(query as Credential)
            })
        })
    } catch (err) {
        logger.error(err.message)
        loading.fail('获取授权失败！')
        throw err
    }
}
