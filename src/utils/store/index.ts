import os from 'os'
import fs from 'fs'
import path from 'path'
import { LocalStore } from './local-store'
import { ConfigItems } from '../../constant'

const ConfigDefaultItems = [ConfigItems.credentail]

class AuthStore extends LocalStore {
    constructor(name: string, defaults) {
        super(name, defaults)
        this.moveOldConfig()
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

    // 迁移并删除旧的配置文件中的数据（在后续迭代中删除）
    moveOldConfig() {
        const oldConfigPath = path.resolve(
            os.homedir(),
            '.config',
            'configstore',
            '@cloudbase',
            'cli.json'
        )

        if (fs.existsSync(oldConfigPath)) {
            try {
                const content = JSON.parse(
                    fs.readFileSync(oldConfigPath, 'utf8')
                )
                const { credential, ssh } = content
                this.set(ConfigItems.credentail, credential)
                this.set(ConfigItems.ssh, ssh)
                fs.unlinkSync(oldConfigPath)
            } catch (e) {
                fs.unlinkSync(oldConfigPath)
            }
        }
    }
}

export const authStore = new AuthStore('auth', {
    _: '这是您的 CloudBase 身份凭据文件，请不要分享给他人！',
    [ConfigItems.credentail]: {},
    [ConfigItems.ssh]: {}
})
