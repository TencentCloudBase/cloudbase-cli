import fs from 'fs'
import path from 'path'
import archiver from 'archiver'
import readline from 'readline'
import tencentcloud from '../../deps/tencentcloud-sdk-nodejs'
import { refreshTmpToken } from '../auth/auth'
import { configStore } from './configstore'
import { IConfig, Credential, AuthSecret, SSH } from '../types'
import { ConfigItems } from '../constant'
import { TcbError } from '../error'

export { printCliTable } from './cli-table'
export { guid6 } from './uuid'

export async function zipDir(dirPath, outputPath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputPath)
        const archive = archiver('zip')

        output.on('close', function() {
            resolve({
                zipPath: outputPath,
                size: Math.ceil(archive.pointer() / 1024)
            })
        })

        archive.on('error', function(err) {
            reject(err)
        })

        archive.pipe(output)
        archive.directory(dirPath, '')
        archive.finalize()
    })
}

export function askForInput(question): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer)
            rl.close()
        })
    })
}

export function callCloudApi(secretId, secretKey) {
    const CvmClient = tencentcloud.cvm.v20170312.Client
    const models = tencentcloud.cvm.v20170312.Models
    const Credential = tencentcloud.common.Credential
    let cred = new Credential(secretId, secretKey)
    let client = new CvmClient(cred, 'ap-shanghai')
    let req = new models.DescribeZonesRequest()

    return new Promise((resolve, reject) => {
        client.DescribeZones(req, function(err, response) {
            if (err) {
                reject(err)
                return
            }
            resolve(response)
        })
    })
}

export function getCredentialConfig(): Credential {
    return configStore.get(ConfigItems.credentail) as Credential
}

// 获取身份认证信息并校验、自动刷新
export async function getCredential(): Promise<AuthSecret> {
    const credential = getCredentialConfig()

    // 存在永久密钥
    if (credential.secretId && credential.secretKey) {
        return {
            secretId: credential.secretId,
            secretKey: credential.secretKey
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
            configStore.set(ConfigItems.credentail, refreshCredential)
            const { tmpSecretId, tmpSecretKey, tmpToken } = refreshCredential
            return {
                secretId: tmpSecretId,
                secretKey: tmpSecretKey,
                token: tmpToken
            }
        }
    }

    // 无有效身份信息，报错
    throw new TcbError('无有效身份信息，请使用 tcb login 登录')
}

export function getSSHConfig(): SSH {
    return (configStore.get(ConfigItems.ssh) || {}) as SSH
}

export async function getSSH(): Promise<SSH> {
    let sshConfig = getSSHConfig()
    if (
        !sshConfig.host ||
        !sshConfig.port ||
        !sshConfig.username ||
        !sshConfig.password
    ) {
        let { host, port = '22', username = 'root', password } = sshConfig
        host =
            (await askForInput(
                `请输入服务器 host${host ? `(${host})` : ''}:`
            )) || host
        port = (await askForInput(`请输入服务器 ssh 端口(${port}):`)) || port
        username = (await askForInput(`请输入用户名(${username}):`)) || username
        password = await askForInput(
            `请输入登录密码${password ? `(${password})` : ''}:`
        )
        let config: SSH = {
            host,
            port,
            username,
            password
        }
        configStore.set(ConfigItems.ssh, config)
        return config
    }
    return sshConfig
}

// 获取 tcb 存储在本地的配置
export function getTcbConfig(): Promise<IConfig> {
    return configStore.all()
}

export function parseCommandArgs(
    args: string[]
): Record<string, string | string[]> {
    const parsed = {}

    args.forEach(arg => {
        const parts = arg.split('=')
        const key = parts[0].toLowerCase()
        if (parts.length !== 2) {
            throw new TcbError(`参数 ${arg} 异常，必需为 key=val 形式`)
        }

        const val = parts[1]
        // 可用做判断，不能赋值
        const source = parsed[key]
        if (!source) {
            parsed[key] = val
        } else if (Array.isArray(source)) {
            parsed[key].push(val)
        } else {
            parsed[key] = [parsed[key], val]
        }
    })

    return parsed
}

// 找到 tcbrc 配置文件
export async function resolveTcbrcConfig() {
    const tcbrcPath = path.join(process.cwd(), 'tcbrc.json')
    if (!fs.existsSync(tcbrcPath)) {
        return {}
    }
    const tcbrc = await import(tcbrcPath)
    if (!tcbrc.envId) {
        throw new TcbError('配置文件无效，配置文件必须包含含环境 Id')
    }
    return tcbrc
}

// 从命令行和配置文件中获取 envId
export async function getEnvId(envId: string): Promise<string> {
    const tcbrc = await resolveTcbrcConfig()
    // 命令行 envId 可以覆盖配置文件 envId
    const assignEnvId = tcbrc.envId || envId
    if (!assignEnvId) {
        throw new TcbError(
            '未识别到有效的环境 Id 变量，请在项目根目录进行操作或通过 envId 参数指定环境 Id'
        )
    }
    return assignEnvId
}
