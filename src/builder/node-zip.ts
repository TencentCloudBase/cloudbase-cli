import * as path from 'path'
import { IBuildResult } from './base'
import * as makeDir from 'make-dir'
import Logger from '../logger'
import { zipDir } from '../utils'
import { INodeDeployConfig } from '../deploy/node'
import * as del from 'del';
import * as fs from 'fs'

const logger = new Logger('NodeZipBuilder')

export default class NodeZipBuilder {
    _options: INodeDeployConfig
    constructor(options: INodeDeployConfig) {
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
            assets: [zipPath],
            vemo: fs.existsSync(path.resolve(entry, 'vemofile.js'))
        }
    }

    async clean(){
        const distPath = path.resolve(process.cwd(), this._options.distPath)
        del.sync([distPath])
    }
}
