import os from 'os'
import fs from 'fs'
import path from 'path'
import { getAuthDB } from './auth'
import { ConfigItems } from '../../constant'
import { checkFullAccess } from '../fs'

class AuthStore {
    db: any
    defaults: any

    constructor(defaults) {
        this.defaults = defaults
        this.db = getAuthDB()
        this.db.defaults(defaults)
        this.moveOldConfig()
    }

    get(item: string): Record<string, any> {
        const defaultValue = this.defaults[item]
        return this.db.get(item).value() || defaultValue
    }

    set(item: string, value: any) {
        this.db.set(item, value).write()
    }

    delete(item) {
        this.db.unset(item).write()
    }

    // TODO: 迁移并删除旧的配置文件中的数据（在后续迭代中删除）
    moveOldConfig() {
        const oldConfigPath = path.resolve(
            os.homedir(),
            '.config',
            'configstore',
            '@cloudbase',
            'cli.json'
        )

        if (checkFullAccess(oldConfigPath)) {
            try {
                const content = JSON.parse(fs.readFileSync(oldConfigPath, 'utf8'))
                const { credential, ssh } = content
                this.db.set(ConfigItems.credentail, credential).write()
                this.db.set(ConfigItems.ssh, ssh).write()
                fs.unlinkSync(oldConfigPath)
            } catch (e) {
                fs.unlinkSync(oldConfigPath)
            }
        }
    }
}

export const authStore = new AuthStore({
    _: '这是您的 CloudBase 身份凭据文件，请不要分享给他人！',
    [ConfigItems.credentail]: {},
    [ConfigItems.ssh]: {}
})
