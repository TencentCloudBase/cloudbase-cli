import { default as NodeZipBuilder, INodeZipBuilderConfig } from './builder'
import { default as NodeZipUploader, NodeUploaderConfig } from './uploader'
import { SSH, AuthSecret, ServerConfig } from '../../types'

export class NodeDeployer {
    config: INodeDeployConfig
    builder: NodeZipBuilder
    uploader: { upload(): Promise<any> }
    constructor(config: INodeDeployConfig) {
        this.config = { ...config }
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

export interface INodeDeployConfig extends SSH, AuthSecret {
    path: ServerConfig['path']
    distPath: INodeZipBuilderConfig['distPath']
    remotePath: NodeUploaderConfig['remotePath']
}
