import { PARAM_METADATA, ParamTypes } from './constants'
import { ICommandContext } from '../types'

/**
 * 在方法中注入 params 中定义的各种参数
 */
export function InjectParams(): MethodDecorator {
    return function (target: any, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        const rawFunc: Function = descriptor.value

        // 解析需要注入的参数
        const paramMetadata = Reflect.getMetadata(PARAM_METADATA, target[key])

        if (paramMetadata) {
            descriptor.value = async function (...args) {
                // 命令 context
                const ctx: ICommandContext = args[0] || {}

                for (const paramKey in paramMetadata) {
                    if (Object.prototype.hasOwnProperty.call(paramMetadata, paramKey)) {
                        const { getter, index } = paramMetadata[paramKey]
                        switch (paramKey) {
                            // 从 context 中注入命令行参数
                            case ParamTypes.CmdContext:
                                args[index] = ctx
                                break
                            case ParamTypes.Config:
                                args[index] = ctx.config
                                break
                            case ParamTypes.ArgsParams:
                                args[index] = ctx.params
                                break
                            case ParamTypes.ArgsOptions:
                                args[index] = ctx.options
                                break
                            case ParamTypes.EnvId:
                                args[index] = ctx.envId
                                break
                            default: {
                                // 注入其他与命令行不相关的参数
                                const injectValue = await getter(target)
                                args[index] = injectValue
                            }
                        }
                    }
                }

                return rawFunc.apply(this, args)
            }
        }

        return descriptor
    }
}
