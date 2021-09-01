import { IListStandaloneGateway } from '../../types'
import { CloudBaseError } from '../../error'
import { CloudApiService } from '../../utils'

const tcbService = CloudApiService.getInstance('tcb')

export const listStandalonegateway = async (options: IListStandaloneGateway) => {
    const res = await tcbService.request('DescribeStandaloneGateway', {
        EnvId: options.envId,
        GatewayName: options.gatewayName,
        GatewayAlias: options.gatewayAlias
    })
    // const res = {
    //     StandaloneGatewayList: [
    //         {
    //             CPU: 2,
    //             GateWayStatus: 'Success',
    //             GatewayAlias: 'StandaloneGateway',
    //             GatewayDesc: 'gateway',
    //             GatewayName: 'x-tcb-cbr-gateway-4e9w8r711205c5',
    //             InternalClbIp: '10.0.0.30',
    //             Mem: 4,
    //             PackageVersion: 'starter',
    //             PublicClbIp: '1.15.159.47',
    //             ServiceInfo: [
    //                 {
    //                     ServiceName: 'coylexie',
    //                     Status: 'off'
    //                 },
    //                 {
    //                     ServiceName: 'test',
    //                     Status: 'on'
    //                 }
    //             ],
    //             SubnetIds: ['subnet-g6ey7mid'],
    //             VpcId: 'vpc-n73jhksu'
    //         }
    //     ],
    //     Total: 1,
    //     Error: {
    //         Message: 'No Error'
    //     }
    // }
    const { StandaloneGatewayList } = res
    if (StandaloneGatewayList !== undefined) {
        return StandaloneGatewayList.map((item) => [
            item['GatewayName'],
            item['GateWayStatus'],
            item['GatewayAlias'],
            item['PackageVersion'],
            // item['Mem'],
            // item['CPU'],
            beautifySubnetList(item['SubnetIds']),
            item['PublicClbIp'],
            item['InternalClbIp'],
            beautifyServiceList(item['ServiceInfo'])
            // item['GatewayDesc'],
        ])
    } else {
        const {
            Error: { Message }
        } = res
        throw new CloudBaseError(Message)
    }
}

const beautifySubnetList = (list: Array<string>) => list.join('\n')

const beautifyServiceList = (list: Array<Record<string, string>>) =>
    list
        .map(
            (item) => '服务 ' + item['ServiceName'] + (item['Status'] === 'on' ? ' 开启' : ' 未开启')
        )
        .join('\n')
