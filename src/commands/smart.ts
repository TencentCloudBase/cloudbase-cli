import fs from 'fs'
import os from 'os'
import _ from 'lodash'
import open from 'open'
import path from 'path'
import chalk from 'chalk'
import { prompt } from 'enquirer'
import { run } from '@cloudbase/framework-core'
import {
    searchConfig,
    unzipStream,
    getDataFromWeb,
    isCamRefused,
    ConfigParser,
    ICloudBaseConfig
} from '@cloudbase/toolbox'
import { CloudBaseError } from '../error'
import { listEnvs, getEnvInfo } from '../env'
import {
    fetch,
    fetchStream,
    execWithLoading,
    getMangerService,
    checkAndGetCredential,
    templateDownloadReport,
    getCloudBaseConfig,
    authSupevisor,
    loadingFactory,
    CloudApiService
} from '../utils'
import { login } from '../auth'
import { Logger } from '../decorators'
import * as Hosting from '../hosting'
import * as Function from '../function'
import { ENV_STATUS, STATUS_TEXT } from '../constant'

const tcbService = CloudApiService.getInstance('tcb')

// 云函数
const listUrl = 'https://tcli.service.tcloudbase.com/templates'

// 创建环境链接
const consoleUrl = 'https://console.cloud.tencent.com/tcb/env/index?action=CreateEnv&from=cli'

const CREATE_ENV = 'CREATE'

const getTemplateAddress = (templatePath: string) =>
    `https://7463-tcli-1258016615.tcb.qcloud.la/cloudbase-templates/${templatePath}.zip`

const ENV_INIT_TIP = '环境初始化中，预计需要三分钟'

const log = new Logger()

/**
 * 智能命令
 */
export async function smartDeploy() {
    const loading = loadingFactory()
    loading.start('环境检测中')

    // 检查登录
    await checkLogin()

    // 检查是否开通 TCB 服务
    const isInitNow = await checkTcbService()

    const files = fs.readdirSync(process.cwd())

    loading.stop()

    // 获取当前目录
    const home = os.homedir()
    const current = process.cwd()
    let relative = current
    if (current.indexOf(home) > -1) {
        relative = path.relative(home, current)
    }

    // 当期区域
    let region

    // 当前目录为空，执行初始化项目操作
    if (!files.length) {
        log.info('当前目录为空，初始化云开发项目\n')
        region = await selectRegion()
        const envId = await selectEnv(isInitNow)
        await initProjectWithTemplate(envId, region)
    }

    // 初始化项目成功，或当前目录已经存在项目，继续使用 Framework 执行部署
    const { setup } = await prompt<any>({
        type: 'confirm',
        name: 'setup',
        message: `是否使用云开发部署当前项目 <${chalk.bold.cyan(relative)}> ？`,
        initial: true
    })

    if (!setup) {
        return
    }

    // 检测是否有 cloudbase 配置
    const config = await getCloudBaseConfig()
    let envId = config?.envId

    if (!config?.region && !region) {
        region = await selectRegion()
    }

    // 配置文件不存在
    if (!envId) {
        envId = await selectEnv(isInitNow)
        fs.writeFileSync(
            path.join(process.cwd(), 'cloudbaserc.json'),
            JSON.stringify({
                envId,
                region,
                version: '2.0',
                $schema: 'https://framework-1258016615.tcloudbaseapp.com/schema/latest.json'
            })
        )
    }

    // 调用 Framework
    await callFramework(envId, config)
}

// 获取模板
async function initProjectWithTemplate(envId: string, region: string, projectPath = process.cwd()) {
    // 拉取模板
    const templates = await execWithLoading(() => fetch(listUrl), {
        startTip: '拉取云开发模板列表中'
    })

    // 确定模板名称
    const { templateName } = await prompt<any>({
        type: 'select',
        name: 'templateName',
        message: '选择云开发模板',
        choices: templates.map((item) => item.name)
    })

    const selectedTemplate = templates.find((item) => item.name === templateName)

    await execWithLoading(
        async () => {
            await templateDownloadReport(selectedTemplate.path, selectedTemplate.name)
            await extractTemplate(projectPath, selectedTemplate.path, selectedTemplate.url)
        },
        {
            startTip: '下载文件中'
        }
    )

    // 配置文件初始化，写入环境id
    let filepath = (await searchConfig(projectPath))?.filepath

    // 配置文件未找到
    if (!filepath) {
        fs.writeFileSync(
            path.join(projectPath, 'cloudbaserc.json'),
            JSON.stringify({ envId, region })
        )
    } else {
        const configContent = fs.readFileSync(filepath).toString()
        fs.writeFileSync(filepath, configContent.replace('{{envId}}', envId))
    }

    const configPath = filepath || path.join(projectPath, 'cloudbaserc.json')

    const parser = new ConfigParser({
        configPath
    })

    // 把 region 写入到配置文件中
    parser.update('region', region)

    // 成功提示
    log.success('初始化项目成功！\n')
}

// 选择地域
async function selectRegion() {
    const { region } = await prompt<any>({
        choices: [
            {
                name: '上海',
                value: 'ap-shanghai'
            },
            {
                name: '广州',
                value: 'ap-guangzhou'
            }
        ],
        type: 'select',
        name: 'region',
        message: '请选择环境所在地域',
        result(choice) {
            return this.map(choice)[choice]
        }
    })

    tcbService.region = region

    return region
}

// 获取用户选择的环境
async function selectEnv(isInitNow: boolean) {
    let envData = []

    // 刚初始化服务，新创建的环境还未就绪
    if (isInitNow) {
        envData = await execWithLoading(
            () => {
                // 等待用户完成创建环境的流程
                return new Promise((resolve) => {
                    const timer = setInterval(async () => {
                        const envs = await listEnvs()
                        if (envs.length) {
                            clearInterval(timer)
                            resolve(envs)
                        }
                    }, 2000)
                })
            },
            {
                startTip: '获取环境列表中'
            }
        )
    } else {
        // 选择环境
        envData = await execWithLoading(() => listEnvs(), {
            startTip: '获取环境列表中'
        })
    }

    envData = envData || []

    const envs: { name: string; value: string }[] = envData
        .map((item) => {
            let name = `${item.Alias} - [${item.EnvId}:${item.PackageName || '按量计费'}]`
            if (item.Status !== ENV_STATUS.NORMAL) {
                name += `（${STATUS_TEXT[item.Status]}）`
            }

            return {
                name,
                value: item.EnvId
            }
        })
        .sort((prev, next) => prev.value.charCodeAt(0) - next.value.charCodeAt(0))

    const choices = [
        ...envs,
        {
            name: envData.length ? '创建新环境' : '无可用环境，创建新环境',
            value: CREATE_ENV
        }
    ]

    let { env } = await prompt<any>({
        choices,
        type: 'select',
        name: 'env',
        message: '请选择关联环境',
        result(choice) {
            return this.map(choice)[choice]
        }
    })

    // 创建新环境
    if (env === CREATE_ENV) {
        log.success('已打开控制台，请前往控制台创建环境')
        // 从控制台获取创建环境生成的 envId
        const { envId } = await getDataFromWeb((port) => `${consoleUrl}&port=${port}`, 'getData')
        if (!envId) {
            throw new CloudBaseError('接收环境 Id 信息失败，请重新运行 init 命令！')
        }
        log.success(`创建环境成功，环境 Id: ${envId}`)
        env = envId
    }

    // 检查环境状态
    await checkEnvStatus(env)

    return env
}

async function callFramework(envId: string, config: ICloudBaseConfig) {
    const loginState = await authSupevisor.getLoginState()
    const { token, secretId, secretKey } = loginState

    await run(
        {
            projectPath: process.cwd(),
            cloudbaseConfig: {
                secretId,
                secretKey,
                token,
                envId
            },
            config,
            logLevel: process.argv.includes('--verbose') ? 'debug' : 'info',
            resourceProviders: {
                hosting: Hosting,
                function: Function
            }
        },
        'deploy',
        ''
    )
}

// 检查登录
async function checkLogin() {
    const credential = await checkAndGetCredential()
    // 没有登录，拉起 Web 登录
    if (_.isEmpty(credential)) {
        log.info('你还没有登录，请在控制台中授权登录')

        const res = await execWithLoading(() => login(), {
            startTip: '获取授权中...',
            successTip: '授权登录成功！'
        })

        const envId = res?.credential?.envId

        // 登录返回 envId，检查环境初始化
        if (envId) {
            const env = await getEnvInfo(envId)
            if (env.Status === ENV_STATUS.UNAVAILABLE) {
                await checkEnvAvaliable(envId)
            }
        }
    }
}

// 检查环境的状态，是否可以正常使用
async function checkEnvStatus(envId: string) {
    const env = await getEnvInfo(envId)
    if (env.Status === ENV_STATUS.UNAVAILABLE) {
        await checkEnvAvaliable(envId)
    } else if (env.Status !== ENV_STATUS.NORMAL) {
        throw new CloudBaseError('所有环境状态异常')
    }
}

// 检测环境是否可用
async function checkEnvAvaliable(envId: string) {
    let count = 0

    await execWithLoading(
        (flush) => {
            const increase = setInterval(() => {
                flush(`${ENV_INIT_TIP}  ${++count}S`)
            }, 1000)

            return new Promise<void>((resolve) => {
                const timer = setInterval(async () => {
                    const env = await getEnvInfo(envId)
                    // 环境初始化中
                    if (env.Status === ENV_STATUS.NORMAL) {
                        clearInterval(timer)
                        clearInterval(increase)
                        resolve()
                    }
                }, 3000)
            })
        },
        {
            startTip: ENV_INIT_TIP,
            successTip: `环境 ${envId} 初始化成功`
        }
    )
}

// 检查 TCB 服务是否开通
async function checkTcbService(): Promise<boolean> {
    const app = await getMangerService()
    let Initialized
    try {
        Initialized = (await app.env.checkTcbService()).Initialized
    } catch (e) {
        // 忽略 CAM 权限问题
        if (!isCamRefused(e)) {
            throw e
        }
    }

    if (!Initialized) {
        const { jump } = await prompt<any>({
            type: 'confirm',
            name: 'jump',
            message:
                '你还没有开通云开发服务，是否跳转到控制台开通云开发服务？（取消将无法继续操作）',
            initial: true
        })

        if (!jump) {
            throw new CloudBaseError('init 操作终止，请开通云开发服务后再进行操作！')
        }

        // 打开控制台
        open(consoleUrl)
        log.success('已打开云开发控制台，请登录并在云开发控制台中开通服务！')

        await execWithLoading(() => waitForServiceEnable(), {
            startTip: '等待云开发服务开通中',
            successTip: '云开发服务开通成功！'
        })

        // 返回一个是否刚初始化服务的标志
        return true
    }

    return false
}

// 等待服务开通
async function waitForServiceEnable() {
    return new Promise<void>((resolve) => {
        const timer = setInterval(async () => {
            const app = await getMangerService()
            try {
                const { Initialized } = await app.env.checkTcbService()
                if (Initialized) {
                    clearInterval(timer)
                    setTimeout(() => {
                        // 服务初始化完成到环境创建完成有一定的延迟时间，延迟 5S 返回
                        resolve()
                    }, 5000)
                }
            } catch (e) {
                // 忽略 CAM 权限问题
                if (!isCamRefused(e)) {
                    throw e
                }
            }
        }, 3000)
    })
}

async function extractTemplate(projectPath: string, templatePath: string, remoteUrl?: string) {
    // 文件下载链接
    const url = remoteUrl || getTemplateAddress(templatePath)

    return fetchStream(url).then(async (res) => {
        if (!res) {
            throw new CloudBaseError('请求异常')
        }

        if (res.status !== 200) {
            throw new CloudBaseError('未找到文件')
        }

        // 解压缩文件
        await unzipStream(res.body, projectPath)
    })
}
