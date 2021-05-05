import { CloudApiService } from '../utils'
import {
    IListRunOptions
} from '../types'

const scfService = CloudApiService.getInstance('tcb')

export async function listRun(options: IListRunOptions) {
    const { limit = 20, offset = 0, envId } = options
    const res: any = await scfService.request('DescribeCloudBaseRunServers', {
        EnvId: envId,
        Limit: limit,
        Offset: offset
    })
    const { CloudBaseRunServerSet = [] } = res
    const data: Record<string, string>[] = []
    CloudBaseRunServerSet.forEach(run => {
        const { ServerName, CreatedTime, UpdatedTime, Status, VpcId, ServiceRemark } = run
        data.push({
            ServerName,
            ServiceRemark,
            CreatedTime,
            UpdatedTime,
            VpcId,
            Status,
        })
    })

    return data
}