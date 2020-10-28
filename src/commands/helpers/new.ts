import fs from 'fs'
import _ from 'lodash'
import open from 'open'
import path from 'path'
import chalk from 'chalk'
import execa from 'execa'
import fse from 'fs-extra'
import { prompt } from 'enquirer'
import { searchConfig, unzipStream, getDataFromWeb, isCamRefused } from '@cloudbase/toolbox'

import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { listEnvs, getEnvInfo } from '../../env'
import {
    fetch,
    fetchStream,
    execWithLoading,
    checkFullAccess,
    getMangerService,
    checkAndGetCredential,
    templateDownloadReport
} from '../../utils'
import { login } from '../../auth'
import { ENV_STATUS, STATUS_TEXT } from '../../constant'
import { InjectParams, Log, Logger, CmdContext } from '../../decorators'

// 云函数
const listUrl = 'https://tcli.service.tcloudbase.com/templates'

// 创建环境链接
const consoleUrl = 'https://console.cloud.tencent.com/tcb/env/index?action=CreateEnv&from=cli'

const CREATE_ENV = 'CREATE'

const getTemplateAddress = (templatePath: string) =>
    `https://7463-tcli-1258016615.tcb.qcloud.la/cloudbase-templates/${templatePath}.zip`

const ENV_INIT_TIP = '环境初始化中，预计需要三分钟'

@ICommand()
export class NewCommand extends Command {
    get options() {
        return {
            // templateUri 是 Git 地址或模板名
            cmd: 'new [appName] [templateUri]',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '创建一个新的云开发应用',
            requiredEnvId: false,
            withoutAuth: true
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @Log() log?: Logger) {
        const { params, envId } = ctx

        let appName = params?.[0]
        const templateUri = params?.[1]

        // 检查登录
        await this.checkLogin()

        // 获取 envId
        const env = await this.getSelectedEnv(envId)

        // 检查环境状态
        await this.checkEnvStatus(env)

        let projectPath

        if (templateUri && isGitUrl(templateUri)) {
            // git 仓库
            await execa('git', ['clone', templateUri, appName], {
                stdio: 'inherit'
            })
            projectPath = path.join(process.cwd(), appName)
        } else {
            // 获取模板
            const templates = await execWithLoading(() => fetch(listUrl), {
                startTip: '获取应用模板列表中'
            })

            let templateName
            let tempateId

            // 确定模板名称
            if (templateUri) {
                tempateId = templateUri
            } else {
                let { selectTemplateName } = await prompt<any>({
                    type: 'select',
                    name: 'selectTemplateName',
                    message: '选择应用模板',
                    choices: templates.map((item) => item.name)
                })
                templateName = selectTemplateName
            }

            const selectedTemplate = templateName
                ? templates.find((item) => item.name === templateName)
                : templates.find((item) => item.path === tempateId)

            if (!selectedTemplate) {
                log.info(`模板 \`${templateName || tempateId}\` 不存在`)
                return
            }

            // appName 不存在时，输入应用
            if (!appName) {
                const { projectName } = await prompt<any>({
                    type: 'input',
                    name: 'projectName',
                    message: '请输入项目名称',
                    initial: selectedTemplate.path
                })

                appName = projectName
            }

            // 确定项目权限
            projectPath = path.join(process.cwd(), appName)

            if (checkFullAccess(projectPath)) {
                const { cover } = await prompt<any>({
                    type: 'confirm',
                    name: 'cover',
                    message: `已存在同名文件夹：${appName}，是否覆盖？`,
                    initial: false
                })
                // 不覆盖，操作终止
                if (!cover) {
                    throw new CloudBaseError('操作终止！')
                } else {
                    // 覆盖操作不会删除不冲突的文件夹或文件
                    // 删除原有文件夹，防止生成的项目包含用户原有文件
                    fse.removeSync(projectPath)
                }
            }

            await execWithLoading(
                async () => {
                    await templateDownloadReport(selectedTemplate.path, selectedTemplate.name)
                    await this.extractTemplate(
                        projectPath,
                        selectedTemplate.path,
                        selectedTemplate.url
                    )
                },
                {
                    startTip: '下载文件中'
                }
            )
        }

        // 配置文件初始化，写入环境id
        let filepath = (await searchConfig(projectPath))?.filepath

        // 配置文件未找到
        if (!filepath) {
            fs.writeFileSync(
                path.join(projectPath, 'cloudbaserc.json'),
                JSON.stringify({
                    envId: env,
                    version: '2.0',
                    $schema: 'https://framework-1258016615.tcloudbaseapp.com/schema/latest.json'
                })
            )
        } else {
            const configContent = fs.readFileSync(filepath).toString()
            fs.writeFileSync(filepath, configContent.replace('{{envId}}', env))
        }

        // 成功提示
        this.initSuccessOutput(appName)
    }

    // 获取环境 Id 信息
    async getSelectedEnv(inputEnvId: string, @Log() log?: Logger) {
        // 检查是否开通 TCB 服务
        const isInitNow = await this.checkTcbService()

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

        // 检查输入的环境 Id 是否属于用户
        if (envData?.length && inputEnvId) {
            const inputEnvIdExist = envData.find((_) => _.EnvId === inputEnvId)
            if (!inputEnvIdExist) {
                throw new CloudBaseError(
                    `你指定的环境 Id ${inputEnvId} 不存在，请指定正确的环境 Id！`
                )
            }
            return inputEnvId
        }

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
            message: '选择关联的云开发环境',
            result(choice) {
                return this.map(choice)[choice]
            }
        })

        // 创建新环境
        if (env === CREATE_ENV) {
            log.success('已打开控制台，请前往控制台创建环境')
            // 从控制台获取创建环境生成的 envId
            const { envId } = await getDataFromWeb(
                (port) => `${consoleUrl}&port=${port}`,
                'getData'
            )
            if (!envId) {
                throw new CloudBaseError('接收环境 Id 信息失败，请重新运行 init 命令！')
            }
            log.success(`创建环境成功，环境 Id: ${envId}`)
            env = envId
        }

        return env
    }

    // 检查登录
    @InjectParams()
    async checkLogin(@Log() log?: Logger) {
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
                    await this.checkEnvAvaliable(envId)
                }
            }
        }
    }

    // 检查环境的状态，是否可以正常使用
    @InjectParams()
    async checkEnvStatus(envId: string) {
        const env = await getEnvInfo(envId)
        if (env.Status === ENV_STATUS.UNAVAILABLE) {
            await this.checkEnvAvaliable(envId)
        } else if (env.Status !== ENV_STATUS.NORMAL) {
            throw new CloudBaseError('所有环境状态异常')
        }
    }

    // 检测环境是否可用
    @InjectParams()
    async checkEnvAvaliable(envId: string) {
        let count = 0

        await execWithLoading(
            (flush) => {
                const increase = setInterval(() => {
                    flush(`${ENV_INIT_TIP}  ${++count}S`)
                }, 1000)

                return new Promise((resolve) => {
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
    @InjectParams()
    async checkTcbService(@Log() log?: Logger): Promise<boolean> {
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

            await execWithLoading(() => this.waitForServiceEnable(), {
                startTip: '等待云开发服务开通中',
                successTip: '云开发服务开通成功！'
            })

            // 返回一个是否刚初始化服务的标志
            return true
        }

        return false
    }

    async waitForServiceEnable() {
        return new Promise((resolve) => {
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

    async extractTemplate(projectPath: string, templatePath: string, remoteUrl?: string) {
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

    // 项目初始化成功后打印提示语
    @InjectParams()
    initSuccessOutput(appName: string, @Log() log?: Logger) {
        log.success(appName ? `创建应用 ${appName} 成功！\n` : '创建应用成功！')

        if (appName) {
            const command = chalk.bold.cyan(`cd ${appName}`)
            log.info(`👉 执行命令 ${command} 进入文件夹`)
        }

        log.info(`👉 开发完成后，执行命令 ${chalk.bold.cyan('tcb')} 一键部署`)
    }
}

// 判断是否为 Git 仓库地址
export function isGitUrl(url: string) {
    const regex = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/
    return regex.test(url)
}
