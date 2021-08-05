import { IListStandaloneGateway } from '../../types'
import { CloudBaseError } from '../../error'
import yunapi from './yunapi'

export const listStandalonegateway = async (options: IListStandaloneGateway) => {
    const { Response: res } = await yunapi('DescribeStandaloneGateway', {
        EnvId: options.envId,
        AppId: options.appId,
        GatewayName: options.gatewayName,
        GatewayAlias: options.gatewayAlias
    })
    const { StandaloneGatewayList } = res
    if (StandaloneGatewayList !== undefined) {
        return StandaloneGatewayList.map((item) => [
            item['CPU'],
            item['GateWayStatus'],
            item['GatewayAlias'],
            item['GatewayDesc'],
            item['GatewayName'],
            item['Mem'],
            item['PackageVersion'],
            JSON.stringify(item['SubnetIds'])
        ])
    } else {
        const {
            Error: { Message }
        } = res
        throw new CloudBaseError(Message)
    }
}
