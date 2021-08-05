import { ICreateStandaloneGateway } from '../../types'
import yunapi from './yunapi'
import { CloudBaseError } from '../../error'

export const createStandaloneGateway = async (options: ICreateStandaloneGateway) => {
    const { Response: res } = await yunapi('CreateStandaloneGateway', {
        EnvId: options.envId,
        AppId: options.appId,
        GatewayAlias: options.gatewayAlias,
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
