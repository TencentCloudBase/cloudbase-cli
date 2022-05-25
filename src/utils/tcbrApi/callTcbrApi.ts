import { CloudBaseError } from '@cloudbase/toolbox'
import { CloudApiService } from './tcbr-cloud-api-request'

const tcbrService = CloudApiService.getInstance('tcbr')

export async function callTcbrApi(action: string, data: Record<string, any>) {
    try {
        const res = await tcbrService.request(action, data)
        // 返回统一格式的 JSON 结果
        return {
            code: 0,
            errmsg: 'success',
            data: {
                ...res
            }
        }
    } catch (e) {
        if (e.code === 'AuthFailure.UnauthorizedOperation') {
            console.log('\n', `requestId: ${e.requestId}`)
            throw new CloudBaseError('您没有权限调执行此操作，请检查 CAM 策略\n')
        }
        return e
    }
}
