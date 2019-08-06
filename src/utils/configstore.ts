import _ConfigStore from 'configstore'
import { ConfigItems } from '../constant'

const ConfigDefaultItems = [ConfigItems.credentail]

class ConfigStore extends _ConfigStore {
    constructor(packageName: string, defaults?: any, options?: any) {
        super(packageName, defaults, options)
    }

    // 重写 get 方法，防止部分值没有处理 undefined 报错
    get(item: string): Record<string, any> {
        // config 中不存在时返回 {}
        if (ConfigDefaultItems.includes(item)) {
            return super.get(item) || {}
        } else {
            // config 中不存在时，需要返回 undefined，如数字，字符串，bool
            return super.get(item)
        }
    }
}

export const configStore = new ConfigStore('@cloudbase/cli')
