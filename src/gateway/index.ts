import { CloudApiService } from '../utils'
import {
    ICreateFunctionGatewayOptions,
    IQueryGatewayOptions,
    IDeleteGatewayOptions,
    IBindGatewayDomainOptions,
    IQueryGatewayDomainOptions,
    IUnbindGatewayDomainOptions
} from '../types'

const tcbService = CloudApiService.getInstance('tcb')

// HTTP 访问服务开关
export async function switchHttpService(options: { envId: string; enable: boolean }) {
    const { envId, enable } = options

    const value = enable ? 'true' : 'false'

    const res = await tcbService.request('ModifyCloudBaseGWPrivilege', {
        ServiceId: envId,
        // 当 Options 存在时，EnableService 会被忽略
        EnableService: enable,
        Options: [
            {
                Key: 'serviceswitch',
                Value: value
            }
        ]
    })
    return res
}

// HTTP 访问服务鉴权开关
export async function switchHttpServiceAuth(options: { envId: string; enable: boolean }) {
    const { envId, enable } = options

    const value = enable ? 'true' : 'false'

    const res = await tcbService.request('ModifyCloudBaseGWPrivilege', {
        ServiceId: envId,
        // 当 Options 存在时，EnableService 会被忽略
        EnableService: enable,
        Options: [
            {
                Key: 'authswitch',
                Value: value
            }
        ]
    })
    return res
}

// 获取HTTP 访问服务权限信息
export async function getHttpServicePrivilege(options: { envId: string }) {
    const { envId } = options

    return tcbService.request('DescribeCloudBaseGWPrivilege', {
        ServiceId: envId
    })
}

// 创建云函数网关
export async function createGateway(options: ICreateFunctionGatewayOptions) {
    const { envId, path, name } = options

    const res: any = await tcbService.request('CreateCloudBaseGWAPI', {
        Type: 1,
        Path: path,
        Name: name,
        ServiceId: envId,
        EnableUnion: true
    })
    return res
}

// 查询网关信息
export async function queryGateway(options: IQueryGatewayOptions) {
    const { envId, domain, path, gatewayId, name } = options

    const res: any = await tcbService.request('DescribeCloudBaseGWAPI', {
        ServiceId: envId,
        Domain: domain,
        Path: path,
        APIId: gatewayId,
        Name: name,
        EnableUnion: true
    })
    return res
}

// 删除网关
export async function deleteGateway(options: IDeleteGatewayOptions) {
    const { envId, path, name, gatewayId } = options

    const res: any = await tcbService.request('DeleteCloudBaseGWAPI', {
        ServiceId: envId,
        Path: path,
        APIId: gatewayId,
        Type: 1,
        Name: name
    })
    return res
}

// 绑定网关域名
export async function bindGatewayDomain(options: IBindGatewayDomainOptions) {
    const { envId, domain } = options

    const res: any = await tcbService.request('BindCloudBaseAccessDomain', {
        ServiceId: envId,
        Domain: domain
    })
    return res
}

// 查询网关域名信息
export async function queryGatewayDomain(options: IQueryGatewayDomainOptions) {
    const { envId, domain } = options

    const res: any = await tcbService.request('DescribeCloudBaseGWService', {
        ServiceId: envId,
        Domain: domain,
        EnableUnion: true
    })
    return res
}

// 删除网关域名
export async function unbindGatewayDomain(options: IUnbindGatewayDomainOptions) {
    const { envId, domain } = options

    const res: any = await tcbService.request('DeleteCloudBaseGWDomain', {
        ServiceId: envId,
        Domain: domain
    })
    return res
}
