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
        // 不直接 throw 因为调用 DescribeCloudRunServerDetail 如果传入了当前不存在的服务名会返回报错
        // 对特殊错误特殊处理
        if (e.code === 'AuthFailure.UnauthorizedOperation') {
            console.log('\n', `requestId: ${e.requestId}`)
            throw new CloudBaseError('您没有权限执行此操作，请检查 CAM 策略\n')
        } else if (e.code === 'LimitExceeded') {
            throw new CloudBaseError(`${e.original.Message}\n`)
        }
        return e
    }
}
