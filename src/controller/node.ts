import * as node_ssh from 'node-ssh'
import * as path from 'path'
import Logger from '../logger';

const logger = new Logger('NodeController')

export default class NodeController {
    ssh: any
    _options: INodeControllerOptions
    constructor(options: INodeControllerOptions) {
        this.ssh = new node_ssh()
        this._options = options
    }

    async reload() {
        const { host, username, port, password, remotePath, entry } = this._options
        await this.ssh.connect({ host, username, port, password })

        logger.log('Reloading application...')

        const entryPath = path.resolve(remotePath, entry)
        logger.log(`reload ${entryPath}`)
        const { stdout, stderr } = await this.ssh.execCommand(`pm2 reload ${entryPath}`)
        console.log(stdout)

        this.ssh.dispose()
    }

    start() { }

    stop() { }

    logs() { }

    show() { }
}

interface INodeControllerOptions {
    host: string
    username: string
    port: number
    password: string

    remotePath: string
    entry: string
}