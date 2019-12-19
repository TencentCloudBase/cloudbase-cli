import fs from 'fs'
import { CloudBaseError } from '../../error'

export type SizeUnit = 'KB' | 'MB' | 'GB'

export function checkPathExist(dest: string, throwError = false): boolean {
    const exist = fs.existsSync(dest)

    if (!exist && throwError) {
        throw new CloudBaseError(`路径不存在：${dest}`)
    }

    return exist
}

export function isDirectory(dest: string) {
    checkPathExist(dest, true)
    return fs.statSync(dest).isDirectory()
}

export function formateFileSize(size: number | string, unit: SizeUnit) {
    const numSize = Number(size)
    const unitMap = {
        KB: 1024,
        MB: Math.pow(1024, 2),
        GB: Math.pow(1024, 3)
    }

    return Number(numSize / unitMap[unit]).toFixed(2)
}

export * from './del'
