import { CloudApiService } from '../utils'
import {
    ICreateRunOptions
} from '../types'

const tcbService = CloudApiService.getInstance('tcb')

export const createRun = async (options: ICreateRunOptions) => {
    const { Result } = await tcbService.request('EstablishCloudBaseRunServer', 
        {
            EnvId: options.envId,
            ServiceName: options.name,
            Remark: options.remark,
            VpcInfo: options.vpcInfo,
            LogType: options.logType,
            IsPublic: options.isPublic,
            ...(options.imageRepo ? { ImageRepo: options.imageRepo } : {}),
            ...(options.logType === 'es' ? { EsInfo: options.esInfo } : {})
        },
    )

    return Result
}
