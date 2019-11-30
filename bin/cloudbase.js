#!/usr/bin/env node
const os = require('os')
const chalk = require('chalk')
const Sentry = require('@sentry/node')
const program = require('commander')
const logSymbols = require('log-symbols')
const updateNotifier = require('update-notifier')
const address = require('address')
const pkg = require('../package.json')

let processArgv = process.argv
const isBeta = pkg.version.indexOf('-') > -1

const userNodeVersion = Number(
    process.versions.node
        .split('.')
        .slice(0, 2)
        .join('.')
)

// Node 版本检验提示
if (userNodeVersion < 8.6) {
    console.log(
        chalk.bold.red(
            '您的 Node 版本较低，CloudBase CLI 可能无法正常运行，请升级 Node 到 v8.6.0 以上！\n'
        )
    )
}

// Sentry 错误上报
Sentry.init({
    release: pkg.version,
    dsn: 'https://fff0077d06624655ad70d1ee25df419e@report.url.cn/sentry/1782',
    httpsProxy: process.env.http_proxy || '',
    serverName: os.hostname()
    // 忽略错误，正则匹配
    // ignoreErrors
})

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

// 测试模式
if (processArgv.includes('--deb')) {
    console.log(
        chalk.bold.yellow('====\n您已经进入 debug 模式！\n移除 --deb 选项退出 debug 模式！\n====')
    )
}

// debug 模式
process.IS_DEBUG = processArgv.includes('--deb')

// 需要隐藏的选项
const hideArgs = ['--deb']
hideArgs.forEach(arg => {
    const index = processArgv.indexOf(arg)
    if (index > -1) {
        processArgv.splice(index, 1)
    }
})

// 注册命令
require('../lib')

const store = require('../lib/utils/store')

// 设置 Sentry 上报的用户 uin
Sentry.configureScope(scope => {
    try {
        const credential = store.authStore.get('credential') || {}
        scope.setUser({
            uin: credential.uin || '',
            ip: address.ip() || ''
        })
    } catch (e) {
        Sentry.captureException(e)
    }
})

// 设置 options 选项
program.option('--config-file <path>', '设置配置文件，默认为 ./cloudbaserc.js 或 .cloudbaserc.json')

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

  ${chalk.cyan('$ cloudbase functions:deploy')}

${chalk.gray('–')} 查看命令使用介绍

  ${chalk.cyan('$ cloudbase functions:log -h')}`
    console.log(tips)
})

// 当没有输入任何命令时，显示帮助信息
if (process.argv.length < 3) {
    program.outputHelp()
}

program.parse(processArgv)

function errorHandler(err) {
    const stackIngoreErrors = ['TencentCloudSDKHttpException', 'CloudBaseError']
    // 忽略自定义错误的错误栈
    if (err.stack && !stackIngoreErrors.includes(err.name)) {
        console.log(err.stack)
    }
    // 3 空格，兼容中文字符编码长度问题
    console.log(logSymbols.error + ' ' + err.message)
    process.emit('tcbExit')
    setTimeout(() => {
        process.exit(1)
    }, 1000)
}

process.on('uncaughtException', errorHandler)
process.on('unhandledRejection', errorHandler)
