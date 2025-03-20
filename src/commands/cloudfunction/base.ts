import { runCLI } from '@cloudbase/functions-framework'
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
import { getPackageJsonName, selectEnv } from '../utils'
import nodemon from 'nodemon'

const { CloudAPI } = _CloudAPI
const scfService = CloudApiService.getInstance('tcb')

// @ICommand()
export class CloudFunctionListCommand extends Command {
    get options() {
        return {
            cmd: 'cloudfunction',
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
export class CloudFunctionDeployCommand extends Command {
    get options() {
        return {
            cmd: 'cloudfunction',
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
            desc: '部署云函数服务'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @EnvId() envId, @Log() log: Logger, @ArgsOptions() options) {
        let { serviceName, source } = options

        const targetDir = path.resolve(source || process.cwd())

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
            const { shortName } = await getPackageJsonName(path.join(targetDir, 'package.json'))
            serviceName = await _inputServiceName(shortName)
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
                const res = await IAC.Function.apply(
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
                if (
                    e?.action === 'UpdateFunctionConfiguration' &&
                    e?.message?.includes('当前函数处于Updating状态，无法进行此操作，请稍后重试')
                ) {
                    trackCallback(
                        {
                            type: 'error',
                            details: '当前函数处于更新状态，无法进行此操作，请稍后重试',
                            originalError: e
                        },
                        log
                    )
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
export class CloudFunctionDownloadCommand extends Command {
    get options() {
        return {
            cmd: 'cloudfunction',
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
            desc: '下载云函数服务代码'
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
            const { shortName } = await getPackageJsonName(path.join(targetDir, 'package.json'))

            serviceName = await _inputServiceName(shortName)

            if (serviceName !== shortName) {
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
            await IAC.Function.pull(
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
export class CloudFunctionRunCommand extends Command {
    get options() {
        return {
            cmd: 'cloudfunction',
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
                }
            ],
            requiredEnvId: false,
            desc: '本地运行云函数代码'
        }
    }

    @InjectParams()
    async execute(@Log() logger: Logger, @CmdContext() ctx, @ArgsOptions() options) {
        const args = process.argv.slice(2)
        const watchFlag = ['--watch', '-w']
        const defaultIgnoreFiles = ['logs/*.*']

         /**
         * 环境ID
         */
         const envConfig: any = camelcaseKeys(await IACUtils.loadEnv(process.cwd()))

        /**
         * 增加临时访问凭证，用于本地调试
         */
        const credential = await getCredential(ctx, options)
        process.env.TCB_ENV = envConfig.envId
        process.env.TENCENTCLOUD_SECRETID = credential.secretId
        process.env.TENCENTCLOUD_SECRETKEY = credential.secretKey
        process.env.TENCENTCLOUD_SESSIONTOKEN = credential.token

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
