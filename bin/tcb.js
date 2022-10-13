#!/usr/bin/env node
const os = require('os')
const yargsParser = require('yargs-parser')
const chalk = require('chalk')
const address = require('address')
const { program } = require('commander')
const Sentry = require('@sentry/node')
const logSymbols = require('log-symbols')
const didYouMean = require('didyoumean')
const updateNotifier = require('update-notifier')
const frameworkPkg = require('@cloudbase/framework-core/package.json')

const pkg = require('../package.json')
const store = require('../lib/utils/store')
const { ALL_COMMANDS } = require('../lib/constant')
const { getProxy } = require('../lib/utils/net')
const { getCloudBaseConfig, checkPrivateSettingsExisted } = require('../lib/utils/config')
const {registerCommands} = require('../lib')

async function main() {
let processArgv = process.argv
const isBeta = pkg.version.indexOf('-') > -1
process.CLI_VERSION = pkg.version

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
    integrations: [
        new Sentry.Integrations.OnUnhandledRejection({
            mode: 'none'
        })
    ]
})

// 输出版本信息
console.log(chalk.gray(`CloudBase CLI ${pkg.version}`))
console.log(chalk.gray(`CloudBase Framework ${frameworkPkg.version}`))


const yargsParsedResult = yargsParser(process.argv.slice(2));
const config = await getCloudBaseConfig(yargsParsedResult.configFile);
const isPrivateEnv = checkPrivateSettingsExisted(config)
if (isPrivateEnv) {
    console.log(chalk.gray(`检测到私有化配置`))
}

// 注册命令
await registerCommands()

// 设置 Sentry 上报的用户 uin
Sentry.configureScope((scope) => {
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
program.storeOptionsAsProperties(false)
program.option('--verbose', '打印出内部运行信息')
program.option('--mode <mode>', '指定加载 env 文件的环境')
program.option('--config-file <path>', '设置配置文件，默认为 cloudbaserc.json')
program.option('-r, --region <region>', '指定环境地域')

if(!isPrivateEnv) {
    // HACK: 隐藏自动生成的 help 信息
    program.helpOption(false)
}
const isCommandEmpty = yargsParsedResult._.length === 0;

// -v 时输出的版本信息，设置时避免影响其他命令使用 -v
if (isCommandEmpty) {
    program.version(
        `\nCLI: ${pkg.version}\nFramework: ${frameworkPkg.version}`,
        '-v, --version',
        '输出当前 CloudBase CLI 版本'
    )
}

// 处理无效命令
program.action(() => {
    const args = program.args
    if (!Array.isArray(args) || !args.length) {
        return
    }
    const cmd = args.join(' ')
    console.log(chalk.bold.red('Error: ') + `${cmd} 不是有效的命令`)
    didYouMean.threshold = 0.5
    didYouMean.caseSensitive = false
    const suggest = didYouMean(cmd, ALL_COMMANDS)
    if (suggest) {
        console.log(chalk.bold(`\n您是不是想使用命令：tcb ${suggest}\n`))
    }
    console.log(`💡使用 ${chalk.bold('tcb -h')} 查看所有命令`)
})

// 没有使用命令
if (isCommandEmpty) {
    if(isPrivateEnv) {
        program.outputHelp()
    } else {
        if (['-h', '--help'].includes(processArgv[2])) {
            // 需要隐藏的选项
            const hideArgs = ['-h', '--help']
            hideArgs.forEach((arg) => {
                const index = processArgv.indexOf(arg)
                if (index > -1) {
                    processArgv.splice(index, 1)
                }
            })
            const { outputHelpInfo } = require('../lib/help')
            outputHelpInfo()
        } else if (!['-v', '--version'].includes(processArgv[2])) {
            // HACK: framework 智能命令
            const { smartDeploy } = require('../lib')
            smartDeploy()
        }
    }
}

try {
    program.parse(processArgv)
} catch (e) {
    const errMsg = `${logSymbols.error} ${e.message || '参数异常，请检查您是否使用了正确的命令！'}`
    console.log(errMsg)
}

/**
 * 处理异常
 */
function errorHandler(err) {
    process.emit('tcbError')
    const stackIngoreErrors = ['TencentCloudSDKHttpException', 'CloudBaseError']
    // 忽略自定义错误的错误栈
    if (err && err.stack && !stackIngoreErrors.includes(err.name)) {
        console.log(err.stack)
    }

    // 3 空格，兼容中文字符编码长度问题
    if (err && err.message) {
        let errMsg = logSymbols.error + ' ' + err.message
        errMsg += err.requestId ? `\n${err.requestId}` : ''
        console.log(errMsg)

        // 多地域错误提示
        if (errMsg.includes('Environment') && errMsg.includes('not found')) {
            console.log(
                chalk.yellow.bold(
                    '\n此环境可能不属于当前账号，或为非上海地域环境，如需切换地域请追加参数（例：-r gz），请检查环境归属，参考多地域使用方法：https://docs.cloudbase.net/cli-v1/region.html'
                )
            )
        }
    }

    // 输出详细的错误信息
    if (processArgv.includes('--verbose')) {
        console.log(err)
    }

    process.emit('tcbExit')
    setTimeout(() => {
        process.exit(1)
    }, 1000)
}

process.on('uncaughtException', errorHandler)
process.on('unhandledRejection', errorHandler)

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

}

if(require.main === module) {
    main()
}