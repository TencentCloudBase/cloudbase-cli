import { ITurnOnStandaloneGateway } from '../../../types'
import yunapi from '../yunapi'
import { CloudBaseError } from '../../../error'

export const turnOnStandalonegateway = async (options: ITurnOnStandaloneGateway) => {
    const { Response: res } = await yunapi('TurnOnStandaloneGateway', {
        EnvId: options.envId,
        AppId: options.appId,
        GatewayName: options.gatewayName,
        ServiceNameList: options.serviceList
    })
    
    const { Error: Message } = res
    if (Message !== undefined) {
        throw new CloudBaseError(JSON.stringify(Message))
    }
    return res
}
