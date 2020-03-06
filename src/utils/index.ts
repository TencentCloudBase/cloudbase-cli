import readline from 'readline'
import { authStore } from './store'
import { SSH } from '../types'
import { ConfigItems } from '../constant'
export { printHorizontalTable } from './cli-table'

export * from './fs'
export * from './tools'
export * from './output'
export * from './config'
export * from './platform'
export * from './reporter'
export * from './cli-table'
export * from './progress-bar'
export * from './function-packer'
export * from './manager-service'

export * from './web-auth'
export * from './credential'
export * from './store'
export * from './cloud'
export * from './get-auth'
export * from './http-request'
export * from './cloud-api-request'

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

export async function getSSHConfig(): Promise<SSH> {
    return (authStore.get(ConfigItems.ssh) || {}) as SSH
}

export async function getSSH(): Promise<SSH> {
    let sshConfig = await getSSHConfig()
    if (!sshConfig.host || !sshConfig.port || !sshConfig.username || !sshConfig.password) {
        let { host, port = '22', username = 'root', password } = sshConfig
        host = (await askForInput(`请输入服务器 host${host ? `(${host})` : ''}:`)) || host
        port = (await askForInput(`请输入服务器 ssh 端口(${port}):`)) || port
        username = (await askForInput(`请输入用户名(${username}):`)) || username
        password = await askForInput(`请输入登录密码${password ? `(${password})` : ''}:`)
        let config: SSH = {
            host,
            port,
            username,
            password
        }
        await authStore.set(ConfigItems.ssh, config)
        return config
    }
    return sshConfig
}
