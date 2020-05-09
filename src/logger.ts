import chalk from 'chalk'
import logSymbols from 'log-symbols'

export function errorLog(msg: string) {
    // 空格，兼容中文字符编码长度问题
    console.log(`${logSymbols.error} ${msg}`)
}

export function successLog(msg: string) {
    // 空格，兼容中文字符编码长度问题
    console.log(`${logSymbols.success} ${msg}`)
}

export function warnLog(msg: string) {
    // 空格，兼容中文字符编码长度问题
    console.log(`${logSymbols.warning} ${msg}`)
}
