/**
 * 捕获操作发生的异常，显示错误提示，并在输出中显示详细的错误堆栈信息
 */
export const CaptureError = (): MethodDecorator => (
    target: any,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
) => {
    const rawFunc: Function = descriptor.value

    descriptor.value = async function (...args) {
        try {
            const res = await rawFunc.apply(this, args)
            return res
        } catch (e) {
            const errMsg =
                e?.message ||
                (typeof e?.toString === 'function' ? e.toString() : '') ||
                'Unknown Error'
            // output.showErrorWithMessage(errMsg, e?.stack || errMsg)
        }
    }

    return descriptor
}
