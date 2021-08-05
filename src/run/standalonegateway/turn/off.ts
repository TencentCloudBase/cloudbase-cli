import { ITurnOffStandaloneGateway } from '../../../types'
import yunapi from '../yunapi'
import { CloudBaseError } from '../../../error'

export const turnOffStandalonegateway = async (options: ITurnOffStandaloneGateway) => {
    const { Response: res } = await yunapi('TurnOffStandaloneGateway', {
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
