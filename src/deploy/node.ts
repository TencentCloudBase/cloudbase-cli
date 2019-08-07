import NodeZipBuilder from '../builder/node-zip'
import NodeZipUploader from '../uploader/node-zip'
import { NodeController } from '../controller'
import Deploy from './base'
import path from 'path'
import del from 'del'

export class NodeDeploy extends Deploy {
    _config: INodeDeployConfig
    constructor(config: INodeDeployConfig) {
        config = {
            username: 'root',
            port: '22',
            distPath: './.tcb-dist',
            remotePath: `/data/tcb-service/${config.name}`,
            ...config
        }
        super(config)
        this.builder = new NodeZipBuilder(config)
        this.uploader = new NodeZipUploader(config)
        this.controller = new NodeController(config)
    }

    clear() {
        const distPath = path.resolve(__dirname, this._config.distPath)
        del.sync([distPath])
    }

    async deploy() {
        await this.builder.clean()
        const buildResult = await this.builder.build()
        await this.uploader.upload()
        await this.builder.clean()
        await this.controller.start({ vemo: buildResult.vemo })
    }
}

export interface INodeDeployConfig {
    // ssh meta data
    host: string
    username: string
    port: string
    password: string

    // credential data
    secretId: string
    secretKey: string
    token?: string

    // config
    name?: string
    path?: string
    distPath?: string
    remotePath?: string
}
