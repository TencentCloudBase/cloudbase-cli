import { CloudApiService } from '../utils'

const vpcService = CloudApiService.getInstance('vpc')

// 获取 vpc 信息
export async function getVpcs() {
    const { VpcSet } = await vpcService.request('DescribeVpcs')
    return VpcSet
}

// 获取子网
export async function getSubnets(vpcId: string) {
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
