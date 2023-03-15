import { IDestroyStandaloneGateway } from '../../types'
import { CloudBaseError } from '../../error'
import { CloudApiService } from '../../utils'

const tcbService = CloudApiService.getInstance('tcb')

export const destroyStandalonegateway = async (options: IDestroyStandaloneGateway) => {
    const res = await tcbService.request('DestroyStandaloneGateway', {
        EnvId: options.envId,
        IsForce: true,
        GatewayName: options.gatewayName
    })

    const { Error: Message } = res
    if (Message !== undefined) {
        throw new CloudBaseError(JSON.stringify(Message))
    }
    return res
}
