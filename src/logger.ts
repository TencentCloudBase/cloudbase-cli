import chalk from 'chalk'
import * as logSymbols from 'log-symbols'

export default class Logger {
    private moduleName: string
    constructor(moduleName) {
        this.moduleName = moduleName
    }

    genLog(level: string, msg) {
        const LevelColorMap = {
            info: 'blue',
            error: 'red',
            success: 'green'
        }
        return [
            logSymbols[level],
            chalk[LevelColorMap[level]](`[${this.moduleName}]`),
            msg
        ].join(' ')
    }

    log(msg) {
        if (!this.moduleName) {
            console.log(`${logSymbols.info} ${msg}`)
        } else {
            console.log(this.genLog('info', msg))
        }
    }

    success(msg) {
        if (!this.moduleName) {
            console.log(`${logSymbols.success} ${msg}`)
        } else {
            console.log(this.genLog('success', msg))
        }
    }

    error(msg) {
        if (!this.moduleName) {
            console.log(`${logSymbols.error} ${msg}`)
        } else {
            console.log(this.genLog('error', msg))
        }
    }
}

export function errorLog(msg: string) {
    // 空格，兼容中文字符编码长度问题
    console.log(`${logSymbols.error} ${msg}`)
}

export function successLog(msg: string) {
    // 空格，兼容中文字符编码长度问题
    console.log(`${logSymbols.success} ${msg}`)
}
