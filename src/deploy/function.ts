import FunctionBuilder from '../builder/function'
import FunctionUploader from '../uploader/function'
import Deploy from './base'
import Logger from '../logger'
import * as path from 'path'

const logger = new Logger('FunctionDeploy')
export class FunctionDeploy extends Deploy {
    _config: IFunctionDeployConfig
    constructor(config: IFunctionDeployConfig) {
        if (!config.distPath) {
            config.distPath = path.resolve(process.cwd(), 'dist')
        }
        super(config)
        this.builder = new FunctionBuilder(config)
        this.uploader = new FunctionUploader(config)
    }

    async deploy() {
        await this.builder.clean()
        await this.builder.build()
        try {
            await this.uploader.upload()
        } catch (e) {
            if (e.message) {
                logger.error(e.message)
                await this.builder.clean()
                return
            }
        }
        await this.builder.clean()
        logger.success(
            `Depoly serverless function "${this._config.name}" success!`
        )
    }
}

export interface IFunctionDeployConfig {
    //metadata
    secretId: string
    secretKey: string
    token: string

    // config
    name: string
    path: string
    envId: string
    distPath?: string
    override?: boolean
}
