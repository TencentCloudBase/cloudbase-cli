import { configStore } from '../utils/configstore'
import { ConfigItems } from '../constant'
import { successLog } from '../logger'
import { refreshTmpToken } from './auth'
import { getCredentialConfig } from '../utils'
// import { CloudBaseError } from '../error'

// 注销登录信息
export async function logout() {
    const credentail = getCredentialConfig()

    try {
        await refreshTmpToken({
            ...credentail,
            isLogout: true
        })
        configStore.delete(ConfigItems.credentail)
        configStore.delete(ConfigItems.ssh)
        successLog('注销登录成功！')
    } catch (e) {
        configStore.delete(ConfigItems.credentail)
        configStore.delete(ConfigItems.ssh)
        // throw new CloudBaseError('云端设备登录记录删除失败，请手动删除！')
        successLog('注销登录成功！')
    }
}
