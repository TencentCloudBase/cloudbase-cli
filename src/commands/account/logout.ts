import { logout } from '../../auth'
import { successLog } from '../../logger'

// 登出
export async function accountLogout() {
    await logout()
    successLog('注销登录成功！')
}
