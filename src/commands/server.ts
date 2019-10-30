import program from 'commander'
import { NodeController } from '../server/node/controller'
import { CloudBaseError } from '../error'
import { checkAndGetCredential, resolveCloudBaseConfig, getSSH, getEnvId } from '../utils'
import { ServerConfig, ServerLanguageType } from '../types'

function checkServers(servers) {
    const names = {}
    servers.forEach((server: ServerConfig) => {
        if (!server.name) {
            throw new CloudBaseError('Every server must have a name.')
        } else if (!server.path) {
            throw new CloudBaseError('未指定发布目录')
        } else if (server.type != ServerLanguageType.node) {
            throw new CloudBaseError(`Unsupported deploy type: "${server.type}"`)
        } else if (names[server.name]) {
            throw new CloudBaseError(`Duplicated deploy name: "${server.name}"`)
        }
        names[server.name] = true
    })
}

async function getServers(
    name: string
): Promise<{ name: string; path: string; type: ServerLanguageType }[]> {
    const config = await resolveCloudBaseConfig()
    if (!config.servers || !Array.isArray(config.servers)) {
        throw new Error('服务配置错误')
    }

    let { servers } = config

    checkServers(servers)
    return name ? servers.filter(d => d.name === name) : servers
}

program
    .command('server:deploy [name]')
    .description('部署 node 服务')
    .action(async function(name: string) {
        const servers = await getServers(name)
        const envId = await getEnvId('')
        const credential = await checkAndGetCredential()
        const sshConfig = await getSSH()

        servers.forEach(async server => {
            if (!server.path) {
                throw new CloudBaseError('未指定发布目录')
            }
            await new NodeController({
                envId,
                ...sshConfig,
                ...server,
                ...credential
            }).deploy()
            return
        })
    })

program
    .command('server:log <name>')
    .description('查看日志')
    .option('-n, --lines <n>', '输出日志的行数')
    .action(async function(name, options) {
        const servers = await getServers(name)
        const server = servers[0]
        const credential = await checkAndGetCredential()
        const sshConfig = await getSSH()

        // console.log(options.lines)
        await new NodeController({
            ...credential,
            ...sshConfig,
            ...server
        }).logs({
            lines: options.lines || 20
        })
    })

program
    .command('server:reload <name>')
    .description('重启 node 服务')
    .action(async function(name: string) {
        const servers = await getServers(name)
        const server = servers[0]
        const credential = await checkAndGetCredential()
        const sshConfig = await getSSH()

        await new NodeController({
            ...sshConfig,
            ...server,
            ...credential
        }).reload()
        return
    })

program
    .command('server:stop <name>')
    .description('停止应用')
    .action(async function(name) {
        const servers = await getServers(name)
        const server = servers[0]
        const credential = await checkAndGetCredential()
        const sshConfig = await getSSH()

        await new NodeController({
            ...credential,
            ...sshConfig,
            ...server
        }).delete()
    })

program
    .command('server:show')
    .description('查看状态')
    .action(async function() {
        const credential = await checkAndGetCredential()
        const sshConfig = await getSSH()

        await new NodeController({
            ...credential,
            ...sshConfig
        }).show()
    })
