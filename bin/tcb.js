#!/usr/bin/env node
const program = require('commander')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
// 注册命令
require('../lib')

// 处理无效命令
program.action(cmd => {
    console.log(chalk.bold.red('Error: ') + `${cmd} 不是有效的命令`)
})

// 当没有输入任何命令时，显示帮助信息
if (process.argv.length < 3) {
    program.help()
}

program.parse(process.argv)

function errorHandler(err) {
    // 当存在错误栈，且不是 SDK 请求返回的错误时，才打印错误栈
    if (err.stack && err.name !== 'TencentCloudSDKHttpException') {
        console.log(err.stack)
    }
    // 3 空格，兼容中文字符编码长度问题
    console.log(logSymbols.error + ' ' + chalk.red(err.message))
    process.exitCode = err.exit || 2
    setTimeout(function() {
        process.exit()
    }, 250)
}

process.on('uncaughtException', errorHandler)
process.on('unhandledRejection', errorHandler)
