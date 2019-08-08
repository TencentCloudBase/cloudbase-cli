import path from 'path'
import os from 'os'
import fs from 'fs'
import _ConfigStore from 'configstore'
import { ConfigItems } from '../constant'

const ConfigDefaultItems = [ConfigItems.credentail]

class ConfigStore extends _ConfigStore {
    constructor(packageName: string, defaults?: any, options?: any) {
        super(packageName, defaults, options)
        this.deleteOldConfig()
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

    // TODO: 删除旧的配置文件（在后续迭代中删除）
    deleteOldConfig() {
        const oldConfigPath = path.resolve(os.homedir(), 'tcbrc.json')
        if (fs.existsSync(oldConfigPath)) {
            fs.unlinkSync(oldConfigPath)
        }
    }
}

export const configStore = new ConfigStore('@cloudbase/cli')
