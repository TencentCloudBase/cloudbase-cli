import path from 'path'
import * as fs from 'fs'
import { createBuild, uploadZip } from '..'
import { CloudBaseError, execWithLoading, loadingFactory, zipDir } from '@cloudbase/toolbox'
interface IPackageDeploy {
    envId: string,
    serviceName: string,
    filePath: string,
    fileToIgnore?: string | string[]
}

export async function packageDeploy(options: IPackageDeploy) {
    let {
        envId,
        serviceName,
        filePath,
        fileToIgnore
    } = options
    let { PackageName, PackageVersion, UploadUrl, UploadHeaders } = await createBuild({
        envId,
        serviceName
    })

    const loading = loadingFactory()
    const zipFile = `.tcbr_${serviceName}_${Date.now()}.zip`
    const dstPath = path.join(process.cwd(), zipFile)

    try {
        if (fs.statSync(filePath).isDirectory()) {
            loading.start('正在压缩文件…')
            await zipDir(filePath, dstPath, fileToIgnore)
            loading.succeed('压缩文件完成')
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new CloudBaseError('找不到指定文件夹，请检查文件路径是否正确')
        } else {
            throw new CloudBaseError(error.message)
        }
    }

    try {
        return await execWithLoading(
            async () => {
                await uploadZip(zipFile, UploadUrl, UploadHeaders[0])
                return { PackageName, PackageVersion }
            },
            {
                startTip: '\n正在上传代码包...',
                failTip: '上传代码包失败，请稍后重试'
            }
        )
    } finally {
        await fs.promises.unlink(dstPath)
    }

}