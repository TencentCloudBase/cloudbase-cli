import { getCredential } from '../utils'
import tencentcloud from '../../deps/tencentcloud-sdk-nodejs'

async function tencentcloudTcbEnvRequest(
    interfaceName: string,
    params?: Record<string, any>
) {
    const credential = await getCredential()
    const { secretId, secretKey, token } = credential
    const TcbClient = tencentcloud.tcb.v20180608.Client
    const models = tencentcloud.tcb.v20180608.Models
    const Credential = tencentcloud.common.Credential
    let cred = new Credential(secretId, secretKey, token)
    let client = new TcbClient(cred, 'ap-shanghai')
    let req = new models[`${interfaceName}Request`]()

    const _params = {
        Region: 'ap-shanghai',
        Role: 'TCB_QcsRole',
        Stamp: 'MINI_QCBASE',
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

export async function listEnvs() {
    const res: any = await tencentcloudTcbEnvRequest('DescribeEnvs')
    const { EnvList = [] } = res
    const data: Record<string, string>[] = []
    EnvList.forEach(env => {
        const { EnvId, PackageName, Source, CreateTime } = env
        data.push({
            envId: EnvId,
            packageName: PackageName,
            source: Source,
            createTime: CreateTime
        })
    })
    return data
}
