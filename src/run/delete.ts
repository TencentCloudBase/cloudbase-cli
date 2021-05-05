import { CloudApiService } from '../utils'
import {
    IDeleteRun
} from '../types'

const tcbService = CloudApiService.getInstance('tcb')

export const deleteRun = async (options: IDeleteRun) => {
    const { Result } = await tcbService.request('DeleteCloudBaseRunServer', {
        EnvId: options.envId,
        ServerName: options.serverName
    })

    return Result;
}
