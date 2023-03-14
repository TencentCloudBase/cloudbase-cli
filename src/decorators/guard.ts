import { authSupevisor, getCloudBaseConfig } from '../utils'

export interface AuthGuardOptions {
    // 无法通过 guard 认证时的提示信息
    tips?: string
    // 校验配置文件是否存在
    ensureConfig?: boolean
}

/**
 * Auth 装饰器，用于在执行操作前检验是否登录
 * 没有登录时，终止操作，显示登录提示
 */
export const AuthGuard = (options: AuthGuardOptions = {}): MethodDecorator => (
    target: any,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
) => {
    const { tips, ensureConfig = true } = options
    const rawFunc: Function = descriptor.value
    // 修改原函数行为
    descriptor.value = async function (...args) {
        const credential = target?.credential
        const loginState = await authSupevisor.getLoginState()

        // 未登录，终止运行
        if (!credential && !loginState) {
            return
        }

        if (ensureConfig) {
            const config = await getCloudBaseConfig()
            if (!config?.envId) {
                return
            }
        }

        return rawFunc.apply(this, args)
    }

    return descriptor
}
