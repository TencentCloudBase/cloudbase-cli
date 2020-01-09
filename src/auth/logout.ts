import { getCredentialData, authStore, refreshTmpToken } from '../utils'
import { ConfigItems } from '../constant'

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
    } catch (e) {
        authStore.delete(ConfigItems.credentail)
        authStore.delete(ConfigItems.ssh)
    }
}
