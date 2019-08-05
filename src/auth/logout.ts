import { configStore } from '../utils/configstore'
import { ConfigItems } from '../constant'
import { successLog } from '../logger'

// 注销登录信息
export async function logout() {
    configStore.delete(ConfigItems.credentail)
    successLog('注销登录成功！')
}
