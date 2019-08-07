import program from 'commander'
import fs from 'fs'
import path from 'path'
import fse from 'fs-extra'
import { NodeController } from '../controller'
import { NodeDeploy } from '../deploy'
import { TcbError } from '../error'
import { getCredential, resolveTcbrcConfig, getSSH } from '../utils'

function checkServers(servers) {
    const names = {}
    servers.forEach(server => {
        if (!server.name) {
            throw new TcbError(`Every server must have a name.`)
        } else if (!server.path) {
            throw new TcbError('未指定发布目录')
        } else if (server.type != 'node') {
            throw new TcbError(`Unsupported deploy type: "${server.type}"`)
        } else if (names[server.name]) {
            throw new TcbError(`Duplicated deploy name: "${server.name}"`)
        }
        names[server.name] = true
    })
}

async function getServers(
    name: string
): Promise<{ name: string; path: string; type: string }[]> {
    const config = await resolveTcbrcConfig()
    if (!config.servers || !Array.isArray(config.servers)) {
        throw new Error('服务配置错误')
    }

    let { servers } = config

    checkServers(servers)
    return name ? servers.filter(d => d.name === name) : servers
}

program
    .command('node:deploy [name]')
    .description('部署 node 服务')
    .action(async function(name: string) {
        const servers = await getServers(name)
        const credential = await getCredential()
        const sshConfig = await getSSH()

        servers.forEach(async server => {
            if (!server.path) {
                throw new TcbError('未指定发布目录')
            }
            await new NodeDeploy({
                ...sshConfig,
                ...server,
                ...credential
            }).deploy()
            return
        })
    })

program
    .command('node:log <name>')
    .description('查看日志')
    .option('-n <n>', '输出日志的行数')
    .action(async function(name, options) {
        const servers = await getServers(name)
        const server = servers[0]
        const credential = await getCredential()
        const sshConfig = await getSSH()

        await new NodeController({
            ...credential,
            ...sshConfig,
            ...server
        }).logs({
            lines: options.n || 20
        })
    })

program
    .command('node:stop <name>')
    .description('停止应用')
    .action(async function(name) {
        const servers = await getServers(name)
        const server = servers[0]
        const credential = await getCredential()
        const sshConfig = await getSSH()

        await new NodeController({
            ...credential,
            ...sshConfig,
            ...server
        }).delete()
    })

program
    .command('node:show')
    .description('查看状态')
    .action(async function() {
        const credential = await getCredential()
        const sshConfig = await getSSH()

        await new NodeController({
            ...credential,
            ...sshConfig
        }).show()
    })

// program
//     .command('create <name>')
//     .description('创建项目')
//     .action(async function(name) {
//         fse.copySync(
//             path.resolve(__dirname, '../assets/helloworld'),
//             path.resolve(process.cwd(), name)
//         )
//     })
