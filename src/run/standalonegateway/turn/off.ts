import { ITurnOffStandaloneGateway } from '../../../types'
import { CloudBaseError } from '../../../error'
import { CloudApiService } from '../../../utils'

const tcbService = CloudApiService.getInstance('tcb')

export const turnOffStandalonegateway = async (options: ITurnOffStandaloneGateway) => {
    const res = await tcbService.request('TurnOffStandaloneGateway', {
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
