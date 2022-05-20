import { createBuild } from ".."
import { zipDir } from '@cloudbase/toolbox'
import axios from "axios"
import path from 'path'
import fs from 'fs'

interface IPackageDeploy {
    envId: string,
    serviceName: string,
    targetDir: string,
    fileToIgnore?: string | string[]
}

export async function packageDeploy(options: IPackageDeploy) {
    let {
        envId,
        serviceName,
        targetDir,
        fileToIgnore
    } = options
    let { PackageName, PackageVersion, UploadUrl } = await createBuild({
        envId,
        serviceName
    })

    const zipFile = `.tcbr_${serviceName}_${Date.now()}.zip`,
        srcPath = path.resolve(process.cwd(), targetDir),
        dstPath = path.resolve(process.cwd(), zipFile)

    try {
        await zipDir(srcPath, dstPath, fileToIgnore)
        await axios.put(UploadUrl, fs.readFileSync(zipFile), {
            headers: {
                "content-type": "application/zip"
            }
        })
    } finally {
        await fs.promises.unlink(dstPath)
    }

    return { PackageName, PackageVersion }
}