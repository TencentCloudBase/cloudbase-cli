import { ICreateStandaloneGateway } from '../../types'
import { CloudBaseError } from '../../error'
import { CloudApiService } from '../../utils'

const tcbService = CloudApiService.getInstance('tcb')

export const createStandaloneGateway = async (options: ICreateStandaloneGateway) => {
    const res = await tcbService.request('CreateStandaloneGateway', {
        EnvId: options.envId,
        GatewayAlias: options.gatewayAlias,
        GatewayDesc: options.gatewayDesc,
        VpcId: options.vpcId,
        SubnetIds: options.subnetIds,
        PackageVersion: options.packageVersion
    })
    const { GatewayName } = res
    if (GatewayName === undefined) {
        const {
            Error: { Message }
        } = res
        throw new CloudBaseError(Message)
    }
    return GatewayName
}
