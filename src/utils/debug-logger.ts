import chalk from 'chalk'
import fs from 'fs'

/**
 * 
 * @description DEBUG 模式下打印日志并写入日志文件
 * @param req 请求参数
 * @param resp 响应内容
 * @param {Date} startTime 请求时间
 * @param {Date} endTime 响应时间
 * @param writeToLocal 是否写入日志文件，默认写入
 * @returns 
 */
export function debugLogger(req: unknown, resp: unknown, startTime: Date, endTime: Date, writeToLocal = true): void {
    if (process.env.NODE_ENV !== 'DEBUG') {
        return
    }
    const cost = endTime.valueOf() - startTime.valueOf()
    const startTimeFormatted = startTime.toISOString()
    const endTimeFormatted = endTime.toISOString()

    console.log(chalk.underline('\n[DEBUG]', startTimeFormatted))
    console.log(chalk.cyan(JSON.stringify(req)), '\n')
    console.log(chalk.underline('[DEBUG]', endTimeFormatted))
    console.log(chalk.magenta(JSON.stringify(resp)), '\n')

    if (writeToLocal) {
        const filePath = `${process.cwd()}/cloudbase-cli.debug.log`
        const logContent = `\n{start:${startTimeFormatted}, req: ${JSON.stringify(req)}, end:${endTimeFormatted}, resp: ${JSON.stringify(resp)}, cost: ${cost}}`
        // 异步追加写入日志
        fs.appendFile(filePath, logContent, (err) => {
            if (err) {
                console.error(chalk.red(`\n写入日志失败：${JSON.stringify(err)}`))
            }
        })
    }
}