import { createReadStream, createWriteStream, readdirSync } from 'fs'
import * as https from 'https'
import { URL } from 'url'
import { join } from 'path'
import { zip } from 'compressing'
import { CloudApiService } from '../../utils'
import {
    IBuildImage
} from '../../types'

const tcbService = CloudApiService.getInstance('tcb')

// 提交构建任务
export const createBuild = async (options: IBuildImage) => {
    const { PackageName, PackageVersion, UploadHeaders, UploadUrl } = await tcbService.request('DescribeCloudBaseBuildService', {
        EnvId: options.envId,
        ServiceName: options.serviceName,
    })

    return { PackageName, PackageVersion, UploadHeaders, UploadUrl }
}

// 上传zip压缩包
export const uploadZip = async (path: string, url: string, headers: { [key: string]: string }) => {
    let parsedUrl = new URL(url)
    let body = createReadStream(path)

    let req = https.request({
        method: 'PUT',
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        headers: {
            Accept: '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,en-US;q=0.6',
            [headers['Key']]: headers['Value'],
            'Content-Type': 'application/x-zip-compressed'
        }
    })

    body.pipe(req)

    return new Promise(resolve => { req.on('finish', () => resolve('end')) })
}

// 压缩文件夹下所有内容，而不是文件夹本身
export const packDir = async (path: string, resPath: string) => {
    let files = readdirSync(path)

    const zipStream = new zip.Stream()
    files.forEach(item => zipStream.addEntry(join(path, item)))

    const ws = createWriteStream(resPath)

    zipStream.pipe(ws)

    return new Promise(resolve => { ws.on('finish', _ => resolve('完成压缩')) })
}

