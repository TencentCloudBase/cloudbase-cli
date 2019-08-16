import { BaseHTTPService } from '../utils'

const tcbService = new BaseHTTPService('tcb', '2018-06-08')

// 拉取安全域名列表
export async function getEnvAuthDomains({ envId }) {
    const { Domains = [] }: any = await tcbService.request(
        'DescribeAuthDomains',
        {
            EnvId: envId
        }
    )

    console.log(Domains)
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
    const { Deleted } = await tcbService.request('DeleteAuthDomain', {
        EnvId: envId,
        DomainIds: domainIds
    })

    return Deleted
}
