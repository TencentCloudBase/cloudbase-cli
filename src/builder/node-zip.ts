import Builder, { IBuildResult } from './base'
import * as ncc from '@zeit/ncc'
import * as fs from 'fs'
import * as path from 'path'
import * as makeDir from 'make-dir'
import Logger from '../logger'
import * as archiver from 'archiver'

const logger = new Logger('NodeZipBuilder')

export default class NodeZipBuilder extends Builder {
    _options: INodeZipBuilderOptions
    constructor(options: INodeZipBuilderOptions) {
        super(options)
    }

    /**
     * .js -> .js
     *        assets
     */
    async build(): Promise<IBuildResult> {
        const entry = path.resolve(process.cwd())
        const distPath = path.resolve(process.cwd(), this._options.distPath)
        await makeDir(distPath)

        const zipPath = distPath + '/dist.zip'
        logger.log(`Building ${entry} to ${zipPath}`)

        await zipDir(entry, zipPath)

        logger.log('Building success!')

        return {
            success: true,
            assets: [zipPath]
        }
    }
}

export interface INodeZipBuilderOptions {
    distPath: string
}

async function zipDir(dirPath, outputPath) {
    return new Promise((resolve, reject) => {
        var output = fs.createWriteStream(outputPath);
        var archive = archiver('zip');

        output.on('close', function () {
            // console.log(archive.pointer() + ' total bytes');
            // console.log('archiver has been finalized and the output file descriptor has closed.');
            resolve()
        });

        archive.on('error', function (err) {
            reject(err)
        });

        archive.pipe(output);
        archive.directory(dirPath, '');
        archive.finalize();
    })
}
