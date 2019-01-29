import Builder from './builder/base'
import NodeBuilder from './builder/node'
import NodeZipBuilder from './builder/node-zip'
import NodeUploader from './uploader/node'
import NodeZipUploader from './uploader/node-zip'
import NodeController from './controller/node'
import * as path from 'path'
import * as del from 'del'
export default class Deploy {
    _config: INodeDeployConfig | IFunctionDeployConfig
    builder: Builder
    uploader: any
    controller: any
    constructor(config) {
        this._config = config
    }
    deploy() {

    }
}


export class NodeDeploy extends Deploy {
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

    async deploy() {
        this.clear()
        await this.builder.build()
        await this.uploader.upload()
        await this.controller.reload()
    }
}

interface INodeDeployConfig {
    host: string
    username: string
    port: number
    password: string

    entry: string
    distPath: string
    remotePath: string
}

interface IFunctionDeployConfig {

}

new NodeDeploy({
    host: '10.85.27.207',
    username: 'root',
    port: 36000,
    password: 'tpcloud@123',
    entry: './test/server.js',
    distPath: './dist',
    remotePath: '/root/dist'
}).deploy()