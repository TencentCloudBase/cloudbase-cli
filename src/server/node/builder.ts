import path from 'path'
import makeDir from 'make-dir'
import Logger from '../../logger'
import { zipDir } from '../../utils/index.js'
import { INodeDeployConfig } from './deployer'

import del from 'del'
import fs from 'fs'

const logger = new Logger('NodeZipBuilder')

export interface IBuildResult {
    success: boolean
    /**
     * assets.0 => zipPath
     * assets.1 => zipFileName
     */
    assets: string[]
    vemo?: boolean
}

export default class NodeZipBuilder {
    _options: INodeDeployConfig
    constructor(options: INodeDeployConfig) {
        this._options = options
    }

    /**
     * .js -> .js
     *        assets
     */
    async build(zipFileName = 'dist.zip'): Promise<IBuildResult> {
        const entry = path.resolve(process.cwd(), this._options.path)
        const distPath = path.resolve(process.cwd(), this._options.distPath)
        await makeDir(distPath)

        const zipPath = path.resolve(distPath, zipFileName)
        logger.log(`Building ${entry} to ${zipPath}`)

        await zipDir(entry, zipPath)

        logger.log('Building success!')

        return {
            success: true,
            assets: [zipPath, zipFileName],
            vemo: fs.existsSync(path.resolve(entry, 'vemofile.js'))
        }
    }

    async clean() {
        const distPath = path.resolve(process.cwd(), this._options.distPath)
        del.sync([distPath])
    }
}
