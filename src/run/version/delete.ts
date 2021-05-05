import { CloudApiService } from '../../utils'
import {
    IDeleteVersion
} from '../../types'

const tcbService = CloudApiService.getInstance('tcb')

export const deleteVersion = async (options: IDeleteVersion) => {
    const { Result } = await tcbService.request('DeleteCloudBaseRunServerVersion', {
        EnvId: options.envId,
        ServerName: options.serverName,
        VersionName: options.versionName
    })

    return Result
}