import { getCredentialData, authStore, refreshTmpToken } from '../utils'
import { ConfigItems } from '../constant'
import { successLog } from '../logger'
import { CloudBaseError } from '../error'

// 注销登录信息
export async function logout() {
    const credentail = getCredentialData()

    try {
        // 仅使用 Web 控制台授权登录时才删除 token
        if (credentail.refreshToken) {
            await refreshTmpToken({
                ...credentail,
                isLogout: true
            })
        }
        authStore.delete(ConfigItems.credentail)
        authStore.delete(ConfigItems.ssh)
        successLog('注销登录成功！')
    } catch (e) {
        authStore.delete(ConfigItems.credentail)
        authStore.delete(ConfigItems.ssh)
        throw new CloudBaseError('云端设备登录记录删除失败，请手动删除！')
    }
}
