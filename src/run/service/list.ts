import { IServerInfo } from '../../types'
import { callTcbrApi, CloudApiService } from '../../utils'

const tcbService = CloudApiService.getInstance('tcb')

export const listService = async (options): Promise<IServerInfo[]> => {
    // 没有 CreateTime 因此需要调用两个接口
    const { data: { ServerList: serverList } } = await callTcbrApi('DescribeCloudRunServers', {
        EnvId: options.envId,
    })

    const { CloudBaseRunServerSet: serverSet} = await tcbService.request('DescribeCloudBaseRunServers', {
        EnvId: options.envId,
        Offset: 0,
        Limit: options.limit || 100
    })

    // 按照 ServerName 拼接结果
    if(!serverList.length) return []
    const serverInfo = serverList.map(serverItem => {
        return {
            ...serverItem,
            CreatedTime: serverSet.find( ( item ) =>  item.ServerName === serverItem.ServerName).CreatedTime
        }
    })

    return serverInfo

}