import { CloudApiService } from '../utils'

const vpcService = CloudApiService.getInstance('vpc')

// 获取私有网络信息
export const getVpcs = async () => {
    const { VpcSet } = await vpcService.request('DescribeVpcs')
    return VpcSet
}

// 获取子网
export const getSubnets = async (vpcId: string) => {
    const { SubnetSet } = await vpcService.request('DescribeSubnets', {
        Filters: [
            {
                Name: 'vpc-id',
                Values: [vpcId]
            }
        ]
    })
    return SubnetSet
}