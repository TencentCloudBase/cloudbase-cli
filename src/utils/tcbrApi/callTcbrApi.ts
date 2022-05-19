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
        return e
    }
}
