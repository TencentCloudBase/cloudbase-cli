import { ParamTypes, PARAM_METADATA } from '../constants'

type GetterFunction = (target: any) => Promise<any> | any

/**
 * 创建参数装饰器
 * @param paramtype 参数类型名
 * @param getter decorator 取值函数
 */
export const createParamDecorator = (paramtype: ParamTypes, getter: GetterFunction) => {
    return () => {
        return (target: any, key: string | symbol, index: number) => {
            const data = Reflect.getMetadata(PARAM_METADATA, target[key]) || {}

            Reflect.defineMetadata(
                PARAM_METADATA,
                {
                    ...data,
                    [paramtype]: {
                        index,
                        getter
                    }
                },
                target[key]
            )
        }
    }
}
