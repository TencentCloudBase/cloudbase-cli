import { ITurnOnStandaloneGateway } from '../../../types'
import { CloudBaseError } from '../../../error'
import { CloudApiService } from '../../../utils'

const tcbService = CloudApiService.getInstance('tcb')

export const turnOnStandalonegateway = async (options: ITurnOnStandaloneGateway) => {
    const res = await tcbService.request('TurnOnStandaloneGateway', {
        EnvId: options.envId,
        GatewayName: options.gatewayName,
        ServiceNameList: options.serviceList
    })
    
    const { Error: Message } = res
    if (Message !== undefined) {
        throw new CloudBaseError(JSON.stringify(Message))
    }
    return res
}
