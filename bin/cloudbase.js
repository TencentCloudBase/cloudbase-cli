#!/usr/bin/env node
const os = require('os')
const path = require('path')
const chalk = require('chalk')
const Sentry = require('@sentry/node')
const program = require('commander')
const logSymbols = require('log-symbols')
const updateNotifier = require('update-notifier')
const address = require('address')
const pkg = require('../package.json')
const store = require('../lib/utils/store')
const { getProxy } = require('../lib/utils/proxy')
const { handleCompletion } = require('../lib/completion')

let processArgv = process.argv
const isBeta = pkg.version.indexOf('-') > -1

const [major, minor] = process.versions.node.split('.').slice(0, 2)

// Node 版本检验提示
if (Number(major) < 8 || (Number(major) === 8 && Number(minor) < 6)) {
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
    httpsProxy: getProxy() || '',
    serverName: os.hostname(),
    // 忽略错误，正则匹配,
    // ignoreErrors: [],
    integrations: [
        new Sentry.Integrations.OnUnhandledRejection({
            mode: 'none'
        })
    ]
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
if (processArgv.includes('-debug')) {
    console.log(
        chalk.bold.yellow('====\n您已经进入 debug 模式！\n移除 -debug 选项退出 debug 模式！\n====')
    )
}

if (processArgv.includes('--tcb-test')) {
    console.log(
        chalk.bold.yellow(
            '====\n您已经进入 test 模式！\n移除 --tcb-test 选项退出 test 模式！\n===='
        )
    )
    try {
        const envs = require(path.join(process.cwd(), './tcb-test.js'))
        for (const key in envs) {
            process.env[key] = envs[key]
        }
    } catch (err) {
        console.log(err)
    }
}

// debug 模式
process.IS_DEBUG = processArgv.includes('-debug')
if (processArgv.includes('completion')) {
    return handleCompletion()
}

// 需要隐藏的选项
const hideArgs = ['-debug', '--tcb-test', '--completion']
hideArgs.forEach(arg => {
    const index = processArgv.indexOf(arg)
    if (index > -1) {
        processArgv.splice(index, 1)
    }
})

// 注册命令
require('../lib')

// console.log(Object.keys(program._events))

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

program.version(pkg.version, '-v, --version', '输出当前 CloudBase CLI 版本')

// 处理无效命令
program.action(cmd => {
    console.log(chalk.bold.red('Error: ') + `${cmd} 不是有效的命令！`)
    console.log(`使用 ${chalk.bold('cloudbase -h')} 查看所有命令~`)
})

// 修改 help 提示信息
program._helpDescription = '输出帮助信息'
program.on('--help', function() {
    const tips = `\nTips:

${chalk.gray('–')} 简写

  ${chalk.cyan('使用 tcb 替代 cloudbase')}

${chalk.gray('–')} 登录

  ${chalk.cyan('$ cloudbase login')}

${chalk.gray('–')} 初始化云开发项目

  ${chalk.cyan('$ cloudbase init')}

${chalk.gray('–')} 部署云函数

  ${chalk.cyan('$ cloudbase functions:deploy')}

${chalk.gray('–')} 查看命令使用介绍

  ${chalk.cyan('$ cloudbase env:list -h')}`
    console.log(tips)
})

// 当没有输入任何命令时，显示帮助信息
if (process.argv.length < 3) {
    program.outputHelp()
}

try {
    program.parse(processArgv)
} catch (e) {
    const errMsg = `${logSymbols.error} ${e.message || '参数异常，请检查您是否使用了正确的命令！'}`
    console.log(errMsg)
}

function errorHandler(err) {
    process.emit('tcbError')
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
