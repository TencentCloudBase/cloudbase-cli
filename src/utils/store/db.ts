import os from 'os'
import low from 'lowdb'
import path from 'path'
import FileSync from 'lowdb/adapters/FileSync'
import xdgBasedir from 'xdg-basedir'

// 系统配置目录
const configDir = xdgBasedir.config || path.join(os.tmpdir(), '.config')
// cloudbase 配置目录
const cloudbaseConfigDir = path.join(configDir, '.cloudbase')

export function getAuthDB() {
    const dbPath = path.join(cloudbaseConfigDir, 'auth.json')
    const adapter = new FileSync(dbPath)
    const db = low(adapter)
    return db
}
