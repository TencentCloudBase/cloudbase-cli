import { guid6 } from '../utils'
import { TcbError } from '../error'
import { CloudService } from '../utils'
export * from './domain'
export * from './login'

const tcbService = new CloudService('tcb', '2018-06-08')

// 初始化 TCB 服务
// 当用户没开通 TCB 服务时，需要调用此接口初始化 TCB 服务
export async function initTcb(skey: string) {
    const res: any = await tcbService.request('InitTcb', {
        Skey: skey
    })
    return res
}

// 创建新环境
export async function createEnv({ alias }) {
    const params = {
        Alias: alias,
        EnvId: `${alias}-${guid6()}`,
        Source: 'qcloud'
    }

    try {
        const res: any = await tcbService.request(
            'CreateEnvAndResource',
            params
        )
        res.EnvId = params.EnvId
        return res
    } catch (e) {
        throw new TcbError(`创建环境失败：${e.message}`)
    }
}

// 获取环境信息
export async function getEnvInfo(envId: string) {
    const { EnvList } = await tcbService.request('DescribeEnvs', {
        EnvId: envId
    })

    return EnvList && EnvList.length ? EnvList[0] : {}
}

// 列出所有环境
export async function listEnvs() {
    const res: any = await tcbService.request('DescribeEnvs')
    const { EnvList = [] } = res
    return EnvList
}

// 修改环境信息
export async function updateEnvInfo({ envId, alias }) {
    await tcbService.request('ModifyEnv', {
        EnvId: envId,
        Alias: alias
    })
}
