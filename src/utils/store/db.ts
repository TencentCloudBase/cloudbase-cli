import os from 'os'
import fse from 'fs-extra'
import low from 'lowdb'
import path from 'path'
import FileSync from 'lowdb/adapters/FileSync'
import xdgBasedir from 'xdg-basedir'

// 系统配置目录
const configDir = xdgBasedir.config || path.join(os.tmpdir(), '.config')
// cloudbase 配置目录
export const cloudbaseConfigDir = path.join(configDir, '.cloudbase')

// 确保目录存在
fse.ensureDirSync(cloudbaseConfigDir)

export function getDB(file: string) {
    const dbPath = path.join(cloudbaseConfigDir, `${file}.json`)
    const adapter = new FileSync(dbPath)
    const db = low(adapter)
    return db
}
