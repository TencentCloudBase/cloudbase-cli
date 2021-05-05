import { CloudApiService } from '../utils'
import {
    IListVersionOptions
} from '../types'

const tcbService = CloudApiService.getInstance('tcb')

export const describeImageRepo = async (options: IListVersionOptions) => {
    const { ImageRepo } = await tcbService.request('DescribeCloudBaseRunServer', {
        EnvId: options.envId,
        Limit: options.limit ? options.limit : 100,
        Offset: options.offset ? options.offset : 0,
        ServerName: options.serverName
    })

    return ImageRepo
}

export const deleteImageRepo = async (options: { imageRepo: string }) => {
    const { result } = await tcbService.request('DeleteCloudBaseRunImageRepo', {
        ImageRepo: options.imageRepo
    })

    return result
}