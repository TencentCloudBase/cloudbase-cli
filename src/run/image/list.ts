import { CloudApiService } from '../../utils'
import { IListImage } from '../../types'

const tcrService = CloudApiService.getInstance('tcr')
const tcbService = CloudApiService.getInstance('tcb')

// 得到镜像仓库列表
export const getImageRepo = async () => {
    const { Data: { RepoInfo } } = await tcrService.request('DescribeRepositoryFilterPersonal')
    return RepoInfo
}

// 得到镜像列表
export const listImage = async (options: IListImage) => {
    const { Images } = await tcbService.request('DescribeCloudBaseRunImages', {
        EnvId: options.envId,
        ServiceName: options.serviceName,
        Limit: options.limit,
        Offset: options.offset
    })

    return Images
}