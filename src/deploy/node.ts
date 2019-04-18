import NodeZipBuilder from '../builder/node-zip'
import NodeZipUploader from '../uploader/node-zip'
import NodeController from '../controller/node'
import Deploy from './base'
import * as path from 'path'
import * as del from 'del'

export default class NodeDeploy extends Deploy {
    _config: INodeDeployConfig
    constructor(config: INodeDeployConfig) {
        config = {
            username: 'root',
            port: 22,
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

    async deploy(start = false) {
        await this.builder.clean()
        const buildResult = await this.builder.build()
        await this.uploader.upload()
        await this.builder.clean()
        if (start) {
            await this.controller.start({ vemo: buildResult.vemo })
        } else {
            await this.controller.reload({ vemo: buildResult.vemo })
        }
    }
}

export interface INodeDeployConfig {
    name: string

    host: string
    username: string
    port: number
    password: string

    path: string
    distPath: string
    remotePath: string
}