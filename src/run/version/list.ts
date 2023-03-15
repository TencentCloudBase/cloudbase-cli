import { CloudApiService } from '../../utils'
import {
    IListVersionOptions
} from '../../types'

const tcbService = CloudApiService.getInstance('tcb')

export const listVersion = async (options: IListVersionOptions) => {
    const { VersionItems } = await tcbService.request('DescribeCloudBaseRunServer', {
        EnvId: options.envId,
        Limit: options.limit ? options.limit : 100,
        Offset: options.offset ? options.offset : 0,
        ServerName: options.serverName
    })

    return VersionItems
}