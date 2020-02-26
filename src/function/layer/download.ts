import fs from 'fs'
import path from 'path'
import unzipper from 'unzipper'
import { CloudApiService, fetchStream, checkFullAccess, delSync } from '../../utils'
import { CloudBaseError } from '../../error'

const scfService = new CloudApiService('scf')

export interface ILayerDownloadOptions {
    name: string
    version: number
    destPath: string
    force?: boolean
    unzip?: boolean
}

// 下载文件层 ZIP 文件
export async function downloadLayer(options: ILayerDownloadOptions): Promise<void> {
    const { name, version, destPath, unzip = false } = options
    const res = await scfService.request('GetLayerVersion', {
        LayerName: name,
        LayerVersion: version
    })
    const url = res?.Location
    const zipPath = path.join(destPath, `${name}-${version}.zip`)
    if (checkFullAccess(zipPath)) {
        throw new CloudBaseError(`文件已存在：${zipPath}`)
    }

    // 下载文件
    const streamRes = await fetchStream(url)
    const dest = fs.createWriteStream(zipPath)
    streamRes.body.pipe(dest)
    return new Promise(resolve => {
        // 解压文件
        dest.on('close', () => {
            // 不解压 ZIP 文件
            if (!unzip) {
                resolve()
                return
            }

            const unzipStream = unzipper.Extract({
                path: destPath
            })
            fs.createReadStream(zipPath).pipe(unzipStream)
            unzipStream.on('close', () => {
                // 删除 ZIP 文件
                delSync([zipPath])
                resolve()
            })
        })
    })
}
