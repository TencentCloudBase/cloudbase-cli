import os from 'os'
import fse from 'fs-extra'
import low from 'lowdb'
import path from 'path'
import FileAsync from 'lowdb/adapters/FileAsync'
import FileSync from 'lowdb/adapters/FileSync'
import xdgBasedir from 'xdg-basedir'

// 系统配置目录
const configDir = xdgBasedir.config || path.join(os.tmpdir(), '.config')
// cloudbase 配置目录
export const cloudbaseConfigDir = path.join(configDir, '.cloudbase')

// 确保目录存在

fse.ensureDirSync(cloudbaseConfigDir)

export function getAsyncDB(file: string) {
    const dbPath = path.join(cloudbaseConfigDir, `${file}.json`)
    const adapter = new FileAsync(dbPath)
    const db = low(adapter)
    return db
}

export function getSyncDB(file: string) {
    const dbPath = path.join(cloudbaseConfigDir, `${file}.json`)
    const adapter = new FileSync(dbPath)
    const db = low(adapter)
    return db
}

export class LocalStore {
    db: any
    dbKey: string
    defaults: any

    constructor(defaults: any, dbKey = 'common') {
        this.defaults = defaults
        this.dbKey = dbKey
    }

    async getDB() {
        const db = this.db || (await getAsyncDB(this.dbKey))
        this.db = db
        return db
    }

    async get(key: string): Promise<any> {
        const defaultValue = this.defaults[key]
        const db = await this.getDB()
        return db.get(key).value() || defaultValue
    }

    async set(key: string, value: any) {
        const db = await this.getDB()
        await db.set(key, value).write()
    }

    async push(key: string, value: any) {
        const db = await this.getDB()
        await db.get(key).push(value).write()
    }

    async delete(key) {
        const db = await this.getDB()
        await db.unset(key).write()
    }
}
