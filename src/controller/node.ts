import * as node_ssh from 'node-ssh'
import * as path from 'path'
import Logger from '../logger';
import { INodeDeployConfig } from '../deploy/node'

const logger = new Logger('NodeController')

export default class NodeController {
    ssh: any
    _options: INodeDeployConfig
    constructor(options: INodeDeployConfig) {
        console.log(options)
        this.ssh = new node_ssh()
        this._options = options
    }

    async reload({ isSingle }) {
        const { host, username, port, password, remotePath, entry } = this._options
        await this.ssh.connect({ host, username, port, password })

        logger.log('Reloading application...')

        const entryPath = isSingle ? path.resolve(remotePath, path.basename(entry)) : path.resolve(remotePath, entry)
        logger.log(`reload ${entryPath}`)
        const { stdout, stderr } = await this.ssh.execCommand(`pm2 reload ${entryPath}`)
        console.log(stdout || stderr)

        this.ssh.dispose()
    }

    async start({ isSingle }) {
        const { host, username, port, password, remotePath, entry } = this._options
        await this.ssh.connect({ host, username, port, password })

        logger.log('Starting application...')

        const entryPath = isSingle ? path.resolve(remotePath, path.basename(entry)) : path.resolve(remotePath, entry)
        logger.log(`start ${entryPath}`)
        const { stdout, stderr } = await this.ssh.execCommand(`pm2 start ${entryPath}`)
        console.log(stdout || stderr)

        this.ssh.dispose()
    }

    async stop({ isSingle }) {
        const { host, username, port, password, remotePath, entry } = this._options
        await this.ssh.connect({ host, username, port, password })

        logger.log('Stoping application...')

        const entryPath = isSingle ? path.resolve(remotePath, path.basename(entry)) : path.resolve(remotePath, entry)
        logger.log(`stop ${entryPath}`)
        const { stdout, stderr } = await this.ssh.execCommand(`pm2 stop ${entryPath}`)
        console.log(stdout || stderr)

        this.ssh.dispose()
    }

    async npmInstall() {
        const { host, username, port, password, remotePath, entry } = this._options
        await this.ssh.connect({ host, username, port, password })

        logger.log('Installing dependencies...')

        const { stdout, stderr } = await this.ssh.execCommand(`cd ${remotePath} && tnpm i -d`)
        console.log(stdout || stderr)

        this.ssh.dispose()
    }

    logs() { }

    async show() {
        const { host, username, port, password, remotePath, entry } = this._options
        await this.ssh.connect({ host, username, port, password })
        const { stdout, stderr } = await this.ssh.execCommand(`pm2 list`)
        console.log(stdout || stderr)
        this.ssh.dispose()
    }
}
