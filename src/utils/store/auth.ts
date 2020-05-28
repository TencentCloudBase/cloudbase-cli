import os from 'os'
import fs from 'fs'
import path from 'path'
import { checkFullAccess } from '../fs'
import { LocalStore } from './db'
import { ConfigItems } from '../../constant'

class AuthStore extends LocalStore {
    constructor(defaults) {
        super(defaults, 'auth')
        this.defaults = defaults
        this.moveOldConfig()
    }

    // TODO: 迁移并删除旧的配置文件中的数据（在后续迭代中删除）
    async moveOldConfig() {
        const db = await this.getDB()
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
                await db.set(ConfigItems.credential, credential).write()
                await db.set(ConfigItems.ssh, ssh).write()
                fs.unlinkSync(oldConfigPath)
            } catch (e) {
                fs.unlinkSync(oldConfigPath)
            }
        }
    }
}

export const authStore = new AuthStore({
    _: '这是您的 CloudBase 身份凭据文件，请不要分享给他人！',
    [ConfigItems.credential]: {},
    [ConfigItems.ssh]: {}
})

export async function getUin() {
    const credential = await authStore.get(ConfigItems.credential)
    return credential?.uin || '无'
}
