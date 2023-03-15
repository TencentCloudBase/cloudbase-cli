import { IListPackageStandaloneGateway } from '../../../types'
import { CloudBaseError } from '../../../error'
import { CloudApiService } from '../../../utils'

const tcbService = CloudApiService.getInstance('tcb')

export const listPackageStandalonegateway = async (options: IListPackageStandaloneGateway) => {
    const res = await tcbService.request('DescribeStandaloneGatewayPackage', {
        EnvId: options.envId,
        PackageVersion: options.packageVersion
    })
    const { StandaloneGatewayPackageList } = res
    if (StandaloneGatewayPackageList === undefined) {
        const {
            Error: { Message }
        } = res
        throw new CloudBaseError(Message)
    }
    return StandaloneGatewayPackageList.map((item) => [
        item['CPU'],
        item['Mem'],
        item['PackageVersion']
    ])
}
