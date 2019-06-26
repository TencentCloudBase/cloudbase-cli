import * as NodeSSH from 'node-ssh'
import * as path from 'path'
import Logger from '../logger'
import { INodeDeployConfig } from '../deploy/node'

const logger = new Logger('NodeZipUploader')

export default class NodeUploader {
    ssh: any
    _options: INodeDeployConfig
    constructor(options: INodeDeployConfig) {
        this.ssh = new NodeSSH()
        this._options = options
    }

    async upload() {
        const { host, username, port, password, distPath, remotePath }  = this._options

        logger.log(`Deploying ${distPath} to ${username}@${host}:${remotePath}`)
        await this.ssh.connect({
            host,
            username,
            port,
            password,
        })
    
        await this.ssh.execCommand(`rm -rf ${remotePath}`)
        await this.ssh.putDirectory(path.resolve(process.cwd(), distPath), remotePath)

        logger.log('Unzip...')
        logger.log(`cd ${distPath} && unzip dist.zip`)
        const { stdout, stderr } = await this.ssh.execCommand(`cd ${remotePath} && unzip dist.zip`)

        if (stderr) console.log(stderr)

        this.ssh.dispose()
    }
}
