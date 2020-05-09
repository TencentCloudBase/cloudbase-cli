import { Logger } from './params/_log'

/**
 * 废弃命令
 * @param tip
 */
export const Deprecate = (options: { tip: string; allowExecute: boolean }): MethodDecorator => (
    target: any,
    key: string,
    descriptor: TypedPropertyDescriptor<any>
) => {
    const { tip, allowExecute } = options
    const rawFunc: Function = descriptor.value

    descriptor.value = function (...args) {
        const log = new Logger()
        log.error(tip || '此命令已废弃！')

        if (allowExecute) {
            rawFunc.apply(this, args)
        }
    }

    return descriptor
}
