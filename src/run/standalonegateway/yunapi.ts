import { getCredentialWithoutCheck } from '@cloudbase/toolbox'
import { CloudApiService } from '../../utils'
import axios from 'axios'
import { CloudBaseError } from '../../error'

export default async function yunapi(action: string, params: object) {
    let envId = Object.keys(params).indexOf('EnvId') !== -1 ? params['EnvId'] : ''
    let appId = Object.keys(params).indexOf('AppId') !== -1 ? params['AppId'] : ''
    let region = CloudApiService.getInstance('tcb').region
    if (region === undefined) region = 'ap-shanghai'
    const credential = await getCredentialWithoutCheck()
    const result = await axios
        .post(
            'http://11.185.14.226:8081/yun-api/v2',
            {
                Action: action,
                ApiModule: 'tcb',
                CInfo: {
                    Uin: credential.uin,
                    Region: CloudApiService.getInstance('tcb').region,
                    Zone: '',
                    EnvId: envId,
                    AppId: appId
                },
                SubAccountUin: credential.uin,
                Uin: credential.uin,
                ...params
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'cache-control': 'no-cache'
                }
            }
        )
        .catch((error) => {
            throw new CloudBaseError(error)
        })
    return result.data
}
