import { loadFunctions, loadFunctionsConfig, runCLI } from '@cloudbase/functions-framework'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import path from 'path'
import { ArgsOptions, EnvId, InjectParams, Log, Logger } from '../../decorators'
import { packageDeploy } from '../../run'
import { CloudApiService, loadingFactory, printHorizontalTable } from '../../utils'
import { Command, ICommand } from '../common'
import { EnvSource } from '../constants'
import { selectEnv } from '../utils'
import nodemon from 'nodemon'

const scfService = CloudApiService.getInstance('tcb')

@ICommand()
export class FunListCommand extends Command {
    get options() {
        return {
            cmd: 'fun',
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
export class FunDeployCommand extends Command {
    get options() {
        return {
            cmd: 'fun',
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
                    flags: '--appId <appId>',
                    desc: '微信 AppId'
                },
                {
                    flags: '--source <source>',
                    desc: '目标函数文件所在目录路径。默认为当前路径'
                },
                {
                    flags: '--includeNodeModules',
                    desc: '包含本地 node_modules 目录，默认为 false 不包含'
                },
                {
                    flags: '--functionsConfigFile <functionsConfigFile>',
                    desc: '多函数定义配置文件，默认为 ./cloudbase-functions.json'
                }
            ],
            requiredEnvId: false,
            autoRunLogin: true,
            desc: '部署函数式托管代码'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @Log() log: Logger, @ArgsOptions() options) {
        let { serviceName, appId, source, includeNodeModules = false } = options

        /**
         * 校验代码路径
         */
        const target = 'main' // 这是函数式托管规定的目标函数
        source = path.resolve(source || process.cwd())
        const functionsConfigFile = options.functionsConfigFile || 'cloudbase-functions.json'
        let multiFunctionsConfig = null
        if (functionsConfigFile && await fs.exists(path.resolve(source, functionsConfigFile))) {
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
            sourceLocation: source,
            multiFunctionsConfig
        } as any)
        if (Array.isArray(loadResult)) {
            for (const loadItem of loadResult) {
                if (!loadItem?.userFunction) {
                    log.error(
                        `加载函数 ${loadItem?.name} 失败: "${loadItem?.reason}"`
                    )
                    return
                }
            }
        } else {
            if (!loadResult?.userFunction) {
                if (loadResult.reason.includes('is not a loadable module')) {
                    log.error(
                        `${source} 不是一个有效的函数式托管代码目录，可以通过 --source <source> 指定代码目录路径`
                    )
                } else if (loadResult?.reason.includes('is not defined in the provided module')) {
                    log.error(`主文件并未导出目标函数 ${target}，请导出 ${target} 目标函数`)
                } else {
                    log.error(loadResult?.reason)
                }
                return
            }
        }

        if (!envId) {
            envId = await _selectEnv()
        } else {
            log.info(`当前环境 Id：${envId}`)
        }
        if (!serviceName) {
            let pkgName = ''
            try {
                const pkg = await fs.readJSON(path.join(source, 'package.json'))
                pkgName = pkg.name
            } catch (e) {}

            serviceName = await _inputServiceName(pkgName)
        }
        if (!appId) {
            appId = await _inputAppId()
        }

        const loading = loadingFactory()

        const fetchSvrRes: any = await scfService.request('DescribeCloudBaseRunServer', {
            EnvId: envId,
            ServerName: serviceName,
            Limit: 1,
            Offset: 0
        })
        if (fetchSvrRes.ServerName && !_isFunRunService(fetchSvrRes.Tag)) {
            // 存在服务但不是函数式托管服务
            log.error(`${serviceName} 服务已存在，但不是一个函数式托管服务，请使用另外的服务名称`)
            return
        }

        if (!fetchSvrRes.ServerName) {
            /**
             * 1. 判断服务是否存在，不存在则先创建服务
             */
            try {
                loading.start('正在创建服务…')
                await scfService.request('EstablishCloudBaseRunServerWx', {
                    EnvId: envId,
                    ServiceName: serviceName,

                    /**
                     * 以下固定参数
                     */
                    IsPublic: true,
                    OpenAccessTypes: ['MINIAPP', 'PUBLIC'],
                    ServiceBaseConfig: {
                        PublicAccess: true,
                        Cpu: 1,
                        Mem: 2,
                        MinNum: 0,
                        MaxNum: 5,
                        PolicyType: 'cpu',
                        PolicyThreshold: 60,
                        CustomLogs: 'stdout',
                        EnvParams: '',
                        OperatorRemark: '',
                        InitialDelaySeconds: 2,
                        PolicyDetails: [
                            {
                                PolicyThreshold: 60,
                                PolicyType: 'cpu'
                            }
                        ],
                        BuildDir: '',
                        Dockerfile: 'Dockerfile',
                        HasDockerfile: true,
                        InternalAccess: 'open',
                        Port: 3000,
                        Tag: 'function'
                    },
                    WxBuffer: ''
                })
                loading.succeed('创建服务成功')
            } catch (e) {
                loading.stop()
                log.error('创建服务失败：' + e.message)
                return
            }
        }

        /**
         * 2. 打包代码并上传代码包
         */
        let packageName, packageVersion
        try {
            loading.start('正在上传代码包…')
            const { PackageName, PackageVersion } = await packageDeploy({
                envId,
                serviceName,
                filePath: source,
                fileToIgnore: ['logs', 'logs/**/*'].concat(
                    includeNodeModules ? [] : ['node_modules', 'node_modules/**/*']
                )
            })
            packageName = PackageName
            packageVersion = PackageVersion
            loading.stop()
        } catch (e) {
            loading.stop()
            log.error('上传代码包失败：' + e.message)
            return
        }

        /**
         * 3. 发布版本
         */
        try {
            loading.start('正在创建发布任务…')
            await scfService.request('SubmitServerRelease', {
                EnvId: envId,
                WxAppId: appId,
                ServerName: serviceName,
                PackageName: packageName,
                PackageVersion: packageVersion,
                BuildDir: '.',

                DeployType: 'package',
                ReleaseType: 'FULL',
                HasDockerfile: false,
                Dockerfile: '',
                Port: 3000,
                BuildPacks: {
                    BaseImage: 'Node.js-LTS',
                    EntryPoint: 'node index.js',
                    RepoLanguage: 'Node.js',
                    UploadFilename: ''
                },
                VersionRemark: ''
            })
            loading.succeed(
                `发布任务创建成功，请前往 https://cloud.weixin.qq.com/cloudrun/service/${serviceName} 查看任务详情`
            )
        } catch (e) {
            loading.stop()
            log.error('创建发布任务失败：' + e.message)
        }
    }
}

@ICommand()
export class FunRunCommand extends Command {
    get options() {
        return {
            cmd: 'fun',
            childCmd: 'run',
            options: [
                {
                    flags: '--source <source>',
                    desc: '目标函数文件所在目录路径，默认为当前路径'
                },
                {
                    flags: '--port <port>',
                    desc: '监听的端口，默认为 3000'
                },
                {
                    flags: '-w, --watch',
                    desc: '是否启用热重启模式，如启用，将会在文件变更时自动重启服务，默认为 false'
                },
                {
                    flags: '--dry-run',
                    desc: '是否不启动服务，只验证代码可以正常加载，默认为 false'
                },
                {
                    flags: '--logDirname <logDirname>',
                    desc: '日志文件目录，默认为 ./logs'
                },
                {
                    flags: '--functionsConfigFile <functionsConfigFile>',
                    desc: '多函数定义配置文件，默认为 ./cloudbase-functions.json'
                }
            ],
            requiredEnvId: false,
            desc: '本地运行函数式托管代码'
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
    return selectEnv({ source: [EnvSource.MINIAPP] })
}

async function _inputServiceName(defaultVal: string = '') {
    const questions = [
        {
            type: 'input',
            name: 'serviceName',
            message: '请输入服务名称（只能包含数字、小写字母和-，只能以小写字母开头，最多 20字符）',
            default: defaultVal,
            validate: (val: string) => {
                return /^[a-z][a-z0-9-]{0,19}$/.test(val) ? true : '请输入正确的服务名称'
            }
        }
    ]
    const answers = await inquirer.prompt(questions)
    return answers['serviceName']
}

async function _inputAppId(defaultVal: string = '') {
    const questions = [
        {
            type: 'input',
            name: 'appId',
            message: '请输入微信 AppID',
            validate: (val: string) => (val ? true : '请输入微信 AppID'),
            default: defaultVal
        }
    ]
    const answers = await inquirer.prompt(questions)
    return answers['appId']
}

function _isFunRunService(tagStr: string) {
    if (!tagStr) return false
    const tags = tagStr.split(',')
    const tagList = tags.map((item) => item.split(':')[0])
    return tagList.includes('function')
}
