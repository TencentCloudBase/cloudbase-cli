import { CloudApiService, getMangerService } from '../utils'
export * from './domain'
export * from './login'

const tcbService = CloudApiService.getInstance('tcb')

// 初始化云开发服务
// 当用户没开通云开发服务时，需要调用此接口初始化云开发服务
export async function initTcb(skey: string) {
    const res: any = await tcbService.request('InitTcb', {
        Skey: skey
    })
    return res
}

// 创建新环境
export async function createEnv({ alias, paymentMode }) {
    const { env } = await getMangerService()

    return env.createEnv({
        paymentMode,
        name: alias
    })
}

// 获取环境信息
export async function getEnvInfo(envId: string) {
    const { EnvList } = await tcbService.request('DescribeEnvs', {
        EnvId: envId
    })

    return EnvList?.length ? EnvList[0] : {}
}

// 列出所有环境
export async function listEnvs(options: { source?: string[] } = {}): Promise<any[]> {
    const { source } = options
    const res: any = await tcbService.request('DescribeEnvs', {
        IsVisible: false,
        Channels: ['dcloud']
    })
    let { EnvList = [] } = res
    // 过滤为指定 source 环境
    if (source && Array.isArray(source)) {
        EnvList = EnvList.filter((item) => source.includes(item.Source))
    }
    return EnvList
}

// 修改环境信息
export async function updateEnvInfo({ envId, alias }) {
    await tcbService.request('ModifyEnv', {
        EnvId: envId,
        Alias: alias
    })
}

// 获取 Qcloud 环境数量上限
export async function getEnvLimit(source = 'qcloud') {
    return tcbService.request('DescribeEnvLimit', {
        Source: source
    })
}
