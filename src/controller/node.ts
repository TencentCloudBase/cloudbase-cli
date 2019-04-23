import * as node_ssh from 'node-ssh'
import * as path from 'path'
import Logger from '../logger';
import { INodeDeployConfig } from '../deploy/node'
import { getSecret } from '../utils'
import chalk from 'chalk'

const logger = new Logger('NodeController')

const GET_VEMO_ENTRY = 'npm run vemo -- main | tail -n 1'
const PM2_OPTIONS = '-o out.log -e err.log'
export default class NodeController {
    ssh: any
    _options: INodeDeployConfig
    constructor(config: INodeDeployConfig) {
        config = {
            username: 'root',
            port: 22,
            remotePath: `/data/tcb-service/${config.name}`,
            ...config
        }
        this.ssh = new node_ssh()
        this._options = config
    }

    async reload({ vemo }) {
        const { host, username, port, password, remotePath, name } = this._options
        await this.ssh.connect({ host, username, port, password })

        await this.installDependencies()

        logger.log('Reloading application...')

        const secret = await this.injectSecret()
        logger.log(`reload ${name}`)
        const { stdout, stderr } = await this.ssh.execCommand(secret + `pm2 reload ${name}`)
        console.log(stdout || stderr)

        this.ssh.dispose()
    }

    async start({ vemo }) {
        const { host, username, port, password, remotePath, name } = this._options
        await this.ssh.connect({ host, username, port, password })

        await this.installDependencies()

        logger.log('Starting application...')

        const secret = await this.injectSecret()

        if (vemo) {
            logger.log(`start vemo`)
            const { stdout, stderr } = await this.ssh.execCommand(secret + `pm2 start $(${GET_VEMO_ENTRY}) ${PM2_OPTIONS} --name ${name}`, {
                cwd: remotePath
            })
            console.log(stdout || stderr)
        } else {
            const entryPath = path.resolve(remotePath, 'index.js')
            logger.log(`start ${entryPath}`)
            const { stdout, stderr } = await this.ssh.execCommand(secret + `pm2 start ${entryPath} ${PM2_OPTIONS} --name ${name}`, {
                cwd: remotePath
            })
            console.log(stdout || stderr)
        }

        this.ssh.dispose()
    }

    async installDependencies() {
        const { remotePath } = this._options
        logger.log('Installing dependencies...')
        const installResult = await this.ssh.execCommand('npm install --production', {
            cwd: remotePath
        })
        console.log(installResult.stdout || installResult.stderr)
    }

    async injectSecret() {
        const { secretId, secretKey } = await getSecret()
        return `export TENCENTCLOUD_SECRETID=${secretId} && export TENCENTCLOUD_SECRETKEY=${secretKey} && `
    }

    async stop({ vemo }) {
        const { host, username, port, password, remotePath, name } = this._options
        await this.ssh.connect({ host, username, port, password })

        logger.log('Stoping application...')


        logger.log(`stop ${name}`)
        const { stdout, stderr } = await this.ssh.execCommand(`pm2 stop ${name}`)
        console.log(stdout || stderr)

        this.ssh.dispose()
    }

    async logs({ lines }) {
        const { host, username, port, password, remotePath } = this._options
        await this.ssh.connect({ host, username, port, password })
        const { stdout: logContent, stderr: logFail } = await this.ssh.execCommand(`tail -n ${lines} out.log`, { cwd: remotePath })
        const { stdout: errContent, stderr: errFail } = await this.ssh.execCommand(`tail -n ${lines} err.log`, { cwd: remotePath })

        console.log(chalk.gray(`${remotePath}/out.log last ${lines} lines:`))
        console.log(logContent || logFail)
        console.log('\n')
        console.log(chalk.gray(`${remotePath}/err.log last ${lines} lines:`))
        console.log(errContent || errFail)
        this.ssh.dispose()
    }

    async delete() {
        const { host, username, port, password, remotePath, name } = this._options
        await this.ssh.connect({ host, username, port, password })
        const { stdout, stderr } = await this.ssh.execCommand(`pm2 delete ${name}`, { cwd: remotePath })
        console.log(stdout || stderr)
        this.ssh.dispose()
    }

    async show() {
        const { host, username, port, password } = this._options
        await this.ssh.connect({ host, username, port, password })
        const { stdout, stderr } = await this.ssh.execCommand(`pm2 list`)
        console.log(stdout || stderr)
        this.ssh.dispose()
    }
}
