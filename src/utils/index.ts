import fs from 'fs'
import archiver from 'archiver'
import readline from 'readline'
import { refreshTmpToken } from '../auth/auth'
import { configStore } from './configstore'
import { Credential, AuthSecret, SSH } from '../types'
import { ConfigItems } from '../constant'
import { CloudBaseError } from '../error'
export { printCliTable } from './cli-table'

export * from './uuid'
export * from './qcloud-request'
export * from './http-request'
export * from './output'
export * from './function-packer'

export async function zipDir(
    dirPath: string,
    outputPath: string,
    ignore?: string | string[]
) {
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
        // append files from a glob pattern
        archive.glob('**/*', {
            // 目标路径
            cwd: dirPath,
            ignore: ignore
        })
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
    throw new CloudBaseError('无有效身份信息，请使用 cloudbase login 登录')
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
