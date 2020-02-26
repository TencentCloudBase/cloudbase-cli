import fs from 'fs'
import path from 'path'
import { CloudBaseError } from '../../error'
import { CloudApiService, zipDir, checkFullAccess, isDirectory, delSync } from '../../utils'

const scfService = new CloudApiService('scf')

export interface IFunctionLayerOptions {
    contentPath?: string
    base64Content?: string
    layerName: string
    // 支持的运行时
    runtimes: string[]
}

// 创建文件层
export async function createLayer(options: IFunctionLayerOptions): Promise<void> {
    const { contentPath = '', layerName, base64Content = '', runtimes = [] } = options

    checkFullAccess(contentPath)

    const validRuntime = ['Nodejs8.9', 'Php7', 'Java8']
    if (runtimes.some(item => validRuntime.indexOf(item) === -1)) {
        throw new CloudBaseError(
            `Invalid runtime value. Now only support: ${validRuntime.join(', ')}`
        )
    }

    let base64

    if (base64Content) {
        base64 = base64Content
    } else if (isDirectory(contentPath)) {
        // 压缩文件夹
        const dirName = path.parse(contentPath).name
        const dest = path.join(process.cwd(), `cli-${dirName}.zip`)
        // ZIP 文件存在，删除 ZIP 文件
        if (checkFullAccess(dest)) {
            delSync(dest)
        }
        await zipDir(contentPath, dest)
        // 转换成 base64
        const fileBuffer = await fs.promises.readFile(dest)
        base64 = fileBuffer.toString('base64')
        delSync(dest)
    } else {
        const fileType = path.extname(contentPath)
        if (fileType !== '.zip') {
            throw new CloudBaseError('文件类型不正确，目前只支持 ZIP 文件！')
        }
        const fileBuffer = await fs.promises.readFile(contentPath)
        base64 = fileBuffer.toString('base64')
    }

    return scfService.request('PublishLayerVersion', {
        LayerName: layerName,
        CompatibleRuntimes: runtimes,
        Content: {
            // 最大支持 20M
            ZipFile: base64
        }
    })
}
