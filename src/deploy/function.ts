import FunctionBuilder from '../builder/function'
import FunctionUploader from '../uploader/function';
import Deploy from './base'
import Logger from '../logger'

const logger = new Logger('FunctionDeploy')
export default class FunctionDeploy extends Deploy {
    _config: IFunctionDeployConfig
    constructor(config: IFunctionDeployConfig) {
        if (!config.distPath) {
            config.distPath = './dist'
        }
        super(config)
        this.builder = new FunctionBuilder(config)
        this.uploader = new FunctionUploader(config)
    }

    async deploy(start = false) {
        await this.builder.clean()
        await this.builder.build()
        try {
            await this.uploader.upload()
        } catch(e) {
            if (e.message) {
                logger.error(e.message)
            }
        }
        await this.builder.clean()
    }
}

export interface IFunctionDeployConfig {
    name: string
    path: string
    distPath?: string
    secretId: string
    secretKey: string
    envId: string
}