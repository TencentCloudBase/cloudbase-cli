import { CloudApiService } from '../utils'

const tcbService = CloudApiService.getInstance('tcb')

// 拉取安全域名列表
export async function getEnvAuthDomains({ envId }) {
    const { Domains = [] }: any = await tcbService.request(
        'DescribeAuthDomains',
        {
            EnvId: envId
        }
    )

    return Domains
}

// 添加环境安全域名
export async function createEnvDomain({ envId, domains }) {
    await tcbService.request('CreateAuthDomain', {
        EnvId: envId,
        Domains: domains
    })
}

// 删除环境安全域名
export async function deleteEnvDomain({ envId, domainIds }) {
    const { Deleted }: any = await tcbService.request('DeleteAuthDomain', {
        EnvId: envId,
        DomainIds: domainIds
    })

    return Deleted
}
