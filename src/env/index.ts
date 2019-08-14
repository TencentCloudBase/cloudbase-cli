import { getCredential, guid6 } from '../utils'
import tencentcloud from '../../deps/tencentcloud-sdk-nodejs'
import { AuthSecret } from '../types'
import { TcbError } from '../error'
import { BaseHTTPService } from '../utils'

const tcbService = new BaseHTTPService('tcb', '2018-06-08')

async function tencentcloudTcbEnvRequest(
    interfaceName: string,
    params?: Record<string, any>
) {
    const credential: AuthSecret = await getCredential()
    const { secretId, secretKey, token } = credential
    const TcbClient = tencentcloud.tcb.v20180608.Client
    const models = tencentcloud.tcb.v20180608.Models
    const Credential = tencentcloud.common.Credential
    let cred = new Credential(secretId, secretKey, token)
    let client = new TcbClient(cred, 'ap-shanghai')
    let req = new models[`${interfaceName}Request`]()

    const _params = {
        Region: 'ap-shanghai',
        ...params
    }

    req.deserialize(_params)

    return new Promise((resolve, reject) => {
        client[interfaceName](req, (err, response) => {
            if (err) {
                reject(err)
                return
            }
            resolve(response)
        })
    })
}

// 初始化 TCB 服务
// 当用户没开通 TCB 服务时，需要调用此接口初始化 TCB 服务
export async function initTcb(skey: string) {
    const res: any = await tencentcloudTcbEnvRequest('InitTcb', {
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
        const res: any = await tencentcloudTcbEnvRequest(
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
    const res: any = await tencentcloudTcbEnvRequest('DescribeEnvs')
    const { EnvList = [] } = res
    const data: Record<string, string>[] = []
    EnvList.forEach(env => {
        const { EnvId, PackageName, Source, CreateTime, Status } = env
        data.push({
            envId: EnvId,
            packageName: PackageName,
            source: Source,
            status: Status,
            createTime: CreateTime
        })
    })
    return data
}
