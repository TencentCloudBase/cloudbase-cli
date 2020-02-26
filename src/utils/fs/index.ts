import fs from 'fs'
import { CloudBaseError } from '../../error'

export * from './del'
export * from './compress'

export type SizeUnit = 'KB' | 'MB' | 'GB'

// 检查路径是否可以访问（读、写）
export function checkFullAccess(dest: string, throwError = false): boolean {
    try {
        // 可见、可写
        fs.accessSync(dest, fs.constants.F_OK)
        fs.accessSync(dest, fs.constants.W_OK)
        fs.accessSync(dest, fs.constants.R_OK)
        return true
    } catch (e) {
        if (throwError) {
            throw new CloudBaseError(`路径不存在或没有权限访问：${dest}`)
        } else {
            return false
        }
    }
}

// 检查路径是否可以读
export function checkWritable(dest: string, throwError = false): boolean {
    try {
        // 可见、可写
        fs.accessSync(dest, fs.constants.F_OK)
        fs.accessSync(dest, fs.constants.W_OK)
        return true
    } catch (e) {
        if (throwError) {
            throw new CloudBaseError(`路径不存在或没有权限访问：${dest}`)
        } else {
            return false
        }
    }
}

// 检查路径是否可以写
export function checkReadable(dest: string, throwError = false): boolean {
    try {
        // 可见、可读
        fs.accessSync(dest, fs.constants.F_OK)
        fs.accessSync(dest, fs.constants.R_OK)
        return true
    } catch (e) {
        if (throwError) {
            throw new CloudBaseError(`路径不存在或没有权限访问：${dest}`)
        } else {
            return false
        }
    }
}

export function isDirectory(dest: string) {
    checkFullAccess(dest, true)
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
