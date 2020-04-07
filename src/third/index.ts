import { CloudApiService } from '../utils'
const tcbService = CloudApiService.getInstance('tcb')

// 解除第三方小程序绑定
export async function deleteThirdPartAttach(options) {
    const { ThirdPartAppid, TypeFlag } = options
    const res: any = await tcbService.request('DeleteThirdPartAttach', {
        ThirdPartAppid,
        TypeFlag
    })

    return res
}