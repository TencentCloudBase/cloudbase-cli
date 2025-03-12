import { loadFunctions, loadFunctionsConfig, runCLI } from '@cloudbase/functions-framework'
import fs from 'fs-extra'
import camelcaseKeys from 'camelcase-keys'
import { IAC, utils as IACUtils, CloudAPI as _CloudAPI } from '@cloudbase/iac-core'
import inquirer from 'inquirer'
import path from 'path'
import { ArgsOptions, CmdContext, EnvId, InjectParams, Log, Logger } from '../../decorators'
import {
    CloudApiService,
    loadingFactory,
    printHorizontalTable,
    getPrivateSettings,
    authSupevisor
} from '../../utils'
import { Command, ICommand } from '../common'
import { EnvSource } from '../constants'
import { selectEnv } from '../utils'
import nodemon from 'nodemon'

const { CloudAPI } = _CloudAPI
const scfService = CloudApiService.getInstance('tcb')

// @ICommand()
export class RunfListCommand extends Command {
    get options() {
        return {
            cmd: 'cloudrunfunction',
            childCmd: 'list',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            requiredEnvId: false,
            autoRunLogin: true,
            desc: '查看函数式托管服务列表'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @Log() log: Logger) {
        const loading = loadingFactory()

        if (!envId) {
            envId = await _selectEnv()
        } else {
            log.info(`当前环境 Id：${envId}`)
        }

        /**
         * 获取函数列表代码示例
         */
        try {
            loading.start('获取函数式托管服务列表中…')
            let serverListRes: any = await scfService
                .request('DescribeCloudBaseRunServers', {
                    EnvId: envId,
                    Limit: 100,
                    Offset: 0
                })
                .finally(() => loading.stop())

            const serverList = serverListRes.CloudBaseRunServerSet?.filter(
                (item) => item.Tag === 'function'
            )

            const head = ['服务名称', '状态', '创建时间', '更新时间']
            const tableData = serverList.map((serverItem) => [
                serverItem.ServerName,
                serverItem.Status,
                serverItem.CreatedTime,
                serverItem.UpdatedTime
            ])
            printHorizontalTable(head, tableData)
        } catch (e) {
            log.error('获取函数式托管服务列表失败：' + e.message)
        }
    }
}

@ICommand()
export class RunfDeployCommand extends Command {
    get options() {
        return {
            cmd: 'cloudrunfunction',
            childCmd: 'deploy',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '服务名称'
                },
                {
                    flags: '--source <source>',
                    desc: '目标函数文件所在目录路径。默认为当前路径'
                }
            ],
            requiredEnvId: false,
            autoRunLogin: true,
            desc: '部署云函数 2.0 服务'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @EnvId() envId, @Log() log: Logger, @ArgsOptions() options) {
        let { serviceName, source } = options

        const targetDir = path.resolve(source || process.cwd())

        /**
         * 校验代码路径
         */
        const target = 'main' // 这是函数式托管规定的目标函数
        const functionsConfigFile = path.resolve(
            targetDir,
            options.functionsConfigFile || 'cloudbase-functions.json'
        )
        let multiFunctionsConfig = null
        if (await fs.exists(functionsConfigFile)) {
            try {
                multiFunctionsConfig = loadFunctionsConfig(functionsConfigFile)
            } catch (err) {
                log.error(`多函数定义配置文件 ${functionsConfigFile} 配置文件有误，请检查`)
                log.error(err)
                return
            }
        }
        const loadResult = await loadFunctions({
            target,
            sourceLocation: targetDir,
            multiFunctionsConfig
        } as any)
        if (Array.isArray(loadResult)) {
            for (const loadItem of loadResult) {
                if (!loadItem?.userFunction) {
                    log.error(`加载函数 ${loadItem?.name} 失败: "${loadItem?.reason}"`)
                    return
                }
            }
        } else {
            if (!loadResult?.userFunction) {
                if (loadResult.reason.includes('is not a loadable module')) {
                    log.error(
                        `${targetDir} 不是一个有效的函数式托管代码目录，可以通过 --source <source> 指定代码目录路径`
                    )
                } else if (loadResult?.reason.includes('is not defined in the provided module')) {
                    log.error(`主文件并未导出目标函数 ${target}，请导出 ${target} 目标函数`)
                } else {
                    log.error(loadResult?.reason)
                }
                return
            }
        }

        /**
         * 选择环境
         */
        if (!envId) {
            const envConfig: any = camelcaseKeys(await IACUtils.loadEnv(targetDir))
            if (envConfig.envId) {
                envId = envConfig.envId
                log.info(`当前环境 Id：${envId}`)
            } else {
                envId = await _selectEnv()
            }
        } else {
            log.info(`当前环境 Id：${envId}`)
        }

        /**
         * 选择服务
         */
        if (!serviceName) {
            let pkgName = ''
            try {
                const pkg = await fs.readJSON(path.join(targetDir, 'package.json'))
                pkgName = pkg.name
            } catch (e) {}

            serviceName = await _inputServiceName(pkgName)
        }

        /**
         * 覆盖提醒
         * 如果目标目录下存在文件，则询问是否覆盖
         */
        const answers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: `即将开始部署，是否确认继续？`,
                default: true
            }
        ])
        if (!answers.confirm) {
            return
        }

        /**
         * 初始化 IAC
         */
        await IAC.init({
            cwd: targetDir,
            getCredential: () => {
                return getCredential(ctx, options)
            },
            polyRepoMode: true
        })

        /**
         * 执行部署
         */

        await _runDeploy()

        async function _runDeploy() {
            try {
                const res = await IAC.FunctionV2.apply(
                    {
                        cwd: targetDir,
                        envId: envId,
                        name: serviceName
                    },
                    function (message) {
                        trackCallback(message, log)
                    }
                )
                const { envId: _envId, name, resourceType: _resourceType } = res?.data
                trackCallback(
                    {
                        details: `请打开链接查看部署状态: https://tcb.cloud.tencent.com/dev?envId=${_envId}#/platform-run/service/detail?serverName=${name}&tabId=deploy&envId=${_envId}`
                    },
                    log
                )
            } catch (e) {
                if (e?.action === 'UpdateCloudRunServer' && e?.code === 'ResourceInUse') {
                    inquirer
                        .prompt([
                            {
                                type: 'confirm',
                                name: 'confirm',
                                message: `平台当前有部署发布任务正在运行中。确认继续部署，正在执行的部署任务将被取消，并立即部署最新的代码`,
                                default: true
                            }
                        ])
                        .then(async (answers) => {
                            if (answers.confirm) {
                                try {
                                    // 获取任务信息
                                    const { task } = await CloudAPI.tcbrServiceRequest(
                                        'DescribeServerManageTask',
                                        {
                                            envId,
                                            serverName: serviceName,
                                            taskId: 0
                                        }
                                    )
                                    const id = task?.id
                                    // 停止任务
                                    await CloudAPI.tcbrServiceRequest('OperateServerManage', {
                                        envId,
                                        operateType: 'cancel',
                                        serverName: serviceName,
                                        taskId: id
                                    })
                                    // 重新部署
                                    await _runDeploy()
                                } catch (e: any) {
                                    trackCallback(
                                        {
                                            type: 'error',
                                            details: e.message
                                        },
                                        log
                                    )
                                }
                            }
                        })
                } else {
                    trackCallback(
                        {
                            type: 'error',
                            details: `${e.message}`,
                            originalError: e
                        },
                        log
                    )
                }
            }
        }
    }
}

@ICommand()
export class RunfDownloadCommand extends Command {
    get options() {
        return {
            cmd: 'cloudrunfunction',
            childCmd: 'download',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '服务名称'
                },
                {
                    flags: '--source <source>',
                    desc: '目标函数文件所在目录路径。默认为当前路径'
                }
            ],
            requiredEnvId: false,
            autoRunLogin: true,
            desc: '下载云函数 2.0 服务代码'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @EnvId() envId, @Log() log: Logger, @ArgsOptions() options) {
        let { serviceName, source } = options

        let targetDir = path.resolve(source || process.cwd())

        /**
         * 选择环境
         */
        if (!envId) {
            const envConfig: any = camelcaseKeys(await IACUtils.loadEnv(targetDir))
            envId = envConfig.envId || (await _selectEnv())
        } else {
            log.info(`当前环境 Id：${envId}`)
        }

        /**
         * 选择服务
         */
        if (!serviceName) {
            let pkgName = ''
            try {
                const pkg = await fs.readJSON(path.join(targetDir, 'package.json'))
                pkgName = pkg.name
            } catch (e) {}

            serviceName = await _inputServiceName(pkgName)

            if (serviceName !== pkgName) {
                // 如果输入的服务名称与 package.json 中的服务名称不一致，则用服务名作为目录名
                targetDir = path.join(targetDir, serviceName)
            }
        }

        /**
         * 覆盖提醒
         * 如果目标目录下存在文件，则询问是否覆盖
         */
        const needTips = !(await isDirectoryEmptyOrNotExists(targetDir))
        if (needTips) {
            const answers = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: `下载将覆盖 ${targetDir} 目录下的代码，是否继续？`,
                    default: true
                }
            ])
            if (!answers.confirm) {
                return
            }
        }

        /**
         * 初始化 IAC
         */
        await IAC.init({
            cwd: targetDir,
            getCredential: () => {
                return getCredential(ctx, options)
            },
            polyRepoMode: true
        })

        /**
         * 执行拉取
         */
        try {
            await IAC.FunctionV2.pull(
                {
                    cwd: targetDir,
                    envId: envId,
                    name: serviceName
                },
                function (message) {
                    trackCallback(message, log)
                }
            )
        } catch (e) {
            trackCallback(
                {
                    type: 'error',
                    details: `${e.message}`,
                    originalError: e
                },
                log
            )
        }
    }
}

@ICommand()
export class RunfRunCommand extends Command {
    get options() {
        return {
            cmd: 'cloudrunfunction',
            childCmd: 'run',
            options: [
                {
                    flags: '--source <source>',
                    desc: `目标函数文件所在目录路径，默认为当前路径
                    `
                },
                {
                    flags: '--port <port>',
                    desc: `监听的端口，默认为 3000
                    `
                },
                {
                    flags: '-w, --watch',
                    desc: `是否启用热重启模式，如启用，将会在文件变更时自动重启服务，默认为 false
                    `
                },
                {
                    flags: '--dry-run',
                    desc: `是否不启动服务，只验证代码可以正常加载，默认为 false
                    `
                },
                {
                    flags: '--logDirname <logDirname>',
                    desc: `日志文件目录，默认为 ./logs
                    `
                },
                {
                    flags: '--functionsConfigFile <functionsConfigFile>',
                    desc: `多函数定义配置文件，默认为 ./cloudbase-functions.json。
                                             环境变量: FUNCTIONS_CONFIG_FILE
                    `
                },
                {
                    flags: '--loadAllFunctions',
                    desc: `是否加载 "functionsRoot" 目录中的所有函数。默认为 false
                    `
                },
                {
                    flags: '--enableCors <enableCors>',
                    desc: `为已配置的源启用跨域资源共享（CORS），默认值为 false
                                             环境变量: ENABLE_CORS
                    `
                },
                {
                    flags: '--allowedOrigins <allowedOrigins>',
                    desc: `设置 CORS 允许的源。默认允许 localhost 和 127.0.0.1。
                                             支持通配符源，例如 ['.example.com']。
                                             多个源应该用逗号分隔。
                                             示例：--allowedOrigins .example.com,www.another.com
                                             环境变量：ALLOWED_ORIGINSS
                                             `
                },
                {
                    flags: '--extendedContext <extendedContext>',
                    desc: `用于解析 context.extendedContext 的值。""表示该功能已关闭。默认值为 null
                                             示例：--extendedContext '{"a":1,"b":2}'
                                             环境变量：EXTENDED_CONTEXT
                                             `
                }
            ],
            requiredEnvId: false,
            desc: '本地运行云函数 2.0 代码'
        }
    }

    @InjectParams()
    async execute(@Log() logger: Logger) {
        const args = process.argv.slice(2)
        const watchFlag = ['--watch', '-w']
        const defaultIgnoreFiles = ['logs/*.*']

        if (watchFlag.some((flag) => args.includes(flag))) {
            const cmd = args.filter((arg) => !watchFlag.includes(arg)).join(' ')
            // @ts-ignore
            nodemon({
                script: '',
                exec: `${process.argv[1]} ${cmd}`,
                watchOptions: {
                    usePolling: true, // should be enabled
                    ignorePermissionErrors: true,
                    ignored: defaultIgnoreFiles.join(','), // ignored must not be empty string
                    persistent: true,
                    interval: 500
                }
            })
                .on('start', () => {
                    logger.info(
                        'Initializing server in watch mode. Changes in source files will trigger a restart.'
                    )
                })
                .on('quit', (e) => {
                    logger.info(`Nodemon quit with code ${e}.`)
                    process.exit(0)
                })
                .on('restart', (e) => {
                    logger.info(
                        `Server restarted due to changed files: ${e?.matched?.result?.join(', ')}`
                    )
                })
                .on('log', (e) => {
                    logger.info(`[nodemon ${e.type}] ${e.message}`)
                })
                .on('crash', () => {
                    logger.error(`Server crashed.`)
                    process.exit(1)
                })
                .on('exit', (e) => {
                    logger.info(`Server exited with code ${e}.`)
                })
        } else {
            runCLI()
        }
    }
}

async function _selectEnv() {
    return selectEnv({ source: [EnvSource.MINIAPP, EnvSource.QCLOUD] })
}

async function _inputServiceName(defaultVal: string = '') {
    const questions = [
        {
            type: 'input',
            name: 'serviceName',
            message: '请输入服务名称',
            default: defaultVal,
            validate: (val: string) => {
                const isValid =
                    !val.startsWith('lcap') &&
                    !val.startsWith('lowcode') &&
                    /^[A-Za-z][\w-_]{0,43}[A-Za-z0-9]$/.test(val)
                return isValid
                    ? true
                    : '支持大小写字母、数字、-和_，但必须以字母开头、以字母和数字结尾，不支持以lcap、lowcode开头，最长45个字符'
            }
        }
    ]
    const answers = await inquirer.prompt(questions)
    return answers['serviceName']
}

async function getCredential(ctx: any, options: any) {
    let credential
    if (ctx.hasPrivateSettings) {
        process.env.IS_PRIVATE = 'true'
        const privateSettings = getPrivateSettings(ctx.config, options.cmd)
        credential = privateSettings?.credential
    } else {
        credential = await authSupevisor.getLoginState()
    }
    return credential
}

async function isDirectoryEmptyOrNotExists(dirPath: string): Promise<boolean> {
    try {
        // 检查目录是否存在
        const exists = await fs.pathExists(dirPath)
        if (!exists) {
            return true
        }

        // 读取目录内容
        const files = await fs.readdir(dirPath)
        return files.length === 0
    } catch (error) {
        return true
    }
}

function trackCallback(message, log: Logger) {
    if (message.type === 'error') {
        log.error(message.details)
    } else {
        log.info(message.details)
    }
}
