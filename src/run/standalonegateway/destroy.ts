import { IDestroyStandaloneGateway } from '../../types'
import yunapi from './yunapi'
import { CloudBaseError } from '../../error'

export const destroyStandalonegateway = async (options: IDestroyStandaloneGateway) => {
    const { Response: res } = await yunapi('DestroyStandaloneGateway', {
        EnvId: options.envId,
        AppId: options.appId,
        isForce: true,
        GatewayName: options.gatewayName
    })

    const { Error: Message } = res
    if (Message !== undefined) {
        throw new CloudBaseError(JSON.stringify(Message))
    }
    return res
}
