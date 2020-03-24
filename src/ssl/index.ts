import { CloudApiService } from '../utils'

const sslService = CloudApiService.getInstance('ssl')

// 获取 SSL 证书
export async function getCertificates(options: { domain: string }) {
    const { domain } = options

    const res = await sslService.request('DescribeCertificates', {
        SearchKey: domain
    })
    return res
}
