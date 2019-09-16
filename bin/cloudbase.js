#!/usr/bin/env node
const program = require('commander')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

const isBeta = pkg.version.indexOf('-') > -1

// 检查更新
const ONE_DAY = 86400000
// Beta 版 1 个小时检查一次，稳定版 1 天检查一次
const CheckInterval = isBeta ? 3600000 : ONE_DAY

const notifier = updateNotifier({
    pkg,
    distTag: isBeta ? 'beta' : 'latest',
    // 检查更新间隔 1 天
    updateCheckInterval: CheckInterval
})

notifier.notify({
    isGlobal: true
})

// 注册命令
require('../lib')

program.option(
    '--config-file <path>',
    '设置配置文件，默认为 ./cloudbaserc.js 或 .cloudbaserc.json'
)

program.version(pkg.version, '-V, --version', '输出当前 CloudBase CLI 版本')

// 处理无效命令
program.action(cmd => {
    console.log(chalk.bold.red('Error: ') + `${cmd} 不是有效的命令！`)
    console.log(`使用 ${chalk.bold('cloudbase -h')} 查看所有命令~`)
})

// 修改 help 提示信息
program._helpDescription = '输出帮助信息'
program.on('--help', function() {
    const tips = `\nTips:

${chalk.gray('–')} 登录

  ${chalk.cyan('$ cloudbase login')}

${chalk.gray('–')} 初始化云开发项目

  ${chalk.cyan('$ cloudbase init')}

${chalk.gray('–')} 部署云函数

  ${chalk.cyan('$ cloudbase functions:deploy')}`
    console.log(tips)
})

// 当没有输入任何命令时，显示帮助信息
if (process.argv.length < 3) {
    program.outputHelp()
}

program.parse(process.argv)

function errorHandler(err) {
    const stackIngoreErrors = ['TencentCloudSDKHttpException', 'CloudBaseError']
    // 忽略自定义错误的错误栈
    if (err.stack && !stackIngoreErrors.includes(err.name)) {
        console.log(err.stack)
    }
    // 3 空格，兼容中文字符编码长度问题
    console.log(logSymbols.error + ' ' + err.message)
}

process.on('uncaughtException', errorHandler)
process.on('unhandledRejection', errorHandler)
