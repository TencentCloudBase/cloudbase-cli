import { IListPackageStandaloneGateway } from '../../../types'
import yunapi from '../yunapi'
import { CloudBaseError } from '../../../error'

export const listPackageStandalonegateway = async (options: IListPackageStandaloneGateway) => {
    const { Response: res } = await yunapi('DescribeStandaloneGatewayPackage', {
        EnvId: options.envId,
        AppId: options.appId,
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
