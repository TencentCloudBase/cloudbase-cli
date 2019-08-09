import  path from 'path'
import { IBuildResult } from './base'
import  makeDir from 'make-dir'
import Logger from '../logger'
import { zipDir } from '../utils'
import { IFunctionDeployConfig } from '../deploy/function'
import  del from 'del'

const logger = new Logger('FunctionBuilder')

export default class FunctionBuilder {
    _options: IFunctionDeployConfig
    constructor(options: IFunctionDeployConfig) {
        this._options = options
    }

    /**
     * .js -> .js
     *        assets
     */
    async build(): Promise<IBuildResult> {
        const entry = path.resolve(process.cwd(), this._options.path)
        const distPath = path.resolve(process.cwd(), this._options.distPath)
        await makeDir(distPath)

        const zipPath = path.resolve(distPath, 'dist.zip')
        logger.log(`Building ${entry} to ${zipPath}`)

        await zipDir(entry, zipPath)

        logger.log('Building success!')

        return {
            success: true,
            assets: [zipPath]
        }
    }

    async clean(): Promise<any> {
        const distPath = path.resolve(process.cwd(), this._options.distPath)
        del.sync([distPath])
        return
    }
}
