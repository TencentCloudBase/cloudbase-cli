import Builder, { IBuildResult } from './base'
import * as ncc from '@zeit/ncc'
import * as fs from 'fs'
import * as path from 'path'
import * as makeDir from 'make-dir'
import Logger from '../logger'

const logger = new Logger('NodeBuilder')

export default class NodeBuilder extends Builder {
    _options: INodeBuilderOptions
    constructor(options: INodeBuilderOptions) {
        super(options)
    }

    /**
     * .js -> .js
     *        assets
     */
    async build(): Promise<IBuildResult> {
        const entry = path.resolve(process.cwd(), this._options.entry)
        const distPath = path.resolve(process.cwd(), this._options.distPath)
        
        logger.log(`Building ${entry} to ${distPath}`)

        const { code, map, assets } = await ncc(entry)

        const filename = path.basename(entry)
        await makeDir(distPath)
        fs.writeFileSync(`${distPath}/${filename}`, code)
        for (let asset in assets) {
            fs.writeFileSync(`${distPath}/${asset}`, assets[asset].source)
        }

        const finalAssets = [`${distPath}/${filename}`, ...Object.keys(assets).map(asset => `${distPath}/${asset}`)]

        logger.log('Building success!')
        finalAssets.forEach(asset => logger.log('=> ' + asset))

        return {
            success: true,
            assets: finalAssets
        }
    }
}

export interface INodeBuilderOptions {
    entry: string
    distPath: string
}