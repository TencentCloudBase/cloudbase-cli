#!/usr/bin/env node
const program = require('commander')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

// 检查更新
const ONE_DAY = 86400000
const notifier = updateNotifier({
    pkg,
    // 检查更新间隔 1 天
    updateCheckInterval: ONE_DAY
})
notifier.notify()

// 注册命令
require('../lib')

program.version(pkg.version)

// 处理无效命令
program.action(cmd => {
    console.log(chalk.bold.red('Error: ') + `${cmd} 不是有效的命令！`)
    console.log(`使用 ${chalk.bold('tcb -h')} 查看所有命令~`)
})

// 当没有输入任何命令时，显示帮助信息
if (process.argv.length < 3) {
    program.outputHelp()
    const tips = `\nTips:

    ${chalk.gray('–')} 登录
  
      ${chalk.cyan('$ tcb login')}
  
    ${chalk.gray('–')} 列出环境列表
  
      ${chalk.cyan('$ tcb env:list')}
  
    ${chalk.gray('–')} 部署云函数
  
      ${chalk.cyan('$ tcb functions:deploy')}`

    console.log(tips)
}

program.parse(process.argv)

function errorHandler(err) {
    const stackIngoreErrors = ['TencentCloudSDKHttpException', 'TcbError']
    // 忽略自定义错误的错误栈
    if (err.stack && !stackIngoreErrors.includes(err.name)) {
        console.log(err.stack)
    }
    // 3 空格，兼容中文字符编码长度问题
    console.log(logSymbols.error + ' ' + err.message)
}

process.on('uncaughtException', errorHandler)
process.on('unhandledRejection', errorHandler)
