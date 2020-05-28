import { authSupevisor } from '../utils'

// 注销登录信息
export async function logout() {
    process.emit('logout')
    await authSupevisor.logout()
}
