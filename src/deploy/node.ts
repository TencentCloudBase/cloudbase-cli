import NodeZipBuilder from '../builder/node-zip'
import NodeZipUploader from '../uploader/node-zip'
import NodeController from '../controller/node'
import Deploy from './base'
import * as path from 'path'
import * as del from 'del'

export default class NodeDeploy extends Deploy {
    _config: INodeDeployConfig
    constructor(config: INodeDeployConfig = {
        host: '',
        username: 'root',
        port: 22,
        password: '',
        entry: '',
        distPath: './dist',
        remotePath: '/root/'
    }) {
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
        await this.builder.build()
        await this.uploader.upload()
        await this.builder.clean()
        if (start) {
            await this.controller.start()
        } else {
            await this.controller.reload()
        }
    }
}

export interface INodeDeployConfig {
    host: string
    username: string
    port: number
    password: string

    entry: string
    distPath: string
    remotePath: string
}