import { createReadStream, createWriteStream, readdirSync } from 'fs'
import { join } from 'path'
import { zip } from 'compressing'
import { CloudApiService, fetchStream } from '../../utils'
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
    let body = createReadStream(path)

    await fetchStream(url, {
        method: 'PUT',
        headers: {
            Accept: '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,en-US;q=0.6',
            // [headers['Key']]: headers['Value'],
            'Content-Type': 'application/x-zip-compressed'
        },
        body
    })
}
