import * as node_ssh from 'node-ssh'
import Loader from '../logger'
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
        const { host, username, port, password, remotePath } = this._options
        await this.ssh.connect({ host, username, port, password })

        logger.log('Reloading application...')

        const { stdout, stderr } = await this.ssh.execCommand(`pm2 list`)
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
}