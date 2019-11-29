import { assertHas, assertTrue } from './validator'
import { CloudBaseConfig, IFlattenFunctionConfig } from '../types'

// 从 CloudBaseConfig 中查找函数的配置，并返回扁平化的配置对象
export function findAndFlattenFunConfig(
    baseConfig: CloudBaseConfig,
    name: string
): IFlattenFunctionConfig {
    assertHas(baseConfig, 'functions', '未找到函数配置！')
    const fun = baseConfig.functions.find(item => item.name === name)
    assertTrue(fun, `未找到函数 ${name} `)

    const config = fun.config || {}
    delete fun.config
    return {
        ...config,
        ...fun
    }
}
