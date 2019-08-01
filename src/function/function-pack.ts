import * as path from 'path'
import * as del from 'del'
import * as makeDir from 'make-dir'
import * as ora from 'ora'
import { IFunctionPackResult } from '../types'
import { zipDir } from '../utils'

export class FunctionPack {
    path: string
    distPath: string
    constructor(path: string, distPath: string) {
        this.path = path
        this.distPath = distPath
    }

    /**
     * .js -> .js
     *        assets
     */
    async build(name: string): Promise<IFunctionPackResult> {
        const entry = path.resolve(process.cwd(), this.path)
        const distPath = path.resolve(process.cwd(), this.distPath)
        await makeDir(distPath)

        const zipPath = path.resolve(distPath, 'dist.zip')
        const packSpin = ora('开始构建压缩包...').start()

        await zipDir(entry, zipPath)

        packSpin.succeed(`${name} 函数压缩包构建完成！`)

        return {
            success: true,
            assets: [zipPath]
        }
    }

    async clean(): Promise<void> {
        const distPath = path.resolve(process.cwd(), this.distPath)
        del.sync([distPath])
        return
    }
}
