import NodeZipBuilder from './builder'
import NodeZipUploader from './uploader'
import path from 'path'
import del from 'del'

export class NodeDeployer {
    config: INodeDeployConfig
    builder: NodeZipBuilder
    uploader: { upload(): Promise<any> }
    constructor(config: INodeDeployConfig) {
        this.config = {
            username: 'root',
            port: '22',
            distPath: './.tcb-dist',
            remotePath: `/data/tcb-service/${config.name}`,
            ...config
        }
        this.builder = new NodeZipBuilder(this.config)
        this.uploader = new NodeZipUploader(this.config)
    }

    async deploy() {
        await this.builder.clean()
        const buildResult = await this.builder.build()
        await this.uploader.upload()
        await this.builder.clean()
        return buildResult
        // await this.controller.start({ vemo: buildResult.vemo })
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
