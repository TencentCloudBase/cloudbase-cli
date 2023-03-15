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
const { CloudApiService } = require('@cloudbase/cloud-api')
const { getCredentialWithoutCheck } = require('@cloudbase/toolbox')
const { Confirm } = require('enquirer')
const execa = require('execa')

const pkg = require('../package.json')
const store = require('../lib/utils/store')
const { ALL_COMMANDS } = require('../lib/constant')
const { getProxy } = require('../lib/utils/net')
const { getCloudBaseConfig, getPrivateSettings } = require('../lib/utils/config')
const { registerCommands } = require('../lib')


const regionSupported = ['ap-shanghai', 'ap-beijing', 'ap-guangzhou']
const regionSupportedMap = {
    'ap-shanghai': '上海',
    'ap-beijing': '北京',
    'ap-guangzhou': '广州',
    'sh': '上海',
    'bj': '北京',
    'gz': '广州'
}

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
    const privateSettings = getPrivateSettings(config);
    if (privateSettings) {
        console.log(chalk.gray(`检测到私有化配置`))
        if (privateSettings.endpoints && privateSettings.endpoints.cliApi) {
            // 初始化 lowcode 服务cliapi入口
            process.env.CLOUDBASE_LOWCODE_CLOUDAPI_URL = privateSettings.endpoints.cliApi;
        }

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

    if (!privateSettings) {
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
        if (privateSettings) {
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
    async function errorHandler(err) {
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
                // 检查是否已经指定了 -r 或 --region 参数，如未指定则尝试获取地域信息
                const regionSpecified = processArgv.indexOf('-r') !== -1 || processArgv.indexOf('--region') !== -1
                const region = yargsParsedResult?.r || yargsParsedResult?.region
                const multiRegionErrMsg = `\n此环境可能不属于当前账号，或为非${regionSupportedMap[region] || '上海'}地域环境，如需切换地域请追加参数（例：-r gz），请检查环境归属，参考多地域使用方法：https://docs.cloudbase.net/cli-v1/region.html`
                if (!regionSpecified) {

                    // 从 -e 参数、--envId 参数和配置文件中获取环境 id
                    const envId = yargsParsedResult?.e || yargsParsedResult?.envId || config?.envId

                    // 调用 API 接口尝试查询环境信息
                    const predictRegion = await tryTellEnvRegion(envId)

                    if (regionSupported.includes(predictRegion)) {
                        // 让用户选择是否切换地域
                        const prompt = new Confirm({
                            type: 'confirm',
                            name: 'confirm',
                            message: `该环境可能属于 ${regionSupportedMap[predictRegion]} 地域，是否切换地域并重新执行命令？`,
                            initial: 'Y'
                        })
                        const confirm = await prompt.run()
                        if (confirm) {
                            // 检查原始命令是否已经追加了 -r 参数，如果有则替换，如果没有则追加
                            const regionArgIndex = processArgv.indexOf('-r')
                            if (regionArgIndex !== -1) {
                                processArgv[regionArgIndex + 1] = predictRegion
                            } else {
                                processArgv.push('-r', predictRegion)
                            }
                            // 重新执行命令
                            const newArgvStr = processArgv.slice(2).join(' ')
                            console.log(`\n${chalk.yellow.bold('正在重新执行命令：')} tcb ${newArgvStr}\n`)
                            await execa('tcb', processArgv.slice(2), {
                                stdio: 'inherit'
                            })
                            process.emit('tcbExit')
                            process.exit(0)
                        } else {
                            console.log(chalk.yellow.bold(multiRegionErrMsg))
                        }
                    }
                } else {
                    console.log(chalk.yellow.bold(multiRegionErrMsg))
                }
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

    const isTokenExpired = (credential, gap = 120) =>
        credential.accessTokenExpired && Number(credential.accessTokenExpired) < Date.now() + gap * 1000

    async function tryTellEnvRegion(envId) {
        // 依次调用不同地域的 API 接口查询环境信息
        const fetchedRegion = await Promise.all(regionSupported.map(async region => {
            const res = await fetchEnvInfoWithRegion(envId, region)
            if (res?.EnvList?.length !== 0 && res?.EnvList.find(item => item.EnvId === envId)) {
                return res.EnvList[0].Region
            }
            return ''
        }))

        let predictRegion = ''
        fetchedRegion.forEach(region => {
            if (region) {
                predictRegion = region
            }
        })
        return predictRegion
    }

    // 在指定地域调用 API 接口查询环境信息
    async function fetchEnvInfoWithRegion(envId, region) {
        let commonCredential
        const commonOpts = {
            service: 'tcb',
            version: '2019-09-24',
            proxy: getProxy(),
            timeout: 15000,
            getCredential: async () => {
                if (commonCredential?.secretId && !isTokenExpired(commonCredential)) {
                    return commonCredential
                }
                const credential = await getCredentialWithoutCheck()
                if (!credential) {
                    throw new Error('无有效身份信息，请使用 cloudbase login 登录')
                }
                commonCredential = credential
                return {
                    ...credential,
                    tokenExpired: Number(credential.accessTokenExpired)
                }
            }
        }
        const apiName = 'DescribeEnvs'
        const tcbApi = new CloudApiService({
            ...commonOpts,
            region
        })
        const res = await tcbApi.request(apiName, {
            EnvId: envId,
        })
        return res
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

if (require.main === module) {
    try {
        main()
    } catch (error) {
        console.log(error)
    }
}
process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection', err)
})