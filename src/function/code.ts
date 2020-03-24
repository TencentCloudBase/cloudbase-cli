import fs from 'fs'
import path from 'path'
import unzipper from 'unzipper'
import { CloudApiService, fetchStream, delSync, checkFullAccess } from '../utils'

interface IFunctionCodeOptions {
    envId: string
    destPath: string
    functionName: string
    codeSecret?: string
    unzip?: boolean
}

const scfService = CloudApiService.getInstance('scf')

// 下载函数代码
export async function downloadFunctionCode(options: IFunctionCodeOptions) {
    const { destPath, envId, functionName, codeSecret, unzip = false } = options

    // 检验路径是否存在
    checkFullAccess(destPath, true)

    // 获取下载链接
    const { Url } = await scfService.request('GetFunctionAddress', {
        FunctionName: functionName,
        Namespace: envId,
        CodeSecret: codeSecret
    })

    // 下载文件
    const res = await fetchStream(Url)
    const zipPath = path.join(destPath, `${functionName}.zip`)
    const dest = fs.createWriteStream(zipPath)
    res.body.pipe(dest)
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
