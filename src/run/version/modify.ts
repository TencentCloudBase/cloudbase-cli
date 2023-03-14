import { CloudApiService } from '../../utils'
import {
    IModifyVersion
} from '../../types'

const tcbService = CloudApiService.getInstance('tcb')

export const modifyVersion = async (options: IModifyVersion) => {
    const { Result } = await tcbService.request('ModifyCloudBaseRunServerFlowConf', {
        EnvId: options.envId,
        ServerName: options.serverName,
        TrafficType: options.trafficType,
        VersionFlowItems: options.versionFlowItems
    })

    return Result
}